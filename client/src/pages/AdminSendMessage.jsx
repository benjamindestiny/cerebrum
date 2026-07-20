// pages/AdminSendMessage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Users,
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  MessageSquare,
  UserCheck,
  UserX,
  Clock,
  Filter,
  Search,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { sendBulkEmail } from '../services/emailService';
import { toast } from 'react-toastify';

const AdminSendMessage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState('all');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [messageType, setMessageType] = useState('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedUsers]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, created_at, stats')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by type
    if (selectedUsers === 'active') {
      filtered = filtered.filter(u => u.stats?.total_quizzes > 0);
    } else if (selectedUsers === 'inactive') {
      filtered = filtered.filter(u => !u.stats?.total_quizzes || u.stats?.total_quizzes === 0);
    } else if (selectedUsers === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(u => new Date(u.created_at) > sevenDaysAgo);
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.email?.toLowerCase().includes(term) ||
        u.name?.toLowerCase().includes(term)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendMessage = async () => {
    if (!subject || !message) {
      toast.error('Please fill in both subject and message');
      return;
    }

    if (selectedUserIds.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    const recipients = filteredUsers
      .filter(u => selectedUserIds.includes(u.id))
      .map(u => ({
        email: u.email,
        name: u.name || u.email?.split('@')[0] || 'User',
        data: u,
      }));

    if (recipients.length === 0) {
      toast.error('No recipients selected');
      return;
    }

    const confirmMessage = `Send message to ${recipients.length} users?`;
    if (!window.confirm(confirmMessage)) return;

    setSending(true);
    setSentCount(0);
    setFailedCount(0);

    try {
      if (messageType === 'email') {
        // Send via email
        const result = await sendBulkEmail({
          recipients,
          subject,
          body: message,
          variables: ['name', 'email'],
        });

        setSentCount(result.sent || 0);
        setFailedCount(result.failed || 0);

        if (result.success) {
          toast.success(`✅ Message sent to ${result.sent} users!`);
        } else {
          toast.error(`Failed to send: ${result.error}`);
        }
      } else {
        // Send as in-app notification (you can implement this later)
        toast.info('In-app notifications coming soon!');
        setSentCount(recipients.length);
      }

      // Log the message
      await supabase.from('message_logs').insert({
        subject,
        message,
        recipients: recipients.map(r => r.email).join(', '),
        sent_count: recipients.length,
        message_type: messageType,
        sent_at: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const getSelectedCount = () => {
    return filteredUsers.filter(u => selectedUserIds.includes(u.id)).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]  text-white border-[#2A2A4A]">
        <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin  text-white border-[#2A2A4A]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6  text-white border-[#2A2A4A]">
      <div className="flex items-center gap-4 mb-6  text-white border-[#2A2A4A]">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 rounded-lg /5 transition-colors  text-white border-[#2A2A4A]"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400  text-white border-[#2A2A4A]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2  text-white border-[#2A2A4A]">
            <MessageSquare className="w-7 h-7 text-[#3B82F6]  text-white border-[#2A2A4A]" />
            Send Message
          </h1>
          <p className="text-gray-400 text-sm mt-1  text-white border-[#2A2A4A]">
            Send messages to all registered users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  text-white border-[#2A2A4A]">
        {/* Sidebar - User Selection */}
        <div className="lg:col-span-1  text-white border-[#2A2A4A]">
          <div className="glass-card p-4  text-white border-[#2A2A4A]">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2  text-white border-[#2A2A4A]">
              <Users className="w-4 h-4 text-gray-400  text-white border-[#2A2A4A]" />
              Recipients
            </h3>

            <div className="space-y-3  text-white border-[#2A2A4A]">
              <div>
                <label className="text-xs text-gray-400 block mb-1  text-white border-[#2A2A4A]">
                  User Filter
                </label>
                <select
                  value={selectedUsers}
                  onChange={(e) => setSelectedUsers(e.target.value)}
                  className="w-full px-3 py-2 bg-[#262626] rounded-lg border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none  text-white border-[#2A2A4A]"
                >
                  <option value="all">All Users ({users.length})</option>
                  <option value="active">Active Users (have taken quizzes)</option>
                  <option value="inactive">Inactive Users</option>
                  <option value="recent">Recent (last 7 days)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1  text-white border-[#2A2A4A]">
                  Search
                </label>
                <div className="relative  text-white border-[#2A2A4A]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500  text-white border-[#2A2A4A]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-9 pr-3 py-2 bg-[#262626] rounded-lg border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none  text-white border-[#2A2A4A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs  text-white border-[#2A2A4A]">
                <span className="text-gray-400  text-white border-[#2A2A4A]">
                  {getSelectedCount()} of {filteredUsers.length} selected
                </span>
                <button
                  onClick={handleSelectAll}
                  className="text-[#3B82F6] hover:text-[#3B82F6CC] transition-colors  text-white border-[#2A2A4A]"
                >
                  {selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0
                    ? 'Deselect All'
                    : 'Select All'}
                </button>
              </div>
            </div>

            <div className="mt-4 max-h-[400px] overflow-y-auto space-y-1  text-white border-[#2A2A4A]">
              {filteredUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg /5 transition-colors cursor-pointer  text-white border-[#2A2A4A]"
                >
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="w-4 h-4 rounded border-gray-600 text-[#3B82F6] focus:ring-[#3B82F6]  text-white border-[#2A2A4A]"
                  />
                  <div className="flex-1 min-w-0  text-white border-[#2A2A4A]">
                    <div className="text-sm text-white truncate  text-white border-[#2A2A4A]">
                      {user.name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 truncate  text-white border-[#2A2A4A]">
                      {user.email}
                    </div>
                  </div>
                  {user.stats?.total_quizzes > 0 && (
                    <span className="text-[10px] text-green-400 flex-shrink-0  text-white border-[#2A2A4A]">
                      ● Active
                    </span>
                  )}
                </label>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm  text-white border-[#2A2A4A]">
                No users found
              </div>
            )}
          </div>
        </div>

        {/* Main - Message Editor */}
        <div className="lg:col-span-2  text-white border-[#2A2A4A]">
          <div className="glass-card p-6  text-white border-[#2A2A4A]">
            <div className="space-y-4  text-white border-[#2A2A4A]">
              <div>
                <label className="text-sm text-gray-400 block mb-1  text-white border-[#2A2A4A]">
                  Message Type
                </label>
                <div className="flex gap-3  text-white border-[#2A2A4A]">
                  <button
                    onClick={() => setMessageType('email')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      messageType === 'email'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/5 text-gray-400 /15'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2  text-white border-[#2A2A4A]" />
                    Email
                  </button>
                  <button
                    onClick={() => setMessageType('notification')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      messageType === 'notification'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/5 text-gray-400 /15'
                    }`}
                  >
                    <Bell className="w-4 h-4 inline mr-2  text-white border-[#2A2A4A]" />
                    In-App Notification
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1  text-white border-[#2A2A4A]">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Important Update from Cerebrum"
                  className="w-full px-4 py-2 bg-[#262626] rounded-lg border border-white/10 text-white focus:border-blue-500 focus:outline-none  text-white border-[#2A2A4A]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1  text-white border-[#2A2A4A]">
                  Message
                  <span className="text-xs text-gray-500 ml-2  text-white border-[#2A2A4A]">
                    Use {'{{name}}'} for user's name, {'{{email}}'} for email
                  </span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  placeholder="Write your message here... Use {{name}} to personalize"
                  className="w-full px-4 py-2 bg-[#262626] rounded-lg border border-white/10 text-white focus:border-blue-500 focus:outline-none resize-none  text-white border-[#2A2A4A]"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500  text-white border-[#2A2A4A]">
                  <span>{message.length} characters</span>
                  <span>≈ {Math.ceil(message.length / 1000)} minutes read</span>
                </div>
              </div>

              <div className="flex gap-3  text-white border-[#2A2A4A]">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg /20 transition-colors text-sm  text-white border-[#2A2A4A]"
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button
                  onClick={loadUsers}
                  className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg /15 transition-colors text-sm flex items-center gap-2  text-white border-[#2A2A4A]"
                >
                  <RefreshCw className="w-4 h-4  text-white border-[#2A2A4A]" />
                  Refresh Users
                </button>
              </div>

              {previewMode && (
                <div className="p-4 bg-white/5 rounded-lg  text-white border-[#2A2A4A]">
                  <h4 className="text-sm font-semibold text-white mb-2  text-white border-[#2A2A4A]">Preview</h4>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap  text-white border-[#2A2A4A]">
                    {message
                      .replace(/{{name}}/g, '[User Name]')
                      .replace(/{{email}}/g, 'user@email.com')}
                  </div>
                </div>
              )}

              <div className="border-t border-white/10 pt-4 mt-2  text-white border-[#2A2A4A]">
                <div className="flex items-center justify-between  text-white border-[#2A2A4A]">
                  <div className="text-sm text-gray-400  text-white border-[#2A2A4A]">
                    <span className="font-semibold text-white  text-white border-[#2A2A4A]">
                      {getSelectedCount()}
                    </span>{' '}
                    recipients selected
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || getSelectedCount() === 0 || !subject || !message}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg  transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50  text-white border-[#2A2A4A]"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin  text-white border-[#2A2A4A]" />
                    ) : (
                      <Send className="w-5 h-5  text-white border-[#2A2A4A]" />
                    )}
                    {sending ? 'Sending...' : `Send to ${getSelectedCount()} Users`}
                  </button>
                </div>
                {sending && (
                  <div className="mt-2 text-sm text-gray-400  text-white border-[#2A2A4A]">
                    Sending... ({sentCount} sent, {failedCount} failed)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSendMessage;