import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { supabase } from '../../services/supabase';

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
      <div 
        
        
        className="glass-card p-4 sm:p-6 border border-[#00C9A7]/20 bg-[#00C9A7]/5  text-white border-[#2A2A4A]"
      >
        <div className="flex items-start gap-3  text-white border-[#2A2A4A]">
          <CheckCircle className="w-5 h-5 text-[#00C9A7] mt-0.5 flex-shrink-0  text-white border-[#2A2A4A]" />
          <div className="flex-1  text-white border-[#2A2A4A]">
            <h4 className="text-white font-semibold text-sm  text-white border-[#2A2A4A]">You're subscribed! 🎉</h4>
            <p className="text-gray-400 text-xs mt-1  text-white border-[#2A2A4A]">
              You'll receive weekly quiz challenges and updates.
            </p>
            <button
              onClick={handleUnsubscribe}
              className="text-xs text-gray-500  transition-colors mt-2  text-white border-[#2A2A4A]"
            >
              Unsubscribe
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show success after subscription
  if (showSuccess) {
    return (
      <div 
        
        
        className="glass-card p-4 sm:p-6 border border-[#00C9A7]/20 bg-[#00C9A7]/5  text-white border-[#2A2A4A]"
      >
        <div className="text-center  text-white border-[#2A2A4A]">
          <div className="w-12 h-12 rounded-full bg-[#00C9A7]/20 flex items-center justify-center mx-auto mb-3  text-white border-[#2A2A4A]">
            <CheckCircle className="w-6 h-6 text-[#00C9A7]  text-white border-[#2A2A4A]" />
          </div>
          <h4 className="text-white font-semibold text-sm  text-white border-[#2A2A4A]">Subscription Confirmed! 🎉</h4>
          <p className="text-gray-400 text-xs mt-1  text-white border-[#2A2A4A]">
            You've been added to our newsletter. Check your inbox!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 sm:p-6 border border-white/5  text-white border-[#2A2A4A]">
      <div className="flex items-center gap-3 mb-3  text-white border-[#2A2A4A]">
        <Mail className="w-5 h-5 text-[#3B82F6CC]  text-white border-[#2A2A4A]" />
        <h3 className="text-white font-semibold text-sm sm:text-base  text-white border-[#2A2A4A]">
          📧 Weekly Updates
        </h3>
      </div>
      <p className="text-gray-400 text-xs sm:text-sm mb-4  text-white border-[#2A2A4A]">
        Get weekly quiz challenges, new categories, and learning tips!
      </p>

      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2  text-white border-[#2A2A4A]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-sm  text-white border-[#2A2A4A]"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg  transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap  text-white border-[#2A2A4A]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin  text-white border-[#2A2A4A]" />
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      {error && (
        <p 
          
          
          className="text-red-400 text-xs mt-2 flex items-center gap-1  text-white border-[#2A2A4A]"
        >
          <XCircle className="w-3 h-3  text-white border-[#2A2A4A]" />
          {error}
        </p>
      )}

      <p className="text-gray-500 text-[10px] mt-2  text-white border-[#2A2A4A]">
        No spam, unsubscribe anytime.
      </p>
    </div>
  );
};

export default EmailSubscribe;