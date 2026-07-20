import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MessageCircle, Send, Loader2, User } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { toast } from 'react-toastify';

const TestimonialPopup = ({ userId, userName, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.warning('Please select a rating');
      return;
    }
    if (!message.trim()) {
      toast.warning('Please write your testimonial');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          user_id: userId,
          name: userName || 'Anonymous',
          rating: rating,
          content: message.trim(),
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('🎉 Thank you for your testimonial!');
      setIsVisible(false);
      onClose?.();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const current = hoverRating || rating;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(i)}
          className="text-2xl sm:text-3xl transition-colors"
        >
          <Star
            className={`w-6 h-6 sm:w-8 h-8 ${
              i <= current
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-500'
            } hover:scale-110 transition-transform`}
          />
        </button>
      );
    }
    return stars;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsVisible(false);
          onClose?.();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#2A1535]" />
            <h3 className="text-white font-bold text-lg">Share Your Experience</h3>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          How has your experience been with Cerebrum? Your feedback helps others learn!
        </p>

        <div className="mb-4">
          <label className="text-sm text-gray-400 block mb-2">Rating</label>
          <div className="flex gap-1">{renderStars()}</div>
          {rating > 0 && (
            <span className="text-xs text-gray-500 mt-1 block">
              {rating === 5 ? '🌟 Excellent!' :
               rating === 4 ? '😊 Great!' :
               rating === 3 ? '👍 Good' :
               rating === 2 ? '😐 Okay' :
               '😕 Needs improvement'}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-400 block mb-2">Your Story</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do you like about Cerebrum? How has it helped you?"
            className="w-full px-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            rows={4}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="flex-1 py-2.5 px-4 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 btn-primary py-2.5 px-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Feedback
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestimonialPopup;
