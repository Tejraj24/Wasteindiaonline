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
  signOut,
  User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { ensureUserProfile } from "@/lib/firebase/account";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshVerification: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        try {
          await ensureUserProfile(nextUser.uid, nextUser.email ?? "", nextUser.displayName ?? "");
        } catch (error) {
          console.error("Unable to synchronize the Firebase user profile.", error);
        }
      }
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isConfigured: isFirebaseConfigured,
      signUp: async (email, password) => {
        const result = await createUserWithEmailAndPassword(requireAuth(), email, password);
        await sendEmailVerification(result.user);
        return result.user;
      },
      login: async (email, password) => {
        const result = await signInWithEmailAndPassword(requireAuth(), email, password);
        return result.user;
      },
      signInWithGoogle: async () => {
        const result = await signInWithPopup(requireAuth(), new GoogleAuthProvider());
        return result.user;
      },
      logout: () => signOut(requireAuth()),
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
    }),
    [loading, user]
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
