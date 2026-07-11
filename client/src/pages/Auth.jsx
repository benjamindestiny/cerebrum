import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Mail,
  Lock,
  User,
  LogIn,
  Loader2,
  Chrome,
  Github,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  WifiOff,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { authService } from "../services/authService";
import { sendEmail, emailTemplates } from "../services/emailService";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setIsSupabaseConfigured(false);
      setError(
        "⚠️ Supabase is not configured. Please check your environment variables.",
      );
      console.error("❌ Missing Supabase environment variables!");
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Error checking user:", err);
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const handleVerification = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");

      if (code) {
        setLoading(true);
        try {
          const { data, error } =
            await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Verification error:", error);
            setError("Verification failed. Please try again.");
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
            setLoading(false);
            return;
          }
          if (data?.session) {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Verification error:", error);
          setError("Verification failed. Please try again.");
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } finally {
          setLoading(false);
        }
      }
    };
    handleVerification();
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        setError(
          "⚠️ Supabase is not configured. Please check your environment variables.",
        );
        setLoading(false);
        return;
      }

      if (!formData.email || !formData.password) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      if (isLogin) {
        console.log("Attempting login for:", formData.email);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (error) {
          console.error("Login error:", error);

          if (error.message?.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please try again.");
          } else if (error.message?.includes("Email not confirmed")) {
            setError("Please verify your email before logging in.");
          } else if (error.message?.includes("network")) {
            setError("Network error. Please check your internet connection.");
          } else {
            setError(error.message || "Login failed. Please try again.");
          }
          setLoading(false);
          return;
        }

        if (data?.user) {
          console.log("✅ Login successful:", data.user.email);
          setSuccess("Login successful! Redirecting...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
        }
      } else {
        console.log("Attempting signup for:", formData.email);

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }

        if (!formData.name) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }

        // ✅ FIX: Use authService to save name properly
        const { data, error } = await authService.signUp(
          formData.email.trim(),
          formData.password,
          formData.name
        );

        if (error) {
          console.error("Signup error:", error);

          if (error.message?.includes("already registered")) {
            setError("This email is already registered. Please login instead.");
          } else if (error.message?.includes("network")) {
            setError("Network error. Please check your internet connection.");
          } else {
            setError(error.message || "Signup failed. Please try again.");
          }
          setLoading(false);
          return;
        }

        if (data.user) {
          console.log("✅ Signup successful:", data.user.email);

          if (data.user.identities?.length === 0) {
            setError("This email is already registered. Please login.");
            setLoading(false);
            return;
          }

          try {
            await sendEmail({
              to: formData.email,
              subject: "🎉 Welcome to Cerebrum!",
              html: emailTemplates.welcome(
                formData.name || formData.email.split("@")[0],
              ).html,
            });
            console.log("✅ Welcome email sent");
          } catch (emailError) {
            console.error("❌ Welcome email failed:", emailError);
          }

          setSuccess("Account created successfully! Redirecting...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);

      if (
        error.message?.includes("fetch") ||
        error.message?.includes("network")
      ) {
        setError(
          "Network error. Please check your internet connection and try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!resetEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        console.error("Reset error:", error);
        if (error.message?.includes("not found")) {
          setError("No account found with this email address.");
        } else {
          setError(error.message || "Reset failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      setSuccess("Password reset email sent! Check your inbox.");
      setResetEmail("");
      setTimeout(() => {
        setShowReset(false);
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Reset error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        console.error("Google login error:", error);
        setError("Failed to sign in with Google. Please try again.");
        setGoogleLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("Failed to sign in with Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError("");
    setGithubLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        console.error("GitHub login error:", error);
        setError("Failed to sign in with GitHub. Please try again.");
        setGithubLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("GitHub login error:", error);
      setError("Failed to sign in with GitHub. Please try again.");
      setGithubLoading(false);
    }
  };

  if (showReset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4" style={{ backgroundColor: 'var(--app-bg)' }}>
        <div className="glass-card p-5 sm:p-6 md:p-8 max-w-md w-full">
          <button
            onClick={() => {
              setShowReset(false);
              setError("");
              setSuccess("");
            }}
            className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>

          <div className="text-center mb-5 sm:mb-6 md:mb-8">
            <div className="inline-block p-2.5 sm:p-3 bg-accent/20 rounded-full mb-3 sm:mb-4">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Reset Password
            </h2>
            <p className="text-muted text-xs sm:text-sm mt-1 sm:mt-2">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {error && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form
            onSubmit={handleResetPassword}
            className="space-y-3 sm:space-y-4"
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setError("");
                }}
                placeholder="Email Address"
                className="w-full bg-surface-2 text-white px-4 py-2 pl-9 sm:pl-10 rounded-lg border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm sm:text-base"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2 py-2.5 sm:py-3 text-sm sm:text-base disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                "Send Reset Email"
              )}
            </motion.button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center p-3 sm:p-4"
      style={{ backgroundColor: 'var(--app-bg)' }}
    >
      <div className="glass-card p-5 sm:p-6 md:p-8 max-w-md w-full">
        <div className="text-center mb-5 sm:mb-6 md:mb-8">
          <div className="inline-block p-2.5 sm:p-3 bg-accent/20 rounded-full mb-3 sm:mb-4">
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Cerebrum
          </h1>
          <p className="text-muted text-xs sm:text-sm">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
          {!isSupabaseConfigured && (
            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs flex items-center gap-2 justify-center">
              <WifiOff className="w-4 h-4" />
              <span>Supabase not configured. Check your .env file.</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface-2 text-white px-4 py-2 pl-9 sm:pl-10 rounded-lg border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm sm:text-base"
                required={!isLogin}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-surface-2 text-white px-4 py-2 pl-9 sm:pl-10 rounded-lg border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm sm:text-base"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-surface-2 text-white px-4 py-2 pl-9 sm:pl-10 pr-10 rounded-lg border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm sm:text-base"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-surface-2 text-white px-4 py-2 pl-9 sm:pl-10 pr-10 rounded-lg border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm sm:text-base"
                required={!isLogin}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setShowReset(true);
                  setError("");
                  setSuccess("");
                }}
                className="text-xs sm:text-sm text-muted hover:text-accent transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full bg-accent text-white rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2 py-2.5 sm:py-3 text-sm sm:text-base disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <>
                <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />{" "}
                {isLogin ? "Sign In" : "Create Account"}
              </>
            )}
          </motion.button>
        </form>

        <div className="relative my-5 sm:my-6 md:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 sm:px-4 bg-surface text-muted text-[10px] sm:text-xs font-medium tracking-wider">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGithubLogin}
            disabled={githubLoading || !isSupabaseConfigured}
            className="w-full py-2.5 sm:py-3 rounded-xl border border-border hover:border-accent bg-surface hover:bg-surface-2 transition-all duration-300 flex items-center justify-center gap-3 text-gray-300 font-medium text-sm sm:text-base disabled:opacity-50"
          >
            {githubLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-accent" />
            ) : (
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            {githubLoading ? "Connecting..." : "Continue with GitHub"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading || !isSupabaseConfigured}
            className="w-full py-2.5 sm:py-3 rounded-xl border border-border hover:border-accent bg-surface hover:bg-surface-2 transition-all duration-300 flex items-center justify-center gap-3 text-gray-300 font-medium text-sm sm:text-base disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-accent" />
            ) : (
              <Chrome className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </motion.button>
        </div>

        <div className="mt-4 sm:mt-5 md:mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
              setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
            }}
            className="text-xs sm:text-sm text-muted hover:text-accent transition-colors"
          >
            {isLogin ? (
              <span>
                Don't have an account?{" "}
                <span className="text-accent font-medium">Sign Up</span>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <span className="text-accent font-medium">Sign In</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Auth;