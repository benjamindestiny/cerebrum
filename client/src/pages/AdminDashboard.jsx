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
      color: 'text-[#3B82F6CC]',
    },
    {
      icon: Mail,
      label: 'Email Templates',
      description: 'Manage email templates',
      path: '/admin/email-templates',
      color: 'text-blue-400',
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
      color: 'text-teal-400',
    },
  ];

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]  text-white border-[#2A2A4A]">
        <div className="text-center  text-white border-[#2A2A4A]">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4  text-white border-[#2A2A4A]" />
          <h2 className="text-2xl font-bold text-white  text-white border-[#2A2A4A]">Access Denied</h2>
          <p className="text-gray-400 mt-2  text-white border-[#2A2A4A]">You don't have admin privileges.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg  transition-colors  text-white border-[#2A2A4A]"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6  text-white border-[#2A2A4A]">
      <div className="flex items-center justify-between mb-6  text-white border-[#2A2A4A]">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2  text-white border-[#2A2A4A]">
            <Shield className="w-7 h-7 text-blue-400  text-white border-[#2A2A4A]" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1  text-white border-[#2A2A4A]">
            Welcome back, {user?.email} ({adminData?.role || 'admin'})
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg /20 transition-colors flex items-center gap-2 text-sm  text-white border-[#2A2A4A]"
        >
          <LogOut className="w-4 h-4  text-white border-[#2A2A4A]" />
          Sign Out
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6  text-white border-[#2A2A4A]">
        <div className="glass-card p-4 text-center  text-white border-[#2A2A4A]">
          <div className="text-2xl font-bold text-white  text-white border-[#2A2A4A]">{stats.totalUsers}</div>
          <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Total Users</div>
        </div>
        <div className="glass-card p-4 text-center  text-white border-[#2A2A4A]">
          <div className="text-2xl font-bold text-green-400  text-white border-[#2A2A4A]">{stats.totalQuizzes}</div>
          <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Quizzes Taken</div>
        </div>
        <div className="glass-card p-4 text-center  text-white border-[#2A2A4A]">
          <div className="text-2xl font-bold text-teal-400  text-white border-[#2A2A4A]">{stats.totalUsers}</div>
          <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Active Users</div>
        </div>
        <div className="glass-card p-4 text-center  text-white border-[#2A2A4A]">
          <div className="text-2xl font-bold text-blue-400  text-white border-[#2A2A4A]">0</div>
          <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Riddles Solved</div>
        </div>
      </div>

      {/* Admin Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  text-white border-[#2A2A4A]">
        {adminLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => navigate(link.path)}
            className="glass-card p-6 text-left hover:border-blue-500/30 transition-all group  text-white border-[#2A2A4A]"
          >
            <div className="flex items-start gap-4  text-white border-[#2A2A4A]">
              <div className={`p-3  rounded-lg group-/20 transition-colors`}>
                <link.icon className={`w-6 h-6 ${link.color || 'text-blue-400'}`} />
              </div>
              <div>
                <h3 className="text-white font-medium  text-white border-[#2A2A4A]">{link.label}</h3>
                <p className="text-gray-400 text-sm mt-1  text-white border-[#2A2A4A]">{link.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;