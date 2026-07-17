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
} from 'lucide-react';
import { supabase } from '../services/supabase';

const Testimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Hardcoded testimonials for now
  const defaultTestimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Student',
      avatar: '🧠',
      content: 'Cerebrum has completely changed how I study! The quizzes are engaging and the riddles keep my brain sharp. I\'ve improved my grades significantly.',
      rating: 5,
      date: '2024-07-15',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Teacher',
      avatar: '📚',
      content: 'I use Cerebrum with my students and they love it! The Read & Test feature is perfect for comprehension checks. Highly recommend for educators.',
      rating: 5,
      date: '2024-07-12',
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Software Developer',
      avatar: '💻',
      content: 'Learning new technologies has never been this fun. The categories are well-organized and the difficulty progression is spot on. Great platform!',
      rating: 4,
      date: '2024-07-10',
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      role: 'Lifelong Learner',
      avatar: '🌟',
      content: 'I love the daily challenges! It keeps me coming back every day. My streak is currently 45 days and I\'m not planning to stop anytime soon.',
      rating: 5,
      date: '2024-07-08',
    },
    {
      id: 5,
      name: 'David Kim',
      role: 'University Student',
      avatar: '🎯',
      content: 'The leaderboard adds a competitive edge that motivates me to study harder. I\'ve gone from average to top 10% in my class!',
      rating: 5,
      date: '2024-07-05',
    },
    {
      id: 6,
      name: 'Lisa Thompson',
      role: 'Project Manager',
      avatar: '🚀',
      content: 'Perfect for quick learning sessions during breaks. The Read & Test articles are informative and the quizzes are challenging but fair.',
      rating: 4,
      date: '2024-07-01',
    },
  ];

  useEffect(() => {
    getCurrentUser();
    // Load testimonials from database or use defaults
    setTestimonials(defaultTestimonials);
    setLoading(false);
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
            <MessageCircle className="w-8 h-8 text-blue-400" />
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
            {Math.round(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length)}
          </div>
          <div className="text-xs text-gray-400">Average Rating</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">1000+</div>
          <div className="text-xs text-gray-400">Active Learners</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">50+</div>
          <div className="text-xs text-gray-400">Countries</div>
        </div>
      </div>

      {/* Testimonials Grid */}
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
              <div className="text-3xl">{testimonial.avatar || '🧠'}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{testimonial.name}</span>
                  {testimonial.role && (
                    <span className="text-xs text-gray-500">{testimonial.role}</span>
                  )}
                </div>
                <div className="flex gap-0.5 mt-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            </div>
            <div className="relative">
              <Quote className="w-4 h-4 text-blue-400 absolute -top-1 -left-1 opacity-50" />
              <p className="text-gray-300 text-sm leading-relaxed pl-5">
                "{testimonial.content}"
              </p>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              {new Date(testimonial.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Testimonial CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 mt-8 border border-blue-500/20 bg-blue-500/5 text-center"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Love Cerebrum?
            </h3>
            <p className="text-gray-400 text-sm">
              Share your experience and help others discover the joy of learning!
            </p>
          </div>
          <button
            onClick={() => {
              if (user) {
                // Open a testimonial form modal or redirect
                navigate('/profile');
              } else {
                navigate('/auth');
              }
            }}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Share Your Story
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Testimonials;
