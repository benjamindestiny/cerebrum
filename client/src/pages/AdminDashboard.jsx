// pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Mail,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  FileText,
  Send,
  Award,
  BookOpen,
  MessageSquare,
  UserPlus,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../services/supabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, adminData, user } = useAdmin();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalQuizzes: 0,
    totalRiddles: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get total quizzes
      const { count: quizCount } = await supabase
        .from('quiz_results')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        activeUsers: 0,
        totalQuizzes: quizCount || 0,
        totalRiddles: 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // ✅ Only link to pages that exist
  const adminLinks = [
    {
      icon: MessageSquare,
      label: 'Send Message',
      description: 'Send messages to all users',
      path: '/admin/send-message',
      color: 'text-blue-400',
    },
    {
      icon: Mail,
      label: 'Email Templates',
      description: 'Manage email templates',
      path: '/admin/email-templates',
      color: 'text-[#7c3aed]',
    },
    {
      icon: Users,
      label: 'Subscribers',
      description: 'View and manage users',
      path: '/admin/subscribers',
      color: 'text-green-400',
    },
    {
      icon: TrendingUp,
      label: 'Weekly Report',
      description: 'View platform analytics',
      path: '/admin/weekly-report',
      color: 'text-yellow-400',
    },
  ];

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-gray-400 mt-2">You don't have admin privileges.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-[#7c3aed]" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back, {user?.email} ({adminData?.role || 'admin'})
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
          <div className="text-xs text-gray-400">Total Users</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.totalQuizzes}</div>
          <div className="text-xs text-gray-400">Quizzes Taken</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.totalUsers}</div>
          <div className="text-xs text-gray-400">Active Users</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-[#7c3aed]">0</div>
          <div className="text-xs text-gray-400">Riddles Solved</div>
        </div>
      </div>

      {/* Admin Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => navigate(link.path)}
            className="glass-card p-6 text-left hover:border-[#7c3aed]/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 bg-[#7c3aed]/10 rounded-lg group-hover:bg-[#7c3aed]/20 transition-colors`}>
                <link.icon className={`w-6 h-6 ${link.color || 'text-[#7c3aed]'}`} />
              </div>
              <div>
                <h3 className="text-white font-medium">{link.label}</h3>
                <p className="text-gray-400 text-sm mt-1">{link.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;