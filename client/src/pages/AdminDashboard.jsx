import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Mail,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  UserPlus,
  FileText,
  Send,
  Award,
  BookOpen,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../services/supabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, adminData, user } = useAdmin();

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const adminLinks = [
    {
      icon: Users,
      label: 'Manage Users',
      description: 'View and manage all users',
      path: '/admin/users',
    },
    {
      icon: Mail,
      label: 'Email Templates',
      description: 'Manage email templates',
      path: '/admin/email-templates',
    },
    {
      icon: Send,
      label: 'Send Email',
      description: 'Send emails to users',
      path: '/admin/send-email',
    },
    {
      icon: Award,
      label: 'Achievements',
      description: 'Manage achievements',
      path: '/admin/achievements',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      description: 'View platform analytics',
      path: '/admin/analytics',
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Admin settings',
      path: '/admin/settings',
    },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => navigate(link.path)}
            className="glass-card p-6 text-left hover:border-[#7c3aed]/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#7c3aed]/10 rounded-lg group-hover:bg-[#7c3aed]/20 transition-colors">
                <link.icon className="w-6 h-6 text-[#7c3aed]" />
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