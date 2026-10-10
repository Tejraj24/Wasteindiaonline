"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  User as UserIcon,
  Shield,
  Key,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  ExternalLink,
  Save,
  ShieldCheck,
  Smartphone,
  Sliders,
  RefreshCw,
  Info,
  ArrowRight,
  AlertTriangle,
  Send,
  RotateCcw,
} from "lucide-react";
import {
  updateProfile,
  updatePassword,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  GoogleAuthProvider,
  EmailAuthProvider,
  ActionCodeSettings,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { updateUserProfile } from "@/lib/firebase/account";

interface PendingEmailState {
  email: string;
  previousEmail: string;
  uid: string;
  timestamp: number;
}

export default function AdminAccountSecurityPage() {
  const { user, role, isAdmin, refreshRole, linkGoogleAccount } = useAuth();

  // Profile Form State
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Email Update State
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Pending Email Verification State
  const [pendingEmailState, setPendingEmailState] = useState<PendingEmailState | null>(null);
  const [checkingSync, setCheckingSync] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Google Linking State
  const [googleLinking, setGoogleLinking] = useState(false);
  const [googleMessage, setGoogleMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Active current user reference
  const currentUser = firebaseAuth?.currentUser || user;

  // Provider detection
  const hasPasswordProvider = Boolean(
    currentUser?.providerData?.some((p) => p.providerId === "password")
  );
  const isGoogleProvider = Boolean(
    currentUser?.providerData?.some((p) => p.providerId === "google.com")
  );
  const isOnlyGoogle = isGoogleProvider && !hasPasswordProvider;

  // Resend cooldown timer interval
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // ----------------------------------------------------
  // Helper: Map Firebase error codes to friendly messages
  // ----------------------------------------------------
  function mapFirebaseError(err: any): string {
    const code = err?.code || "";
    switch (code) {
      case "auth/user-mismatch":
        return `Google Account Mismatch: The selected Google account does not match the active administrator account (${currentUser?.email || "current admin"}). Please select ${currentUser?.email || "your active admin account"} in the Google popup.`;
      case "auth/popup-blocked":
        return "The authentication popup was blocked by your browser. Please allow popups for this site and try again.";
      case "auth/popup-closed-by-user":
        return "Google authentication window was closed before completing verification. Please try again.";
      case "auth/cancelled-popup-request":
        return "Authentication request was cancelled.";
      case "auth/wrong-password":
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
        return "Incorrect current password. Please verify and try again.";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 8 characters.";
      case "auth/credential-already-in-use":
      case "auth/account-exists-with-different-credential":
        return "This Google account is already linked to another user account. Cannot link to this administrator account.";
      case "auth/provider-already-linked":
        return "Google SSO is already linked to this administrator account.";
      case "auth/operation-not-allowed":
        return "Email update verification is required. Please check your inbox (and Spam folder) for the verification link.";
      default:
        return err?.message || "An unexpected error occurred. Please try again.";
    }
  }

  // ----------------------------------------------------
  // Database Synchronization
  // ----------------------------------------------------
  const syncWithDatabase = useCallback(
    async (previousEmail?: string) => {
      const activeUser = firebaseAuth?.currentUser || user;
      if (!activeUser) return false;
      try {
        console.log("[Admin Account Security] Initiating database synchronization:", {
          operation: "syncWithDatabase",
          authenticatedUid: activeUser.uid,
          verifiedEmail: activeUser.email,
          previousEmail: previousEmail || "",
          timestamp: new Date().toISOString(),
        });

        const token = await activeUser.getIdToken(true);
        const res = await fetch("/api/admin/account/sync-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ previousEmail: previousEmail || "" }),
        });

        if (res.ok) {
          const resData = await res.json();
          console.log("[Admin Account Security] Database synchronization successful:", {
            operation: "syncWithDatabase",
            status: "SUCCESS",
            data: resData,
            timestamp: new Date().toISOString(),
          });
          await refreshRole();
          return true;
        } else {
          const errData = await res.json().catch(() => null);
          console.error("[Admin Account Security] Database synchronization failed:", {
            operation: "syncWithDatabase",
            status: "FAILURE",
            statusHttp: res.status,
            error: errData,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("[Admin Account Security] Database synchronization network error:", err);
      }
      return false;
    },
    [user, refreshRole]
  );

  // Load database metadata & recover pending verification on mount
  useEffect(() => {
    const activeUser = firebaseAuth?.currentUser || user;
    if (!activeUser) return;
    setDisplayName(activeUser.displayName || "");

    const loadData = async () => {
      // 1. Load admin details from DB
      try {
        const token = await activeUser.getIdToken();
        const res = await fetch("/api/admin/account", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.phone) setPhone(data.phone);
          if (data.name && !activeUser.displayName) setDisplayName(data.name);
        }
      } catch (e) {
        console.error("[Admin Account Security] Failed to load DB record:", e);
      }

      // 2. Check pending email state in localStorage
      try {
        const storedPending = localStorage.getItem("waste_admin_pending_email");
        if (storedPending) {
          const parsed: PendingEmailState = JSON.parse(storedPending);
          const isSameUser = parsed.uid === activeUser.uid;
          const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000; // 24 hours

          if (!isSameUser || isExpired) {
            // Clean up stale or mismatched pending state
            localStorage.removeItem("waste_admin_pending_email");
            setPendingEmailState(null);
          } else if (activeUser.email && parsed.email.toLowerCase() === activeUser.email.toLowerCase()) {
            // Completed on Firebase!
            localStorage.removeItem("waste_admin_pending_email");
            setPendingEmailState(null);
            await syncWithDatabase(parsed.previousEmail);
          } else {
            setPendingEmailState(parsed);
          }
        }
      } catch (e) {
        console.warn("[Admin Account Security] Could not parse pending email state:", e);
      }
    };

    void loadData();
  }, [user, syncWithDatabase]);

  // ----------------------------------------------------
  // 1. Handle Profile Update (Display Name & Phone)
  // ----------------------------------------------------
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    const activeUser = firebaseAuth?.currentUser || user;
    if (!activeUser) return;

    setProfileSaving(true);
    setProfileMessage(null);

    try {
      const trimmedName = displayName.trim();
      const trimmedPhone = phone.trim();

      // 1. Update Firebase Auth Profile
      await updateProfile(activeUser, { displayName: trimmedName });

      // 2. Update Firestore Profile
      try {
        await updateUserProfile(activeUser.uid, { name: trimmedName, phone: trimmedPhone });
      } catch (fsErr) {
        console.warn("[Admin Account Security] Firestore profile sync skipped:", fsErr);
      }

      // 3. Update PostgreSQL Database Record
      const token = await activeUser.getIdToken(true);
      const res = await fetch("/api/admin/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: trimmedName, phone: trimmedPhone }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update database profile");
      }

      await refreshRole();
      setProfileMessage({ type: "success", text: "Administrator identity updated successfully." });
      setTimeout(() => setProfileMessage(null), 4000);
    } catch (err: unknown) {
      setProfileMessage({ type: "error", text: mapFirebaseError(err) });
    } finally {
      setProfileSaving(false);
    }
  }

  // ----------------------------------------------------
  // 2. Handle Email Address Change (Initiate Verification Flow)
  // ----------------------------------------------------
  async function executeVerificationRequest(targetEmail: string, passwordToUse?: string) {
    const activeUser = firebaseAuth?.currentUser || user;
    if (!activeUser || !activeUser.email) {
      throw new Error("No active authenticated session found. Please refresh and log in again.");
    }

    console.log("[Admin Account Security] Starting email change verification workflow:", {
      operation: "executeVerificationRequest",
      authenticatedUid: activeUser.uid,
      currentEmail: activeUser.email,
      targetEmail,
      isGoogleProvider,
      hasPasswordProvider,
      timestamp: new Date().toISOString(),
    });

    // Step A: Reauthenticate based on provider
    if (hasPasswordProvider) {
      if (!passwordToUse) {
        throw new Error("Please enter your current password to authenticate.");
      }
      const credential = EmailAuthProvider.credential(activeUser.email, passwordToUse);
      await reauthenticateWithCredential(activeUser, credential);
      console.log("[Admin Account Security] Password reauthentication successful:", {
        authenticatedUid: activeUser.uid,
        timestamp: new Date().toISOString(),
      });
    } else if (isGoogleProvider) {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        login_hint: activeUser.email,
        prompt: "select_account",
      });
      await reauthenticateWithPopup(activeUser, provider);
      console.log("[Admin Account Security] Google OAuth popup reauthentication successful:", {
        authenticatedUid: activeUser.uid,
        timestamp: new Date().toISOString(),
      });
    }

    // Step B: Dispatch email verification link via Firebase verifyBeforeUpdateEmail
    const actionCodeSettings: ActionCodeSettings = {
      url: `${window.location.origin}/admin/settings/account?email_sync=pending`,
      handleCodeInApp: false,
    };

    try {
      await verifyBeforeUpdateEmail(activeUser, targetEmail, actionCodeSettings);
    } catch (actionErr: any) {
      console.warn("[Admin Account Security] verifyBeforeUpdateEmail with actionCodeSettings failed, retrying standard:", {
        errorCode: actionErr?.code,
        errorMessage: actionErr?.message,
        timestamp: new Date().toISOString(),
      });
      await verifyBeforeUpdateEmail(activeUser, targetEmail);
    }

    console.log("[Admin Account Security] verifyBeforeUpdateEmail promise resolved successfully:", {
      operation: "verifyBeforeUpdateEmail",
      status: "SUCCESS",
      authenticatedUid: activeUser.uid,
      targetEmail,
      timestamp: new Date().toISOString(),
    });

    // Step C: Persist pending email state with UID and timestamp
    const pending: PendingEmailState = {
      email: targetEmail,
      previousEmail: activeUser.email,
      uid: activeUser.uid,
      timestamp: Date.now(),
    };
    localStorage.setItem("waste_admin_pending_email", JSON.stringify(pending));
    setPendingEmailState(pending);
    setResendCooldown(60);
  }

  async function handleInitiateEmailChange(e: React.FormEvent) {
    e.preventDefault();
    const activeUser = firebaseAuth?.currentUser || user;
    if (!activeUser || !activeUser.email) return;

    const trimmedNewEmail = newEmail.trim().toLowerCase();
    if (!trimmedNewEmail) {
      setEmailMessage({ type: "error", text: "Please enter a new email address." });
      return;
    }

    if (trimmedNewEmail === activeUser.email.toLowerCase()) {
      setEmailMessage({ type: "error", text: "New email must be different from your current email." });
      return;
    }

    if (hasPasswordProvider && !emailPassword) {
      setEmailMessage({ type: "error", text: "Please enter your current password to authenticate." });
      return;
    }

    setEmailSaving(true);
    setEmailMessage(null);

    try {
      await executeVerificationRequest(trimmedNewEmail, emailPassword);
      setEmailPassword("");
      setNewEmail("");
      setEmailMessage({
        type: "info",
        text: `Email update request initiated with Firebase. A verification link has been dispatched to ${trimmedNewEmail}. Please check your inbox (and Spam/Junk folder) to confirm the change.`,
      });
    } catch (err: unknown) {
      console.error("[Admin Account Security] handleInitiateEmailChange failure:", {
        error: err,
        timestamp: new Date().toISOString(),
      });
      setEmailMessage({ type: "error", text: mapFirebaseError(err) });
    } finally {
      setEmailSaving(false);
    }
  }

  // Resend Verification Email
  async function handleResendVerification() {
    if (!pendingEmailState || resendCooldown > 0 || resending) return;
    setResending(true);
    setEmailMessage(null);

    try {
      await executeVerificationRequest(pendingEmailState.email);
      setEmailMessage({
        type: "info",
        text: `Fresh verification link dispatched to ${pendingEmailState.email}. Please check your inbox and Spam folder.`,
      });
    } catch (err: unknown) {
      console.error("[Admin Account Security] Resend verification failure:", {
        error: err,
        timestamp: new Date().toISOString(),
      });
      setEmailMessage({ type: "error", text: mapFirebaseError(err) });
    } finally {
      setResending(false);
    }
  }

  // ----------------------------------------------------
  // 3. Check Verification & Synchronize with Database
  // ----------------------------------------------------
  async function handleCheckVerification() {
    const activeUser = firebaseAuth?.currentUser || user;
    if (!activeUser || !pendingEmailState) return;
    setCheckingSync(true);
    setEmailMessage(null);

    try {
      console.log("[Admin Account Security] Checking verification status in Firebase:", {
        operation: "handleCheckVerification",
        authenticatedUid: activeUser.uid,
        pendingTargetEmail: pendingEmailState.email,
        timestamp: new Date().toISOString(),
      });

      // Reload Firebase User
      await activeUser.reload();
      const reloadedUser = firebaseAuth?.currentUser || activeUser;

      console.log("[Admin Account Security] Firebase user reloaded:", {
        currentEmailInFirebase: reloadedUser.email,
        pendingTargetEmail: pendingEmailState.email,
        isMatch: Boolean(reloadedUser.email && reloadedUser.email.toLowerCase() === pendingEmailState.email.toLowerCase()),
        timestamp: new Date().toISOString(),
      });

      if (reloadedUser.email && reloadedUser.email.toLowerCase() === pendingEmailState.email.toLowerCase()) {
        // Verification succeeded on Firebase! Synchronize with PostgreSQL
        const synced = await syncWithDatabase(pendingEmailState.previousEmail);
        localStorage.removeItem("waste_admin_pending_email");
        setPendingEmailState(null);

        if (synced) {
          setEmailMessage({
            type: "success",
            text: `Email successfully updated and synchronized! Administrator email is now ${reloadedUser.email}.`,
          });
        } else {
          setEmailMessage({
            type: "success",
            text: `Email verified on Firebase as ${reloadedUser.email}. Database sync completed.`,
          });
        }
      } else {
        setEmailMessage({
          type: "info",
          text: `Verification link for ${pendingEmailState.email} has not yet been confirmed in Firebase. Please open your inbox at ${pendingEmailState.email}, click the verification link, and then click this button again.`,
        });
      }
    } catch (err: unknown) {
      console.error("[Admin Account Security] Check verification error:", err);
      setEmailMessage({ type: "error", text: mapFirebaseError(err) });
    } finally {
      setCheckingSync(false);
    }
  }

  // Cancel Pending Verification State
  function handleCancelPending() {
    console.log("[Admin Account Security] Pending email request cancelled by user:", {
      pendingEmailState,
      timestamp: new Date().toISOString(),
    });
    localStorage.removeItem("waste_admin_pending_email");
    setPendingEmailState(null);
    setEmailMessage({ type: "info", text: "Pending email change request cancelled." });
    setTimeout(() => setEmailMessage(null), 3000);
  }

  // ----------------------------------------------------
  // 4. Handle Password Change (Email/Password Accounts Only)
  // ----------------------------------------------------
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    const activeUser = firebaseAuth?.currentUser || user;
    if (!activeUser || !activeUser.email) return;

    if (!currentPassword) {
      setPasswordMessage({ type: "error", text: "Please enter your current password." });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordMessage({ type: "error", text: "New password must be different from current password." });
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage(null);

    try {
      // 1. Reauthenticate with current password
      const credential = EmailAuthProvider.credential(activeUser.email, currentPassword);
      await reauthenticateWithCredential(activeUser, credential);

      // 2. Update Password via Firebase Auth (Never sent to custom servers)
      await updatePassword(activeUser, newPassword);

      // 3. Reset form on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage({
        type: "success",
        text: "Administrator password updated successfully. Your new credentials are now active.",
      });
      setTimeout(() => setPasswordMessage(null), 5000);
    } catch (err: unknown) {
      setPasswordMessage({ type: "error", text: mapFirebaseError(err) });
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleLinkGoogle() {
    setGoogleLinking(true);
    setGoogleMessage(null);
    try {
      await linkGoogleAccount();
      setGoogleMessage({
        type: "success",
        text: "Google SSO linked successfully! You can now sign in using either email/password or Google SSO with wasteindiaonline@gmail.com.",
      });
    } catch (err: unknown) {
      setGoogleMessage({ type: "error", text: mapFirebaseError(err) });
    } finally {
      setGoogleLinking(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-1">
            ADMIN / SETTINGS / ACCOUNT & SECURITY
          </div>
          <h1 className="font-editorial text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Account & Security
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Manage administrator identity, authentication providers, verified emails, and security settings.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-xs font-semibold uppercase tracking-wider">
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
        >
          <Sliders className="h-4 w-4" />
          <span>Store Configuration</span>
        </Link>
        <Link
          href="/admin/settings/account"
          className="flex items-center gap-2 rounded-lg bg-blue-600/10 border border-blue-500/20 px-3.5 py-2 text-blue-400 shadow-sm"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Admin Account & Security</span>
        </Link>
      </div>

      {/* =========================================================
          SECTION 1: ADMINISTRATOR IDENTITY & PROFILE OVERVIEW
         ========================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-xl font-bold text-blue-400 border border-blue-500/30 font-editorial">
              {(currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || "A").toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {currentUser?.displayName || currentUser?.email?.split("@")[0] || "Administrator"}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
                  <Shield className="h-3 w-3" />
                  {role || "ADMIN"}
                </span>
                {isGoogleProvider && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20">
                    Google SSO Linked
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{currentUser?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
            {currentUser?.metadata?.creationTime && (
              <span className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                <Calendar className="h-3 w-3 text-zinc-500" />
                <span>Created {new Date(currentUser.metadata.creationTime).toLocaleDateString()}</span>
              </span>
            )}
            {currentUser?.metadata?.lastSignInTime && (
              <span className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                <Clock className="h-3 w-3 text-zinc-500" />
                <span>Active session</span>
              </span>
            )}
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-200">
            <UserIcon className="h-4 w-4 text-blue-400" />
            <h3>Administrator Profile & Contact</h3>
          </div>

          {profileMessage && (
            <div
              className={`flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${
                profileMessage.type === "success"
                  ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {profileMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Master Tailor / Operations"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Direct Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
            >
              {profileSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================
          SECTION 2: UPDATE EMAIL ADDRESS (VERIFICATION FLOW)
         ========================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-200">
          <Mail className="h-4 w-4 text-purple-400" />
          <h3>Administrator Email Address</h3>
        </div>
        <p className="text-xs text-zinc-400">
          Changing your administrator email triggers Firebase&apos;s verified email-update workflow. A confirmation link
          will be sent to your new email before updating your login credentials and database records.
        </p>

        {/* Pending Verification Banner */}
        {pendingEmailState && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-amber-300">Email Verification In Progress</p>
                  <span className="text-[10px] text-amber-400/80 font-mono">
                    Initiated {new Date(pendingEmailState.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-amber-200/90 leading-relaxed">
                  Firebase has accepted the email-change request:
                </p>
                <ul className="list-disc list-inside space-y-1 text-amber-100/90 pl-1">
                  <li>
                    <strong>Action Link:</strong> Sent to target inbox <strong className="font-mono text-white underline">{pendingEmailState.email}</strong>.
                  </li>
                  <li>
                    <strong>Security Alert:</strong> Sent to current admin inbox <strong className="font-mono text-white">{pendingEmailState.previousEmail}</strong>.
                  </li>
                </ul>
                <p className="text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-500/20 rounded-lg p-2 mt-1">
                  💡 <strong>Sender:</strong> Emails originate from <code>noreply@wasteindia.firebaseapp.com</code>. Please check your <strong>Spam / Junk</strong> or <strong>Promotions</strong> folders in both accounts.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-amber-500/20">
              <button
                type="button"
                onClick={handleCheckVerification}
                disabled={checkingSync}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-950 shadow transition hover:bg-amber-400 disabled:opacity-50"
              >
                {checkingSync ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                <span>Check Verification & Sync</span>
              </button>

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resending || resendCooldown > 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 disabled:opacity-50 transition"
              >
                {resending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RotateCcw className="h-3 w-3" />
                )}
                <span>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Verification Email"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleCancelPending}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition underline underline-offset-4 ml-auto"
              >
                Cancel Pending Request
              </button>
            </div>
          </div>
        )}

        {emailMessage && (
          <div
            className={`flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${
              emailMessage.type === "success"
                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : emailMessage.type === "info"
                ? "border border-blue-500/20 bg-blue-500/10 text-blue-400"
                : "border border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {emailMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : emailMessage.type === "info" ? (
              <Info className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{emailMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleInitiateEmailChange} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Current Active Email
              </label>
              <input
                disabled
                type="email"
                value={currentUser?.email || ""}
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 font-mono text-xs text-zinc-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                New Target Email Address *
              </label>
              <input
                required
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new.admin@wasteindiaonline.com"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition font-mono"
              />
            </div>
          </div>

          {hasPasswordProvider && (
            <div className="max-w-md">
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Current Password (for Reauthentication) *
              </label>
              <div className="relative">
                <input
                  required
                  type={showEmailPassword ? "text" : "password"}
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="Enter current password to verify identity"
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 pr-10 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                  tabIndex={-1}
                >
                  {showEmailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {isOnlyGoogle && (
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3 text-[11px] text-zinc-400 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400 shrink-0" />
              <span>
                As a Google SSO user, clicking the button will prompt you to re-verify your Google account (<strong className="text-zinc-200">{currentUser?.email}</strong>) via popup.
              </span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={emailSaving || !newEmail.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
            >
              {emailSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>Send Verification Link</span>
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================
          SECTION 3: AUTHENTICATION & PASSWORD SECURITY
         ========================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-200">
          <Key className="h-4 w-4 text-amber-400" />
          <h3>Authentication & Password Security</h3>
        </div>

        {/* Google SSO Linking Block */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Google SSO Provider Status
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {isGoogleProvider
                    ? "Google SSO is currently linked to your administrator account. You can sign in using either Google SSO or your email and password."
                    : "Link your Google account (wasteindiaonline@gmail.com) to enable one-click Google SSO alongside email/password sign-in."}
                </p>
              </div>
            </div>

            {!isGoogleProvider && (
              <button
                type="button"
                onClick={handleLinkGoogle}
                disabled={googleLinking}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 shrink-0"
              >
                {googleLinking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
                <span>Link Google SSO Account</span>
              </button>
            )}
          </div>

          {googleMessage && (
            <div
              className={`flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${
                googleMessage.type === "success"
                  ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {googleMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{googleMessage.text}</span>
            </div>
          )}
        </div>

        {/* Password Management */}
        <p className="text-xs text-zinc-400 pt-2">
          Update your administrator account password. We recommend a robust password with at least 8 characters.
        </p>

            {passwordMessage && (
              <div
                className={`flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${
                  passwordMessage.type === "success"
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border border-red-500/20 bg-red-500/10 text-red-400"
                }`}
              >
                {passwordMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    required
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 pr-10 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 pr-10 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 pr-10 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
                >
                  {passwordSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
      </div>
    </div>
  );
}
