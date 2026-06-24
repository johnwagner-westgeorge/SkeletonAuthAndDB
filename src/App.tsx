/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Save, 
  CheckCircle2, 
  Database, 
  Lock, 
  History, 
  Trash2, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  User as UserIcon,
  Mail,
  KeyRound
} from "lucide-react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  User 
} from "firebase/auth";
import { auth } from "./firebase";

type AuthMode = "login" | "register" | "forgot_password" | "forgot_password_success";

export default function App() {
  // Authentication states
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showAuthForm, setShowAuthForm] = useState(false);

  // Email verification states
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  // Form input fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Application functional states
  const [inputText, setInputText] = useState("");
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSavedText, setLastSavedText] = useState("");

  // Track Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
        setShowVerification(false);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Load from localStorage depending on authenticated user UID
  useEffect(() => {
    if (user) {
      const storageKey = `skeleton_saved_items_${user.uid}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSavedItems(parsed);
            if (parsed.length > 0) {
              setLastSavedText(parsed[0]);
            } else {
              setLastSavedText("");
            }
          }
        } catch (e) {
          console.error("Failed to parse saved items", e);
        }
      } else {
        setSavedItems([]);
        setLastSavedText("");
      }
    } else {
      setSavedItems([]);
      setLastSavedText("");
    }
  }, [user]);

  // Auth form error reset on toggle
  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
    setFormError("");
    setPassword("");
    setRepeatPassword("");
  };

  // Sign up action
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!email.trim() || !password || !repeatPassword) {
      setFormError("All fields are required");
      return;
    }
    if (password !== repeatPassword) {
      setFormError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setFormError("Password should be at least 6 characters long");
      return;
    }

    setFormLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const registeredUser = userCredential.user;

      // Send verification email before signing out
      try {
        await sendEmailVerification(registeredUser);
      } catch (ve: any) {
        console.warn("Handled error sending verification email during sign up:", ve);
      }

      // Ensure user is signed out so they are not signed in automatically
      await signOut(auth);

      setVerificationEmail(email.trim());
      setShowVerification(true);
      setShowAuthForm(false);
      setName("");
      setEmail("");
      setPassword("");
      setRepeatPassword("");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setFormError("User already exists. Sign in?");
      } else {
        setFormError(error.message || "An error occurred during registration");
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Sign in action
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password) {
      setFormError("Please fill out all fields");
      return;
    }

    setFormLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const loggedInUser = userCredential.user;

      if (!loggedInUser.emailVerified) {
        // Not verified! Send verification email and sign out
        try {
          await sendEmailVerification(loggedInUser);
        } catch (ve: any) {
          console.warn("Handled error sending verification email during sign in:", ve);
        }
        await signOut(auth);

        setVerificationEmail(loggedInUser.email || email.trim());
        setShowVerification(true);
        setShowAuthForm(false);
        setEmail("");
        setPassword("");
      } else {
        // Verified! Clean up form fields
        setEmail("");
        setPassword("");
        setShowAuthForm(false);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      // Standard requirement: If email/password are incorrect, display "Password or Email incorrect"
      if (
        error.code === "auth/wrong-password" || 
        error.code === "auth/user-not-found" || 
        error.code === "auth/invalid-credential"
      ) {
        setFormError("Password or Email incorrect");
      } else {
        setFormError("Password or Email incorrect");
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Password reset action
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim()) {
      setFormError("Please enter your email address");
      return;
    }

    setFormLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setVerificationEmail(email.trim()); // Reuse verificationEmail to store email
      setAuthMode("forgot_password_success");
    } catch (error: any) {
      console.error("Password reset error:", error);
      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
        setFormError("Email address is incorrect or not found");
      } else {
        setFormError(error.message || "An error occurred during password reset");
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Google Sign-In action
  const handleGoogleSignIn = async () => {
    setFormError("");
    setFormLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setShowAuthForm(false);
    } catch (error: any) {
      console.error("Google sign in error:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        setFormError(error.message || "An error occurred during Google sign in");
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Log out action
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Save text to list
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Only logged in users can save

    const trimmed = inputText.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...savedItems].slice(0, 50); // Keep up to 50 items
    setSavedItems(updated);
    setLastSavedText(trimmed);

    const storageKey = `skeleton_saved_items_${user.uid}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setInputText("");
    
    // Trigger temporary success state
    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer);
  };

  // Clear history
  const handleClear = () => {
    if (!user) return;
    setSavedItems([]);
    setLastSavedText("");
    const storageKey = `skeleton_saved_items_${user.uid}`;
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-hidden selection:bg-slate-200">
      
      {/* Navigation / Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6 bg-white border-b border-slate-200 w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm italic">S</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">SkeletonAuthAndDB</h1>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {authLoading ? (
            <span className="text-xs text-slate-400 font-mono animate-pulse">Loading auth...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                Secure Session ({user.email})
              </span>
              <button 
                onClick={handleSignOut}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 transition-all px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                Guest Mode
              </span>
              <button 
                onClick={() => {
                  setAuthMode("login");
                  setShowAuthForm(true);
                }}
                className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 py-12 w-full max-w-7xl mx-auto">
        <div className="w-full max-w-xl space-y-8">

          {/* Interactive Flow */}
          <AnimatePresence mode="wait">
            
            {/* Case 0: Email Verification Screen */}
            {showVerification ? (
              <motion.div
                key="verification-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-200 p-8 md:p-10 text-center space-y-6"
              >
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                  <Mail className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Verify your email</h2>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                    We have sent you a verification email to <strong className="font-semibold text-slate-900">{verificationEmail}</strong>. Verify it and log in.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowVerification(false);
                    setAuthMode("login");
                    setShowAuthForm(true);
                  }}
                  className="w-full bg-slate-900 text-white font-medium py-3.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-100 cursor-pointer"
                >
                  <span>Login</span>
                  <LogIn className="w-4 h-4" />
                </button>
              </motion.div>
            ) : showAuthForm && !user ? (
              <motion.div
                key="auth-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-200 p-8 md:p-10 text-left"
              >
                {authMode === "forgot_password_success" ? (
                  <div className="text-center space-y-6 py-4">
                    <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                      <Mail className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold tracking-tight text-slate-900">Reset Link Sent</h2>
                      <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                        We sent you a password change link to <strong className="font-semibold text-slate-900">{verificationEmail}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setFormError("");
                        setPassword("");
                        setRepeatPassword("");
                      }}
                      className="w-full bg-slate-900 text-white font-medium py-3.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-100 cursor-pointer"
                    >
                      <span>Sign In</span>
                      <LogIn className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">
                          {authMode === "login" && "Welcome back"}
                          {authMode === "register" && "Create your account"}
                          {authMode === "forgot_password" && "Reset your password"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          {authMode === "login" && "Enter your credentials to manage your secure database workspace."}
                          {authMode === "register" && "Sign up to start saving secure information payloads."}
                          {authMode === "forgot_password" && "Enter your email address to get a password change link."}
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          setShowAuthForm(false);
                          setFormError("");
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 font-mono hover:bg-slate-50 px-2 py-1 rounded"
                      >
                        Close
                      </button>
                    </div>

                    {/* Specific exact Error Alert Panel */}
                    {formError && (
                      <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 text-rose-800 text-sm">
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium leading-relaxed">
                            {formError}
                          </p>
                          {/* Interactive help triggers for required messages */}
                          {formError === "User already exists. Sign in?" && (
                            <button
                              type="button"
                              onClick={() => {
                                setAuthMode("login");
                                setFormError("");
                              }}
                              className="mt-1.5 text-xs text-rose-900 font-bold underline hover:text-rose-950 block text-left"
                            >
                              Switch to Log In Form &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <form 
                      onSubmit={
                        authMode === "login" 
                          ? handleSignIn 
                          : authMode === "register" 
                            ? handleSignUp 
                            : handlePasswordReset
                      } 
                      className="space-y-4"
                    >
                      {authMode === "register" && (
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3.5 text-slate-400">
                              <UserIcon className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="John Doe"
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3.5 text-slate-400">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                          />
                        </div>
                      </div>

                      {(authMode === "login" || authMode === "register") && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                              Password
                            </label>
                            {authMode === "login" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthMode("forgot_password");
                                  setFormError("");
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                              >
                                Forgot password?
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3.5 text-slate-400">
                              <KeyRound className="w-4 h-4" />
                            </span>
                            <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                            />
                          </div>
                        </div>
                      )}

                      {authMode === "register" && (
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Repeat Password
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3.5 text-slate-400">
                              <KeyRound className="w-4 h-4" />
                            </span>
                            <input
                              type="password"
                              required
                              value={repeatPassword}
                              onChange={(e) => setRepeatPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full bg-slate-900 text-white font-medium py-3.5 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-100 mt-6 cursor-pointer disabled:opacity-55"
                      >
                        <span>
                          {formLoading 
                            ? "Processing..." 
                            : authMode === "login" 
                              ? "Log in securely" 
                              : authMode === "register"
                                ? "Create account"
                                : "Get Reset Link"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    {(authMode === "login" || authMode === "register") && (
                      <>
                        <div className="relative my-5">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-100"></div>
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">or</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={formLoading}
                          onClick={handleGoogleSignIn}
                          className="w-full bg-white border-2 border-slate-100 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer disabled:opacity-55"
                        >
                          <svg width="16" height="16" viewBox="0 0 18 18"><path d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z" fill="#4285F4"></path><path d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z" fill="#34A853"></path><path d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z" fill="#FBBC05"></path><path d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z" fill="#EA4335"></path></svg>
                          <span>Continue with Google</span>
                        </button>
                      </>
                    )}

                    <div className="mt-6 pt-6 border-t border-slate-150 text-center">
                      {authMode === "forgot_password" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("login");
                            setFormError("");
                          }}
                          className="text-xs text-slate-500 hover:text-slate-900 transition-colors underline cursor-pointer"
                        >
                          Remember your password? Log in instead
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={toggleAuthMode}
                          className="text-xs text-slate-500 hover:text-slate-900 transition-colors underline cursor-pointer"
                        >
                          {authMode === "login" 
                            ? "Don't have an account? Sign up here" 
                            : "Already have an account? Log in instead"}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ) : user ? (
              
              /* Case 2: User is Authenticated, show full workspace app */
              <motion.div
                key="app-workspace"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 text-left"
              >
                {/* Active info box */}
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl flex gap-4 text-left">
                  <div className="flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-950">Workspace Securely Mounted</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                      You are logged in as <strong className="font-semibold">{user.email}</strong>. Data entered in this view is sandbox-isolated and stored locally in context of your individual UID.
                    </p>
                  </div>
                </div>

                {/* Main Payload Input */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 p-8 md:p-10">
                  <form onSubmit={handleSave} className="space-y-6">
                    <div>
                      <label htmlFor="string-input" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Storage Payload
                      </label>
                      <input
                        id="string-input"
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter text to store..."
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 text-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                        maxLength={200}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="w-full bg-slate-900 text-white font-medium py-4 rounded-xl hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 cursor-pointer"
                    >
                      <span>Save to Database</span>
                      <Save className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Success Indicator */}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-800 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          Saved: <strong className="font-medium">"{lastSavedText}"</strong>
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Last Saved Preview */}
                  {lastSavedText && !showSuccess && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                        Last Saved Value
                      </span>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-700 text-sm font-mono truncate">
                        "{lastSavedText}"
                      </div>
                    </div>
                  )}
                </div>

                {/* History */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      <span>Your Secured Saves {savedItems.length > 0 ? `(${savedItems.length})` : ""}</span>
                    </h3>
                    {savedItems.length > 0 && (
                      <button
                        onClick={handleClear}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Clear all saved history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>

                  {savedItems.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-slate-200 rounded-xl text-xs text-slate-400 font-mono">
                      No items saved yet under this session.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                      {savedItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white border border-slate-200 px-4 py-3 rounded-lg hover:border-slate-300 transition-colors"
                        >
                          <span className="text-sm text-slate-600 font-mono truncate mr-4">"{item}"</span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {index === 0 ? "Just now" : `Entry #${savedItems.length - index}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              
              /* Case 3: Public Landing Page (Unauthenticated browser) */
              <motion.div
                key="landing-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 text-left"
              >
                {/* Landing information box */}
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    This is a skeletal structure for learning. Currently, data is handled locally. 
                    Authentication and SQL storage layers will be added in upcoming steps.
                  </p>
                </div>

                {/* Marketing Presentation Card */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 p-8 md:p-10 space-y-8">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 text-xs font-mono font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                      <span>SKELETON_AUTH_AND_DB</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                      A secure workspace to input, manage, and save metadata.
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      This application acts as a clean foundation for learning user authentication systems and database management paradigms. Sign up for a free session or sign in with an existing dummy user to test out the actual console payload mechanism.
                    </p>
                  </div>

                  {/* Core steps mockup */}
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 bg-slate-900 rounded-full text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">1</div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">Step 1: Setup Clean Minimalist Layout</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Create a highly polished, responsive interface with beautiful interactive components.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 bg-slate-100 border border-slate-200 text-slate-500 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0">2</div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">Step 2: Authenticate Session</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Enforce registration & log in via Firebase Authentication to guard console workspaces.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 bg-slate-100 border border-slate-200 text-slate-500 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0">3</div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">Step 3: Relational Persistence</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Integrate a real SQL database to durably write payloads to permanent storage.</p>
                      </div>
                    </div>
                  </div>

                  {/* Call to Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => {
                        setAuthMode("register");
                        setShowAuthForm(true);
                      }}
                      className="flex-1 bg-slate-900 text-white font-medium py-3.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-slate-100 cursor-pointer"
                    >
                      <span>Create Free Account</span>
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setShowAuthForm(true);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
                    >
                      <span>Access Existing Workspace</span>
                      <LogIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* Footer Context */}
      <footer className="py-8 px-6 md:px-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center bg-white gap-4 w-full shrink-0">
        <div className="text-[11px] text-slate-400 font-mono">
          ROOT: /index.html | STATUS: {user ? "SECURE_SESSION" : "UNPROTECTED"}
        </div>
        <div className="flex gap-6">
          <span className="text-[11px] text-slate-900 font-bold uppercase tracking-tighter">
            Step 1: Setup Layout
          </span>
          <span className="text-[11px] text-slate-900 font-bold uppercase tracking-tighter" title="Currently active">
            Step 2: Add Auth
          </span>
          <span className="text-[11px] text-slate-300 font-bold uppercase tracking-tighter" title="Future step">
            Step 3: Connect SQL
          </span>
        </div>
      </footer>
    </div>
  );
}

