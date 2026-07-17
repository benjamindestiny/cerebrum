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
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageCircle,
  Zap,
} from 'lucide-react';
import { supabase } from '../services/supabase';
import {
  getAllUsers,
  getInactiveUsers,
  getNewUsersNoActivity,
  sendBulkReengagement,
  sendMissYouToAll,
  sendMissYouToInactive,
  sendComebackChallenge,
  sendNewFeaturesAnnouncement,
} from '../services/reengagementService';
import { toast } from 'react-toastify';

const AdminReengagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedType, setSelectedType] = useState('missYou');
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
      const allUsers = await getAllUsers();
      setUsers(allUsers);

      const inactive7 = await getInactiveUsers(7);
      const inactive30 = await getInactiveUsers(30);
      const noActivity = await getNewUsersNoActivity();

      setStats({
        total: allUsers.length,
        active: allUsers.filter(u => (u.stats?.total_quizzes || 0) > 0).length,
        inactive7: inactive7.length,
        inactive30: inactive30.length,
        noActivity: noActivity.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load user stats');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (type) => {
    if (!window.confirm(`Send "${type}" emails to ${stats.inactive7} inactive users?`)) {
      return;
    }

    setSending(true);
    setResults(null);

    try {
      let result;
      switch (type) {
        case 'missYou':
          result = await sendMissYouToInactive(7);
          break;
        case 'comeback':
          result = await sendComebackChallenge();
          break;
        case 'newFeatures':
          result = await sendNewFeaturesAnnouncement();
          break;
        case 'all':
          result = await sendMissYouToAll();
          break;
        default:
          result = await sendMissYouToInactive(7);
      }

      setResults(result);
      toast.success(`✅ Sent ${result.sent} emails!`);
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
      desc: 'Warm re-engagement email with user stats',
      icon: MessageCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      id: 'comeback',
      label: '🏆 Comeback Challenge',
      desc: 'Challenge users with 100 bonus points',
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      id: 'newFeatures',
      label: '🚀 New Features',
      desc: 'Announce new features and updates',
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
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
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
            <Mail className="w-8 h-8 text-blue-400" />
            Re-engagement Emails
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Send emails to bring users back to Cerebrum
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Users', value: stats.total, icon: Users, color: 'text-blue-400' },
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
              selectedType === type.id
                ? 'border-blue-500/50 bg-blue-500/5'
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
                  onClick={() => handleSend(type.id)}
                  disabled={sending}
                  className="mt-3 px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  Send
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
          <h3 className="text-white font-medium mb-3">📊 Email Results</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{results.total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{results.sent}</div>
              <div className="text-xs text-gray-400">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{results.failed}</div>
              <div className="text-xs text-gray-400">Failed</div>
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
