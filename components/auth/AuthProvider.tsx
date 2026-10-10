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
  signUp: (email: string, password: string) => Promise<{ user: User; role: UserRole }>;
  login: (email: string, password: string) => Promise<{ user: User; role: UserRole }>;
  signInWithGoogle: () => Promise<{ user: User; role: UserRole }>;
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
  const previousUserRef = useRef<User | null>(null);
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

    return onAuthStateChanged(firebaseAuth, async (nextUser) => {
      previousUserRef.current = nextUser;
      setUser(nextUser);

      // User Scoped Cart (Option B): Merge on login / Revert to guest cart on logout
      await syncCartWithUser(nextUser ? nextUser.uid : null);

      if (nextUser) {
        try {
          await ensureUserProfile(nextUser.uid, nextUser.email ?? "", nextUser.displayName ?? "");
          await fetchUserRole(nextUser);
        } catch (error) {
          console.error("Unable to synchronize the Firebase user profile.", error);
        }
      } else {
        setRole("CUSTOMER");
      }
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      isAdmin: checkIsAdmin(role),
      loading,
      isConfigured: isFirebaseConfigured,
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
      signInWithGoogle: async () => {
        const auth = requireAuth();
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        const result = await signInWithPopup(auth, provider);
        await ensureUserProfile(result.user.uid, result.user.email ?? "", result.user.displayName ?? "");
        const resolvedRole = await fetchUserRole(result.user);
        return { user: result.user, role: resolvedRole };
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
    [loading, role, user]
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
