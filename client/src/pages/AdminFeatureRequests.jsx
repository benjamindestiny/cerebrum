import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Loader2,
  RefreshCw,
  MessageSquare,
  Users,
  ThumbsUp,
  Eye,
  Filter,
  Search,
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';

const AdminFeatureRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading feature requests:', error);
      toast.error('Failed to load feature requests');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('feature_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast.success(`✅ Request marked as ${status}`);
      loadRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: '📝 Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      reviewing: { label: '🔍 Reviewing', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      approved: { label: '✅ Approved', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      rejected: { label: '❌ Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      planned: { label: '📋 Planned', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    };
    return badges[status] || badges.pending;
  };

  const getFilteredRequests = () => {
    if (filter === 'all') return requests;
    return requests.filter(r => r.status === filter);
  };

  const filteredRequests = getFilteredRequests();
  const pendingCount = requests.filter(r => r.status === 'pending').length;

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
            <Lightbulb className="w-8 h-8 text-yellow-400" />
            Feature Requests
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {pendingCount} pending requests • {requests.length} total
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total', value: requests.length, color: 'text-blue-400' },
          { label: 'Pending', value: pendingCount, color: 'text-yellow-400' },
          { label: 'Approved', value: requests.filter(r => r.status === 'approved').length, color: 'text-green-400' },
          { label: 'Planned', value: requests.filter(r => r.status === 'planned').length, color: 'text-purple-400' },
          { label: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, color: 'text-red-400' },
        ].map((stat, index) => (
          <div key={index} className="glass-card p-3 text-center">
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'pending', 'reviewing', 'approved', 'planned', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {status === 'all' ? '📋 All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.map((request) => {
          const statusBadge = getStatusBadge(request.status);
          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 hover:border-blue-500/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-white font-medium text-base sm:text-lg truncate">
                      {request.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {request.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {request.user_email || 'Anonymous'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {request.votes || 0} votes
                    </span>
                    <span className="px-2 py-0.5 bg-white/5 rounded-full">
                      {request.category || 'general'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(request.id, 'reviewing')}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        📝 Review
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, 'approved')}
                        className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, 'rejected')}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {request.status === 'reviewing' && (
                    <>
                      <button
                        onClick={() => updateStatus(request.id, 'approved')}
                        className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, 'rejected')}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, 'planned')}
                        className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                      >
                        📋 Plan
                      </button>
                    </>
                  )}
                  {request.status === 'approved' && (
                    <button
                      onClick={() => updateStatus(request.id, 'planned')}
                      className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                    >
                      📋 Plan
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-white font-bold text-lg">No Feature Requests</h3>
          <p className="text-gray-400 text-sm mt-2">
            {filter === 'all' ? 'No feature requests submitted yet.' : `No ${filter} requests found.`}
          </p>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={loadRequests}
        className="mt-4 px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>
    </motion.div>
  );
};

export default AdminFeatureRequests;
