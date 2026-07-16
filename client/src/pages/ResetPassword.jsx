import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      // toast.'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      // toast.'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      // toast.'Password updated successfully! 🎉');
      setTimeout(() => navigate('/auth'), 2000);
    } catch (error) {
      console.error('Reset error:', error);
      // toast.error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] p-4  text-white border-[#2A2A4A]">
        <div className="glass-card p-8 max-w-md w-full text-center  text-white border-[#2A2A4A]">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4  text-white border-[#2A2A4A]" />
          <h2 className="text-2xl font-bold text-white mb-2  text-white border-[#2A2A4A]">Password Updated!</h2>
          <p className="text-gray-400  text-white border-[#2A2A4A]">Your password has been successfully reset.</p>
          <p className="text-gray-400 text-sm mt-2  text-white border-[#2A2A4A]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] p-4  text-white border-[#2A2A4A]">
      <div className="glass-card p-8 max-w-md w-full  text-white border-[#2A2A4A]">
        <div className="text-center mb-8  text-white border-[#2A2A4A]">
          <div className="inline-block p-3  rounded-full mb-4  text-white border-[#2A2A4A]">
            <Lock className="w-12 h-12 text-[#3B82F6CC]  text-white border-[#2A2A4A]" />
          </div>
          <h2 className="text-2xl font-bold text-white  text-white border-[#2A2A4A]">Set New Password</h2>
          <p className="text-gray-400 text-sm mt-2  text-white border-[#2A2A4A]">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4  text-white border-[#2A2A4A]">
          <div className="relative  text-white border-[#2A2A4A]">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="input-theme pl-10 w-full  text-white border-[#2A2A4A]"
              required
            />
          </div>
          <div className="relative  text-white border-[#2A2A4A]">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="input-theme pl-10 w-full  text-white border-[#2A2A4A]"
              required
            />
          </div>
          <button
            
            
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3  text-white border-[#2A2A4A]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin  text-white border-[#2A2A4A]" /> : 'Update Password'}
          </button>
        </form>

        <div className="mt-4 text-center  text-white border-[#2A2A4A]">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm text-gray-400 hover:text-[#3B82F6CC] transition-colors  text-white border-[#2A2A4A]"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
