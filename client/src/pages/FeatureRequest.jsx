import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Send,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';

const FeatureRequest = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'quiz', label: '📝 Quiz Features' },
    { id: 'riddle', label: '🧩 Riddle Features' },
    { id: 'social', label: '👥 Social Features' },
    { id: 'ui', label: '🎨 UI/UX Improvements' },
    { id: 'general', label: '💡 General Ideas' },
    { id: 'other', label: '🚀 Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.warning('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('feature_requests')
        .insert({
          user_id: user?.id || null,
          user_email: user?.email || null,
          title: title.trim(),
          description: description.trim(),
          category: category,
          status: 'pending',
          votes: 0,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success('🎉 Feature request submitted!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feature request:', error);
      toast.error('Failed to submit feature request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto glass-card p-8 text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white">Feature Request Submitted!</h2>
        <p className="text-gray-400 mt-2">
          Thank you for your suggestion! We review all feature requests and will keep you updated.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span>We'll notify you when we review it</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary mt-6"
        >
          Go to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 pb-12"
    >
      <button
        onClick={() => navigate('/dashboard')}
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Lightbulb className="w-7 h-7 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Feature Request</h1>
            <p className="text-gray-400 text-sm">
              Have an idea? We'd love to hear it! 🚀
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">
              Feature Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dark Mode, Multiplayer Battles..."
              className="w-full px-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    category === cat.id
                      ? 'bg-blue-500/20 text-[#2A1535] border border-blue-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your feature idea in detail..."
              className="w-full px-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              rows={6}
              required
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {description.length}/500
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Tips for a great feature request:
            </h4>
            <ul className="text-xs text-gray-400 mt-2 space-y-1">
              <li>• Be specific about what you want</li>
              <li>• Explain why it would be useful</li>
              <li>• Provide examples if possible</li>
            </ul>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Feature Request
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default FeatureRequest;
