import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Quote,
  Users,
  MessageCircle,
  ThumbsUp,
  Brain,
  Trophy,
  Sparkles,
  UserCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { supabase } from '../services/supabase';

const Testimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
    loadTestimonials();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  const getAvatarEmoji = (index) => {
    const avatars = ['🧠', '🚀', '🌟', '🎯', '💪', '🧙', '🦊', '🐉', '🦅', '🐺', '🦄', '🐼', '🦁', '🐧', '🐱', '🐶'];
    return avatars[index % avatars.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 pb-12"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(user ? '/dashboard' : '/')}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-[#3B82F6]" />
            Testimonials
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            What our community is saying about Cerebrum
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{testimonials.length}</div>
          <div className="text-xs text-gray-400">Testimonials</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {testimonials.length > 0 
              ? Math.round(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length)
              : 0}
          </div>
          <div className="text-xs text-gray-400">Average Rating</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-[#3B82F6]">40+</div>
          <div className="text-xs text-gray-400">Active Learners</div>
        </div>
        {/* <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">50+</div>
          <div className="text-xs text-gray-400">Countries</div>
        </div> */}
      </div>

      {/* Testimonials Grid */}
      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="glass-card p-6 hover:border-blue-500/30 transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{getAvatarEmoji(index)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{testimonial.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <div className="relative">
                <Quote className="w-4 h-4 text-[#3B82F6] absolute -top-1 -left-1 opacity-50" />
                <p className="text-gray-300 text-sm leading-relaxed pl-5">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                {new Date(testimonial.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">💬</div>
            <h3 className="text-xl font-bold text-white">No Testimonials Yet</h3>
            <p className="text-gray-400 max-w-md">
              Be the first to share your experience with Cerebrum!
            </p>
            {user && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Share Your Story
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Testimonials;
