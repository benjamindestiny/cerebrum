// pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { useAdmin } from '../context/AdminContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshAdminStatus } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // ✅ Check if user is already logged in and is admin
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const isAdmin = await checkAdminStatus(user);
        if (isAdmin) {
          navigate('/admin/dashboard');
        }
      }
    };
    checkExistingSession();
  }, []);

  // ✅ Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const errorParam = params.get('error');

      if (errorParam) {
        setError('Authentication failed. Please try again.');
        // Clean URL
        window.history.replaceState({}, document.title, '/admin/login');
        return;
      }

      if (code) {
        setLoading(true);
        try {
          // Exchange code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Callback error:', error);
            setError('Authentication failed. Please try again.');
            setLoading(false);
            // Clean URL
            window.history.replaceState({}, document.title, '/admin/login');
            return;
          }

          if (data?.user) {
            const isAdmin = await checkAdminStatus(data.user);
            if (isAdmin) {
              setSuccess('Admin access granted! Redirecting...');
              await refreshAdminStatus();
              setTimeout(() => {
                navigate('/admin/dashboard');
              }, 1000);
            } else {
              // Not admin, sign out
              await supabase.auth.signOut();
              setError('You do not have admin access. Please contact the administrator.');
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
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // ✅ Check if user is admin
  const checkAdminStatus = async (user) => {
    try {
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (adminError) {
        console.error('Error checking admin status:', adminError);
        return false;
      }

      return !!adminData;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // ✅ Handle Google Sign In
  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/admin/login`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google login error:', error);
        setError('Failed to sign in with Google. Please try again.');
        setGoogleLoading(false);
        return;
      }

      if (data?.url) {
        // Redirect to Google
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to sign in with Google. Please try again.');
      setGoogleLoading(false);
    }
  };

  // ✅ Handle Email/Password Login
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
          await refreshAdminStatus();
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1000);
        } else {
          await supabase.auth.signOut();
          setError('You do not have admin access. Please contact the administrator.');
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

  // ✅ Check if user already has a session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const isAdmin = await checkAdminStatus(session.user);
        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          await supabase.auth.signOut();
        }
      }
    };
    checkSession();
  }, []);

  return (
    <div
      
      
      
      className="min-h-screen flex items-center justify-center p-4  text-white border-[#2A2A4A]"
      style={{ backgroundColor: 'var(--app-bg)' }}
    >
      <div className="glass-card p-6 md:p-8 max-w-md w-full  text-white border-[#2A2A4A]">
        <div className="text-center mb-6  text-white border-[#2A2A4A]">
          <div className="inline-block p-3  rounded-full mb-3  text-white border-[#2A2A4A]">
            <Shield className="w-10 h-10 text-[#3B82F6]  text-white border-[#2A2A4A]" />
          </div>
          <h1 className="text-2xl font-bold text-white  text-white border-[#2A2A4A]">Admin Access</h1>
          <p className="text-gray-400 text-sm mt-1  text-white border-[#2A2A4A]">
            Sign in with your admin account
          </p>
          {loading && (
            <div className="mt-2 flex items-center justify-center gap-2 text-[#3B82F6CC] text-xs  text-white border-[#2A2A4A]">
              <Loader2 className="w-3 h-3 animate-spin  text-white border-[#2A2A4A]" />
              Processing...
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2  text-white border-[#2A2A4A]">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5  text-white border-[#2A2A4A]" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center gap-2  text-white border-[#2A2A4A]">
            <CheckCircle className="w-4 h-4 flex-shrink-0  text-white border-[#2A2A4A]" />
            <span>{success}</span>
          </div>
        )}

        {/* ✅ Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full mb-4 py-3 rounded-xl border border-gray-700 hover:border-blue-500 bg-[#1A1A1A] [#2d2d5e] transition-all  flex items-center justify-center gap-3 text-gray-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed  text-white border-[#2A2A4A]"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#3B82F6CC]  text-white border-[#2A2A4A]" />
          ) : (
            <Chrome className="w-5 h-5  text-white border-[#2A2A4A]" />
          )}
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <div className="relative my-4  text-white border-[#2A2A4A]">
          <div className="absolute inset-0 flex items-center  text-white border-[#2A2A4A]">
            <div className="w-full border-t border-gray-700  text-white border-[#2A2A4A]"></div>
          </div>
          <div className="relative flex justify-center  text-white border-[#2A2A4A]">
            <span className="px-3 bg-[#1A1A1A] text-gray-500 text-xs font-medium tracking-wider  text-white border-[#2A2A4A]">
              OR
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4  text-white border-[#2A2A4A]">
          <div className="relative  text-white border-[#2A2A4A]">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Admin Email"
              className="w-full bg-[#262626] text-white px-4 py-2.5 pl-10 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all  text-white border-[#2A2A4A]"
              required
            />
          </div>

          <div className="relative  text-white border-[#2A2A4A]">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-[#262626] text-white px-4 py-2.5 pl-10 pr-10 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all  text-white border-[#2A2A4A]"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400  transition-colors  text-white border-[#2A2A4A]"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5  text-white border-[#2A2A4A]" />
              ) : (
                <Eye className="w-5 h-5  text-white border-[#2A2A4A]" />
              )}
            </button>
          </div>

          <button
            
            
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-blue-500 text-white rounded-lg  transition-colors flex items-center justify-center gap-2 py-3 text-sm font-medium disabled:opacity-50  text-white border-[#2A2A4A]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin  text-white border-[#2A2A4A]" />
            ) : (
              <>
                <Shield className="w-4 h-4  text-white border-[#2A2A4A]" />
                Sign in with Email
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center  text-white border-[#2A2A4A]">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-gray-400  transition-colors flex items-center gap-1 justify-center  text-white border-[#2A2A4A]"
          >
            <ArrowLeft className="w-3 h-3  text-white border-[#2A2A4A]" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;