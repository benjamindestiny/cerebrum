import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const EmailSubscribe = ({ userEmail }) => {
  const [email, setEmail] = useState(userEmail || '');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if email already subscribed
  useEffect(() => {
    if (userEmail) {
      checkSubscription(userEmail);
    }
  }, [userEmail]);

  const checkSubscription = async (emailToCheck) => {
    try {
      const { data, error } = await supabase
        .from('newsletter')
        .select('email')
        .eq('email', emailToCheck)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && data) {
        setIsSubscribed(true);
        setSubscribed(true);
      }
    } catch (error) {
      console.error('Check subscription error:', error);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if already subscribed
      const { data: existing, error: checkError } = await supabase
        .from('newsletter')
        .select('email')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();

      if (!checkError && existing) {
        setIsSubscribed(true);
        setSubscribed(true);
        setShowSuccess(true);
        setLoading(false);
        return;
      }

      // Insert new subscription
      const { error: insertError } = await supabase
        .from('newsletter')
        .insert({
          email: email,
          user_id: userEmail ? (await supabase.auth.getUser()).data.user?.id : null,
          subscribed_at: new Date().toISOString(),
          is_active: true,
        });

      if (insertError) {
        // Check if it's a duplicate error
        if (insertError.code === '23505') {
          // Duplicate email, reactivate
          const { error: updateError } = await supabase
            .from('newsletter')
            .update({ is_active: true, subscribed_at: new Date().toISOString() })
            .eq('email', email);
          
          if (updateError) throw updateError;
        } else {
          throw insertError;
        }
      }

      setSubscribed(true);
      setShowSuccess(true);
      setIsSubscribed(true);
      setEmail('');

    } catch (error) {
      console.error('Subscription error:', error);
      setError(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!email && !userEmail) return;

    const emailToUnsubscribe = email || userEmail;

    try {
      const { error } = await supabase
        .from('newsletter')
        .update({ is_active: false })
        .eq('email', emailToUnsubscribe);

      if (error) throw error;

      setIsSubscribed(false);
      setSubscribed(false);
      setShowSuccess(false);
      setError(null);
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setError('Failed to unsubscribe. Please try again.');
    }
  };

  // If already subscribed, show success message
  if (isSubscribed || subscribed) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 sm:p-6 border border-[#00C9A7]/20 bg-[#00C9A7]/5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#00C9A7] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-white font-semibold text-sm">You're subscribed! 🎉</h4>
            <p className="text-gray-400 text-xs mt-1">
              You'll receive weekly quiz challenges and updates.
            </p>
            <button
              onClick={handleUnsubscribe}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors mt-2"
            >
              Unsubscribe
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show success after subscription
  if (showSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-4 sm:p-6 border border-[#00C9A7]/20 bg-[#00C9A7]/5"
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#00C9A7]/20 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-[#00C9A7]" />
          </div>
          <h4 className="text-white font-semibold text-sm">Subscription Confirmed! 🎉</h4>
          <p className="text-gray-400 text-xs mt-1">
            You've been added to our newsletter. Check your inbox!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="glass-card p-4 sm:p-6 border border-white/5">
      <div className="flex items-center gap-3 mb-3">
        <Mail className="w-5 h-5 text-[#a78bfa]" />
        <h3 className="text-white font-semibold text-sm sm:text-base">
          📧 Weekly Updates
        </h3>
      </div>
      <p className="text-gray-400 text-xs sm:text-sm mb-4">
        Get weekly quiz challenges, new categories, and learning tips!
      </p>

      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all text-sm"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-xs mt-2 flex items-center gap-1"
        >
          <XCircle className="w-3 h-3" />
          {error}
        </motion.p>
      )}

      <p className="text-gray-500 text-[10px] mt-2">
        No spam, unsubscribe anytime.
      </p>
    </div>
  );
};

export default EmailSubscribe;