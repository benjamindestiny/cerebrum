// pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Chrome,
} from 'lucide-react';
import { supabase } from '../services/supabase';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // ✅ NEW: Check if user is admin after authentication
  const checkAdminStatus = async (user) => {
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (adminError) {
      setError('Error checking admin status. Please try again.');
      return false;
    }

    if (!adminData) {
      setError('You do not have admin access. Please contact the administrator.');
      await supabase.auth.signOut();
      return false;
    }

    return true;
  };

  // ✅ NEW: Handle Google Sign In
  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/callback`,
        },
      });

      if (error) {
        console.error('Google login error:', error);
        setError('Failed to sign in with Google. Please try again.');
        setGoogleLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to sign in with Google. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        const isAdmin = await checkAdminStatus(data.user);
        if (isAdmin) {
          setSuccess('Admin access granted! Redirecting...');
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1000);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Handle OAuth callback
  React.useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        setLoading(true);
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Callback error:', error);
            setError('Authentication failed. Please try again.');
            setLoading(false);
            return;
          }

          if (data?.user) {
            const isAdmin = await checkAdminStatus(data.user);
            if (isAdmin) {
              setSuccess('Admin access granted! Redirecting...');
              setTimeout(() => {
                navigate('/admin/dashboard');
              }, 1000);
            }
          }
        } catch (error) {
          console.error('Callback error:', error);
          setError('Authentication failed. Please try again.');
        } finally {
          setLoading(false);
          // Clean URL
          window.history.replaceState({}, document.title, '/admin/login');
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--app-bg)' }}
    >
      <div className="glass-card p-6 md:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-[#7c3aed]/20 rounded-full mb-3">
            <Shield className="w-10 h-10 text-[#7c3aed]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in with your admin account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* ✅ Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full mb-4 py-3 rounded-xl border border-gray-700 hover:border-[#7c3aed] bg-[#1a1a2e] hover:bg-[#2d2d5e] transition-all duration-300 flex items-center justify-center gap-3 text-gray-300 font-medium text-sm disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#a78bfa]" />
          ) : (
            <Chrome className="w-5 h-5" />
          )}
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-[#1a1a2e] text-gray-500 text-xs font-medium tracking-wider">
              OR
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Admin Email"
              className="w-full bg-[#2D2D5E] text-white px-4 py-2.5 pl-10 rounded-lg border border-white/10 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-[#2D2D5E] text-white px-4 py-2.5 pl-10 pr-10 rounded-lg border border-white/10 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2 py-3 text-sm font-medium disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Sign in with Email
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 justify-center"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;