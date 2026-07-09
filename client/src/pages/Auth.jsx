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
} from "lucide-react";
import { supabase } from "../services/supabase";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        navigate("/dashboard");
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error("Login error:", error.message);
          setLoading(false);
          return;
        }

        if (data?.user) {
          navigate("/dashboard");
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          console.error("Passwords do not match");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          console.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name || formData.email.split("@")[0],
              full_name: formData.name || formData.email.split("@")[0],
            },
          },
        });

        if (error) {
          console.error("Signup error:", error.message);
          setLoading(false);
          return;
        }

        if (data.user?.identities?.length === 0) {
          console.error("Account already exists");
          setLoading(false);
          return;
        }

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      console.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;
      setShowReset(false);
      setResetEmail("");
    } catch (error) {
      console.error("Reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
        setGoogleLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Google login error:", error);
      setGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
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
        setGithubLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("GitHub login error:", error);
      setGithubLoading(false);
    }
  };

  if (showReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] p-3 sm:p-4">
        <div className="glass-card p-5 sm:p-6 md:p-8 max-w-md w-full">
          <button
            onClick={() => setShowReset(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>

          <div className="text-center mb-5 sm:mb-6 md:mb-8">
            <div className="inline-block p-2.5 sm:p-3 bg-[#7c3aed]/20 rounded-full mb-3 sm:mb-4">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#a78bfa]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Reset Password
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form
            onSubmit={handleResetPassword}
            className="space-y-3 sm:space-y-4"
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Email Address"
                className="input-theme pl-9 sm:pl-10 w-full text-sm sm:text-base"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 sm:py-3 text-sm sm:text-base"
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
      className="min-h-screen flex items-center justify-center bg-[#0f0f1a] p-3 sm:p-4"
    >
      <div className="glass-card p-5 sm:p-6 md:p-8 max-w-md w-full">
        <div className="text-center mb-5 sm:mb-6 md:mb-8">
          <div className="inline-block p-2.5 sm:p-3 bg-[#7c3aed]/20 rounded-full mb-3 sm:mb-4">
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#a78bfa]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Cerebrum
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
          {loading && (
            <div className="mt-2 flex items-center justify-center gap-2 text-[#a78bfa] text-xs sm:text-sm">
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              Processing...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="input-theme pl-9 sm:pl-10 w-full text-sm sm:text-base"
                required={!isLogin}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="input-theme pl-9 sm:pl-10 w-full text-sm sm:text-base"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-theme pl-9 sm:pl-10 w-full text-sm sm:text-base"
              required
            />
          </div>
          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-theme pl-9 sm:pl-10 w-full text-sm sm:text-base"
                required={!isLogin}
              />
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-xs sm:text-sm text-gray-400 hover:text-[#a78bfa] transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 sm:py-3 text-sm sm:text-base"
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
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 sm:px-4 bg-[#1a1a2e] text-gray-500 text-[10px] sm:text-xs font-medium tracking-wider">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGithubLogin}
            disabled={githubLoading}
            className="w-full py-2.5 sm:py-3 rounded-xl border border-gray-700 hover:border-[#7c3aed] bg-[#1a1a2e] hover:bg-[#2d2d5e] transition-all duration-300 flex items-center justify-center gap-3 text-gray-300 font-medium text-sm sm:text-base"
          >
            {githubLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#a78bfa]" />
            ) : (
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            {githubLoading ? "Connecting..." : "Continue with GitHub"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-2.5 sm:py-3 rounded-xl border border-gray-700 hover:border-[#7c3aed] bg-[#1a1a2e] hover:bg-[#2d2d5e] transition-all duration-300 flex items-center justify-center gap-3 text-gray-300 font-medium text-sm sm:text-base"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#a78bfa]" />
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
              setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
            }}
            className="text-xs sm:text-sm text-gray-400 hover:text-[#a78bfa] transition-colors"
          >
            {isLogin ? (
              <span>
                Don't have an account?{" "}
                <span className="text-[#a78bfa] font-medium">Sign Up</span>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <span className="text-[#a78bfa] font-medium">Sign In</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Auth;
