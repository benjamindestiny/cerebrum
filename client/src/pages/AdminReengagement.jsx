import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Users,
  UserCheck,
  UserX,
  Send,
  Loader2,
  ArrowLeft,
  Clock,
  Calendar,
  TrendingUp,
  RefreshCw,
  MessageCircle,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { sendBulkEmail } from '../services/emailService';
import { toast } from 'react-toastify';

const AdminReengagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive7: 0,
    inactive30: 0,
    noActivity: 0,
  });
  const [results, setResults] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data: allUsers } = await supabase
        .from('users')
        .select('id, name, email, stats');

      const userData = allUsers || [];
      
      const total = userData.length;
      const active = userData.filter(u => (u.stats?.total_quizzes || 0) > 0).length;
      const noActivity = userData.filter(u => (u.stats?.total_quizzes || 0) === 0).length;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const inactive7 = userData.filter(u => {
        const lastDate = u.stats?.last_quiz_date;
        if (!lastDate) return true;
        return new Date(lastDate) < sevenDaysAgo;
      }).length;

      const inactive30 = userData.filter(u => {
        const lastDate = u.stats?.last_quiz_date;
        if (!lastDate) return true;
        return new Date(lastDate) < thirtyDaysAgo;
      }).length;

      setStats({
        total,
        active,
        inactive7,
        inactive30,
        noActivity,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load user stats');
    } finally {
      setLoading(false);
    }
  };

  const sendEmails = async (type) => {
    if (!window.confirm(`Send "${type}" emails to ${stats.inactive7} users?`)) {
      return;
    }

    setSending(true);
    setResults(null);

    try {
      const { data: allUsers } = await supabase
        .from('users')
        .select('id, name, email, stats');

      let recipients = [];
      if (type === 'all') {
        recipients = allUsers || [];
      } else {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        recipients = (allUsers || []).filter(u => {
          const lastDate = u.stats?.last_quiz_date;
          if (!lastDate) return true;
          return new Date(lastDate) < sevenDaysAgo;
        });
      }

      if (recipients.length === 0) {
        toast.warning('No users to send to');
        setSending(false);
        return;
      }

      // Build email content
      const formattedRecipients = recipients.map(user => ({
        email: user.email,
        name: user.name || user.email?.split('@')[0] || 'Learner',
        data: {
          streak: user.stats?.streak || 0,
          points: user.stats?.total_points || 0,
        }
      }));

      let subject, body;
      if (type === 'missYou') {
        subject = `👋 We Miss You! Your Brain is Waiting!`;
        body = `
          <h1>We Miss You! 👋</h1>
          <p>Your brain is waiting for a workout!</p>
          <p>Come back and continue your learning journey.</p>
          <a href="https://cerebrum-three.vercel.app/dashboard" style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            🚀 Continue Learning
          </a>
        `;
      } else if (type === 'comeback') {
        subject = `🏆 Come Back Challenge: Win 100 Bonus Points!`;
        body = `
          <h1>🏆 Come Back Challenge!</h1>
          <p>Complete 3 quizzes today and earn <strong style="color: #F59E0B;">100 bonus points</strong>!</p>
          <a href="https://cerebrum-three.vercel.app/categories" style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            🎯 Accept Challenge
          </a>
        `;
      } else {
        subject = `🚀 New Features on Cerebrum!`;
        body = `
          <h1>🚀 New Features on Cerebrum!</h1>
          <p>Check out what's new:</p>
          <ul>
            <li>⚡ Quick Fire Mode - 15-second questions</li>
            <li>🧠 Brain Break Games - Speed Math, Memory Match</li>
            <li>🔥 Streak Freeze - Never lose your streak</li>
          </ul>
          <a href="https://cerebrum-three.vercel.app/dashboard" style="background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            🎮 Try Now
          </a>
        `;
      }

      const result = await sendBulkEmail({
        recipients: formattedRecipients,
        subject: subject,
        body: body,
        variables: ['name', 'streak', 'points'],
      });

      setResults({
        logged: result.logged || 0,
        total: result.total || recipients.length,
        message: result.message || `✅ ${result.logged || 0} emails logged`,
      });

      toast.success(`✅ ${result.logged || 0} emails logged!`);

    } catch (error) {
      console.error('Error sending emails:', error);
      toast.error('Failed to send emails');
    } finally {
      setSending(false);
    }
  };

  const emailTypes = [
    {
      id: 'missYou',
      label: '👋 We Miss You',
      desc: 'Warm re-engagement with stats',
      icon: MessageCircle,
      color: 'text-[#2A1535]',
      bg: 'bg-blue-500/10',
    },
    {
      id: 'comeback',
      label: '🏆 Comeback Challenge',
      desc: '100 bonus points challenge',
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      id: 'newFeatures',
      label: '🚀 New Features',
      desc: 'Announce new features',
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      id: 'all',
      label: '📨 All Users',
      desc: 'Send to all registered users',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#2A1535] animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 pb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Mail className="w-8 h-8 text-[#2A1535]" />
            Re-engagement Emails
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Send emails to bring users back to Cerebrum
          </p>
        </div>
      </div>

      {/* Status Banner */}
      <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>📧 Emails are in <strong>LOGGING MODE</strong>. No actual emails are sent. Check your Brevo API key to enable real email sending.</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Users', value: stats.total, icon: Users, color: 'text-[#2A1535]' },
          { label: 'Active', value: stats.active, icon: UserCheck, color: 'text-green-400' },
          { label: 'Inactive (7d)', value: stats.inactive7, icon: UserX, color: 'text-yellow-400' },
          { label: 'Inactive (30d)', value: stats.inactive30, icon: Clock, color: 'text-orange-400' },
          { label: 'No Activity', value: stats.noActivity, icon: Calendar, color: 'text-red-400' },
        ].map((stat, index) => (
          <div key={index} className="glass-card p-3 text-center">
            <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Email Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {emailTypes.map((type) => (
          <div
            key={type.id}
            className={`glass-card p-5 border transition-all ${
              type.id === 'missYou'
                ? 'border-blue-500/30 bg-blue-500/5'
                : 'border-white/10 hover:border-blue-500/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${type.bg}`}>
                <type.icon className={`w-5 h-5 ${type.color}`} />
              </div>
              <div>
                <h3 className="text-white font-medium">{type.label}</h3>
                <p className="text-xs text-gray-400 mt-1">{type.desc}</p>
                <button
                  onClick={() => sendEmails(type.id)}
                  disabled={sending}
                  className="mt-3 px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  Send (Log)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 border border-green-500/20 bg-green-500/5"
        >
          <h3 className="text-white font-medium mb-3">📊 Results</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{results.total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{results.logged}</div>
              <div className="text-xs text-gray-400">Logged</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 break-words">{results.message}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Refresh Button */}
      <button
        onClick={loadStats}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh Stats
      </button>
    </motion.div>
  );
};

export default AdminReengagement;
