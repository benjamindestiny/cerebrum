import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Users,
  ArrowLeft,
  Loader2,
  ChevronUp,
  ChevronDown,
  Award,
  Sparkles,
  Flame,
  Target,
  Brain,
  RefreshCw,
  User,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [filter, setFilter] = useState('points'); // points, quizzes, streak
  const [timeFrame, setTimeFrame] = useState('all'); // all, weekly, monthly

  useEffect(() => {
    loadLeaderboard();
  }, [filter, timeFrame]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      setCurrentUser(user);

      // Get all users with stats
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('stats->total_points', { ascending: false })
        .limit(100);

      if (usersError) {
        console.error('Error fetching users:', usersError);
        // Try alternative query
        const { data: altData, error: altError } = await supabase
          .from('users')
          .select('*');
        
        if (altError) throw altError;
        
        // Sort manually
        const sorted = altData.sort((a, b) => {
          const aPoints = a.stats?.total_points || 0;
          const bPoints = b.stats?.total_points || 0;
          return bPoints - aPoints;
        });
        
        setUsers(sorted);
        findUserRank(sorted, user.id);
        setLoading(false);
        return;
      }

      setUsers(usersData || []);
      findUserRank(usersData || [], user.id);
      
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const findUserRank = (usersList, userId) => {
    const index = usersList.findIndex(u => u.id === userId);
    if (index !== -1) {
      setCurrentUserRank(index + 1);
    } else {
      setCurrentUserRank(null);
    }
  };

  const refreshLeaderboard = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('stats->total_points', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      setUsers(data || []);
      if (currentUser) {
        findUserRank(data || [], currentUser.id);
      }
      toast.success('Leaderboard refreshed! 🔄');
    } catch (error) {
      console.error('Error refreshing:', error);
      toast.error('Failed to refresh leaderboard');
    } finally {
      setRefreshing(false);
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm text-gray-500 w-5 text-center">{index + 1}</span>;
  };

  const getRankColor = (index) => {
    if (index === 0) return 'bg-yellow-400/20 border-yellow-400/30';
    if (index === 1) return 'bg-gray-400/20 border-gray-400/30';
    if (index === 2) return 'bg-amber-600/20 border-amber-600/30';
    return 'bg-white/5 border-white/5';
  };

  const getRankBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getFilteredUsers = () => {
    let sorted = [...users];
    
    switch(filter) {
      case 'quizzes':
        sorted.sort((a, b) => (b.stats?.total_quizzes || 0) - (a.stats?.total_quizzes || 0));
        break;
      case 'streak':
        sorted.sort((a, b) => (b.stats?.streak || 0) - (a.stats?.streak || 0));
        break;
      case 'points':
      default:
        sorted.sort((a, b) => (b.stats?.total_points || 0) - (a.stats?.total_points || 0));
        break;
    }
    
    return sorted;
  };

  const filteredUsers = getFilteredUsers();

  // Check if user is in the list
  const userInList = filteredUsers.some(u => u.id === currentUser?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-[#7c3aed] animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
            Leaderboard
          </h1>
        </div>
        <button
          onClick={refreshLeaderboard}
          disabled={refreshing}
          className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* User Stats Summary - Mobile Friendly */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="glass-card p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl font-bold text-white">
            {users.length}
          </div>
          <div className="text-[8px] sm:text-[10px] text-gray-400">Players</div>
        </div>
        <div className="glass-card p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl font-bold text-yellow-400">
            {currentUserRank || '-'}
          </div>
          <div className="text-[8px] sm:text-[10px] text-gray-400">Your Rank</div>
        </div>
        <div className="glass-card p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl font-bold text-[#7c3aed]">
            {currentUser?.user_metadata?.name || 'You'}
          </div>
          <div className="text-[8px] sm:text-[10px] text-gray-400 truncate">Username</div>
        </div>
      </div>

      {/* Filter Tabs - Scrollable on Mobile */}
      <div className="flex gap-1 sm:gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: 'points', label: '🏆 Points', icon: <Trophy className="w-3 h-3" /> },
          { id: 'quizzes', label: '📚 Quizzes', icon: <Target className="w-3 h-3" /> },
          { id: 'streak', label: '🔥 Streak', icon: <Flame className="w-3 h-3" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-[#7c3aed] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <span className="hidden sm:inline">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-1.5 sm:space-y-2">
        {filteredUsers.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          filteredUsers.slice(0, 50).map((user, index) => {
            const isCurrentUser = user.id === currentUser?.id;
            const stats = user.stats || {};
            const rank = index + 1;
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`glass-card p-2 sm:p-3 transition-all ${
                  isCurrentUser 
                    ? 'border-2 border-[#7c3aed] bg-[#7c3aed]/10' 
                    : 'border border-white/5'
                } ${getRankColor(index)}`}
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Rank */}
                  <div className="w-8 sm:w-10 flex-shrink-0 text-center">
                    <div className="text-lg sm:text-xl">
                      {getRankBadge(index)}
                    </div>
                  </div>

                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-xl bg-white/5 border border-white/10">
                      {user.avatar_id ? (
                        <span>{user.avatar_id}</span>
                      ) : (
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Name and Stats */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs sm:text-sm font-semibold truncate ${
                        isCurrentUser ? 'text-[#a78bfa]' : 'text-white'
                      }`}>
                        {user.name || user.email?.split('@')[0] || 'Anonymous'}
                      </p>
                      {isCurrentUser && (
                        <span className="text-[8px] sm:text-[10px] px-1.5 py-0.5 bg-[#7c3aed] rounded-full text-white flex-shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-xs text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {stats.total_points || 0} pts
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {stats.total_quizzes || 0}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {stats.streak || 0}
                      </span>
                    </div>
                  </div>

                  {/* Score/Value based on filter */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xs sm:text-sm font-bold text-white">
                      {filter === 'quizzes' && (stats.total_quizzes || 0)}
                      {filter === 'streak' && (stats.streak || 0)}
                      {filter === 'points' && (stats.total_points || 0)}
                    </div>
                    <div className="text-[8px] sm:text-[10px] text-gray-500">
                      {filter === 'quizzes' && 'quizzes'}
                      {filter === 'streak' && 'days'}
                      {filter === 'points' && 'pts'}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* User not in top list */}
      {!userInList && currentUser && (
        <div className="mt-4 p-3 glass-card border-2 border-[#7c3aed] bg-[#7c3aed]/5">
          <p className="text-center text-sm text-gray-400">
            You're not in the top list yet. Keep learning to climb the ranks! 🚀
          </p>
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="glass-card p-2 text-center">
          <div className="text-xs text-gray-400">Top Player</div>
          <div className="text-sm font-bold text-white truncate">
            {filteredUsers.length > 0 ? 
              (filteredUsers[0]?.name || filteredUsers[0]?.email?.split('@')[0] || 'Anonymous') 
              : '-'}
          </div>
        </div>
        <div className="glass-card p-2 text-center">
          <div className="text-xs text-gray-400">Total Players</div>
          <div className="text-sm font-bold text-white">{filteredUsers.length}</div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;