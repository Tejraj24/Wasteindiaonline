"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  linkWithPopup,
  unlink,
  signOut,
  User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { ensureUserProfile } from "@/lib/firebase/account";
import { initializeCartStore, syncCartWithUser } from "@/lib/store";
import { UserRole, isAdmin as checkIsAdmin } from "@/lib/auth/roles";

type AuthContextValue = {
  user: User | null;
  role: UserRole;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signUp: (email: string, password: string) => Promise<{ user: User; role: UserRole }>;
  login: (email: string, password: string) => Promise<{ user: User; role: UserRole }>;
  signInWithGoogle: (customRedirectTarget?: string | null) => Promise<{ user: User; role: UserRole }>;
  linkGoogleAccount: () => Promise<{ user: User; role: UserRole }>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshVerification: () => Promise<void>;
  refreshRole: () => Promise<UserRole>;
  fetchRoleForUser: (targetUser?: User | null) => Promise<UserRole>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function requireAuth() {
  if (!firebaseAuth) {
    throw new Error("Firebase Authentication is not configured. Add the NEXT_PUBLIC_FIREBASE_* variables.");
  }
  return firebaseAuth;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const previousUserRef = useRef<User | null>(null);
  const redirectUserHandledRef = useRef<boolean>(false);
  const isAdmin = checkIsAdmin(role);

  useEffect(() => {
    console.log("AUTH DEBUG", {
      firebaseUser: user ? { uid: user.uid, email: user.email } : null,
      role,
      isAdmin,
    });
  }, [user, role, isAdmin]);

  async function fetchUserRole(currentUser: User): Promise<UserRole> {
    try {
      console.log("[Client Auth] 1. fetchUserRole started for user:", {
        email: currentUser.email,
        uid: currentUser.uid,
      });

      const token = await currentUser.getIdToken(true);
      console.log("[Client Auth] 2. Firebase ID token generated:", {
        tokenLength: token?.length,
        tokenPreview: token ? `${token.substring(0, 15)}...` : null,
      });

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("[Client Auth] 3. /api/auth/me response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("[Client Auth] 4. /api/auth/me response data:", data);
        const resolvedRole: UserRole = data.role === "ADMIN" ? "ADMIN" : "CUSTOMER";
        setRole(resolvedRole);
        return resolvedRole;
      } else {
        const errText = await res.text();
        console.error("[Client Auth] /api/auth/me failed with status:", res.status, errText);
      }
    } catch (err) {
      console.error("[Client Auth] Failed to fetch user role:", err);
    }
    setRole("CUSTOMER");
    return "CUSTOMER";
  }

  useEffect(() => {
    // Initial guest cart initialization
    initializeCartStore();

    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    const auth = firebaseAuth;
    let authStateResolved = false;
    let redirectResolved = false;

    const tryFinishLoading = () => {
      if (authStateResolved && redirectResolved) {
        setLoading(false);
      }
    };

    let isRedirectPending = false;
    try {
      isRedirectPending = sessionStorage.getItem("waste_auth_pending_redirect") === "true";
    } catch {
      // sessionStorage unavailable
    }

    console.log("[Auth Diagnostic] Provider Mount:", {
      pathname: typeof window !== "undefined" ? window.location.pathname : "SSR",
      authDomain: auth.config.authDomain,
      hasPendingRedirectFlag: isRedirectPending,
    });

    // 1. Process getRedirectResult once on mount for returning mobile redirect users
    getRedirectResult(auth)
      .then(async (credential) => {
        console.log("[Auth Diagnostic] getRedirectResult returned:", {
          hasUser: Boolean(credential?.user),
          uid: credential?.user ? credential.user.uid : null,
          pathname: typeof window !== "undefined" ? window.location.pathname : "SSR",
        });

        if (credential?.user) {
          redirectUserHandledRef.current = true;
          console.log("[Auth Diagnostic] getRedirectResult successfully resolved user:", {
            uid: credential.user.uid,
          });

          try {
            sessionStorage.removeItem("waste_auth_pending_redirect");
            sessionStorage.removeItem("waste_auth_redirect_time");
          } catch {}

          setUser(credential.user);
          await syncCartWithUser(credential.user.uid);
          try {
            await ensureUserProfile(
              credential.user.uid,
              credential.user.email ?? "",
              credential.user.displayName ?? ""
            );
            await fetchUserRole(credential.user);
          } catch (err) {
            console.error("[Auth Diagnostic] Error during redirect profile/role sync:", err);
          }
        } else {
          if (isRedirectPending) {
            console.warn(
              "[Auth Diagnostic] Redirect flag was present, but getRedirectResult returned null. " +
              "Likely cause: Browser partitioned/blocked third-party storage between host and authDomain, " +
              "or Google OAuth redirect URIs lack the proxy handler."
            );
            try {
              sessionStorage.removeItem("waste_auth_pending_redirect");
              sessionStorage.removeItem("waste_auth_redirect_time");
            } catch {}
          } else {
            console.log("[Auth Diagnostic] No redirect result found (standard page load).");
          }
        }
      })
      .catch((error: any) => {
        console.error("[Auth Diagnostic] getRedirectResult error:", {
          code: error?.code,
          message: error?.message,
          pathname: typeof window !== "undefined" ? window.location.pathname : "SSR",
        });
        try {
          sessionStorage.removeItem("waste_auth_pending_redirect");
          sessionStorage.removeItem("waste_auth_redirect_time");
        } catch {}
        if (error?.code) {
          setAuthError(error.code);
        }
      })
      .finally(() => {
        redirectResolved = true;
        tryFinishLoading();
      });

    // 2. Listen to onAuthStateChanged and synchronize loading
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      console.log("[Auth Diagnostic] onAuthStateChanged emitted:", {
        hasUser: Boolean(nextUser),
        uid: nextUser ? nextUser.uid : null,
        pathname: typeof window !== "undefined" ? window.location.pathname : "SSR",
      });
      previousUserRef.current = nextUser;
      setUser(nextUser);

      // User Scoped Cart: Merge on login / Revert to guest cart on logout
      await syncCartWithUser(nextUser ? nextUser.uid : null);

      if (nextUser) {
        // If already processed in this mount cycle by getRedirectResult, avoid duplicate profile calls
        if (!redirectUserHandledRef.current) {
          try {
            await ensureUserProfile(nextUser.uid, nextUser.email ?? "", nextUser.displayName ?? "");
            await fetchUserRole(nextUser);
          } catch (error) {
            console.error("Unable to synchronize the Firebase user profile.", error);
          }
        }
      } else {
        setRole("CUSTOMER");
      }

      authStateResolved = true;
      tryFinishLoading();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const clearAuthError = () => setAuthError(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      isAdmin: checkIsAdmin(role),
      loading,
      isConfigured: isFirebaseConfigured,
      authError,
      clearAuthError,
      signUp: async (email, password) => {
        const result = await createUserWithEmailAndPassword(requireAuth(), email, password);
        await sendEmailVerification(result.user);
        await ensureUserProfile(result.user.uid, result.user.email ?? "", result.user.displayName ?? "");
        const resolvedRole = await fetchUserRole(result.user);
        return { user: result.user, role: resolvedRole };
      },
      login: async (email, password) => {
        const result = await signInWithEmailAndPassword(requireAuth(), email, password);
        await ensureUserProfile(result.user.uid, result.user.email ?? "", result.user.displayName ?? "");
        const resolvedRole = await fetchUserRole(result.user);
        return { user: result.user, role: resolvedRole };
      },
      signInWithGoogle: async (customRedirectTarget?: string | null) => {
        const auth = requireAuth();
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        const isLocalhost =
          typeof window !== "undefined" &&
          (window.location.hostname === "localhost" ||
           window.location.hostname === "127.0.0.1" ||
           window.location.hostname.endsWith(".localhost"));

        const isMobileDevice =
          typeof window !== "undefined" &&
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        const currentAuthDomain = auth.config.authDomain || "wasteindia.firebaseapp.com";
        const expectedRedirectUri = `https://${currentAuthDomain}/__/auth/handler`;

        console.log("[Auth Diagnostic] signInWithGoogle initiated:", {
          isLocalhost,
          isMobileDevice,
          pathname: typeof window !== "undefined" ? window.location.pathname : "SSR",
          authDomain: currentAuthDomain,
          expectedOAuthRedirectUri: expectedRedirectUri,
        });

        // Attempt signInWithPopup first across all platforms (localhost, desktop, and mobile)
        // Popups communicate via postMessage and are naturally immune to third-party storage partitioning
        try {
          console.log("[Auth Diagnostic] Initiating signInWithPopup");
          const result = await signInWithPopup(auth, provider);
          console.log("[Auth Diagnostic] signInWithPopup succeeded for user:", result.user.uid);
          await ensureUserProfile(result.user.uid, result.user.email ?? "", result.user.displayName ?? "");
          const resolvedRole = await fetchUserRole(result.user);
          return { user: result.user, role: resolvedRole };
        } catch (popupError: any) {
          console.warn("[Auth Diagnostic] signInWithPopup ended with code:", popupError?.code);

          // If popup is blocked by strict browser policy / in-app webview, fall back to redirect
          if (
            popupError?.code === "auth/popup-blocked" ||
            popupError?.code === "auth/cancelled-popup-request"
          ) {
            console.log("[Auth Diagnostic] Popup was blocked. Falling back to signInWithRedirect");
            try {
              sessionStorage.setItem("waste_auth_pending_redirect", "true");
              sessionStorage.setItem("waste_auth_redirect_time", String(Date.now()));
              if (customRedirectTarget) {
                sessionStorage.setItem("waste_auth_redirect_target", customRedirectTarget);
              }
            } catch {}
            await signInWithRedirect(auth, provider);
            return new Promise<{ user: User; role: UserRole }>(() => {});
          }

          throw popupError;
        }
      },
      linkGoogleAccount: async () => {
        const auth = requireAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("You must be logged in to link a Google account.");
        }

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        const result = await linkWithPopup(currentUser, provider);

        // Verify selected Google account email matches current user email
        const googleProviderData = result.user.providerData.find((p) => p.providerId === "google.com");
        if (
          googleProviderData?.email &&
          currentUser.email &&
          googleProviderData.email.toLowerCase() !== currentUser.email.toLowerCase()
        ) {
          // Mismatched Google account selected. Unlink to maintain account purity.
          await unlink(result.user, "google.com");
          throw new Error(
            `Google Account Mismatch: The selected Google account (${googleProviderData.email}) does not match your active administrator account (${currentUser.email}).`
          );
        }

        setUser(result.user);
        await ensureUserProfile(result.user.uid, result.user.email ?? "", result.user.displayName ?? "");
        const resolvedRole = await fetchUserRole(result.user);
        return { user: result.user, role: resolvedRole };
      },
      logout: async () => {
        await signOut(requireAuth());
        await syncCartWithUser(null);
        setRole("CUSTOMER");
      },
      sendPasswordReset: (email) => sendPasswordResetEmail(requireAuth(), email),
      resendVerification: async () => {
        const currentUser = requireAuth().currentUser;
        if (!currentUser) throw new Error("You must be signed in to verify your email.");
        await sendEmailVerification(currentUser);
      },
      refreshVerification: async () => {
        const currentUser = requireAuth().currentUser;
        if (!currentUser) throw new Error("You must be signed in to refresh verification.");
        await reload(currentUser);
        setUser(requireAuth().currentUser);
      },
      refreshRole: async () => {
        const currentUser = requireAuth().currentUser;
        if (currentUser) {
          return await fetchUserRole(currentUser);
        }
        setRole("CUSTOMER");
        return "CUSTOMER";
      },
      fetchRoleForUser: async (targetUser) => {
        const u = targetUser || requireAuth().currentUser;
        if (u) {
          return await fetchUserRole(u);
        }
        return "CUSTOMER";
      },
    }),
    [loading, role, user, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
