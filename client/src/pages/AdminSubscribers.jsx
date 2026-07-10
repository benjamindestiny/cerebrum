import React, { useState, useEffect } from 'react';
import { Users, Mail, Calendar, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../services/supabase';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;

      setSubscribers(data || []);
      setStats({
        total: data?.length || 0,
        active: data?.filter(s => s.is_active).length || 0,
      });
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await loadSubscribers();
    setRefreshing(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('newsletter')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh list
      await loadSubscribers();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-[#a78bfa]" />
            Subscribers
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your newsletter subscribers
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Total Subscribers</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          <div className="text-sm text-gray-400">Active</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.total - stats.active}</div>
          <div className="text-sm text-gray-400">Unsubscribed</div>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Subscribed</th>
                <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-white text-sm">{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-gray-400 text-sm">
                      {subscriber.user_id ? '✅ Registered' : '👤 Guest'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-gray-400 text-sm">
                      {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3">
                    {subscriber.is_active ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-sm">
                        <XCircle className="w-4 h-4" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleStatus(subscriber.id, subscriber.is_active)}
                      className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                        subscriber.is_active
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {subscriber.is_active ? 'Unsubscribe' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {subscribers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No subscribers yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscribers;