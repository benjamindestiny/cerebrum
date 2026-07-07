import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Crown, Medal, Award, Users, 
  Filter, Search, TrendingUp, Calendar, Zap,
  Loader2, User, Star, Clock
} from 'lucide-react';
import { supabase } from '../services/supabase';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadLeaderboard();
    getCurrentUser();
  }, [timeFilter]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  // ✅ FIXED: Read from leaderboard table directly
  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('leaderboard')
        .select('*');

      // Time filter
      if (timeFilter !== 'all') {
        const now = new Date();
        let startDate;
        switch (timeFilter) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            break;
        }
        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }

      // Order by score descending (highest first)
      query = query.order('score', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leaderboard:', error);
        setPlayers([]);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        console.log('No leaderboard entries found');
        setPlayers([]);
        setLoading(false);
        return;
      }

      console.log('📊 Leaderboard data:', data);

      // Process the data - add rank and avatar
      const processedPlayers = data.map((player, index) => {
        // Get avatar based on user_id or use default
        const avatarMap = {
          1: '🧠', 2: '🚀', 3: '🌟', 4: '🎯', 5: '💪',
          6: '🧙', 7: '🦊', 8: '🐉', 9: '🦅', 10: '🐺',
          11: '🦄', 12: '🐼', 13: '🦁', 14: '🐧', 15: '🐱', 16: '🐶'
        };
        
        // Use a simple hash to get consistent avatar for each user
        const avatarIndex = (player.user_id?.charCodeAt(0) || 0) % 16 + 1;
        
        return {
          ...player,
          rank: index + 1,
          avatar: avatarMap[avatarIndex] || '🧠',
          userName: player.username || 'Player',
          averageScore: player.score, // Use the score directly
          totalScore: player.score,
          quizCount: 1 // Since each entry is one quiz result
        };
      });

      setPlayers(processedPlayers);
      
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-500 font-medium">#{rank}</span>;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'border-yellow-400/30 bg-yellow-400/5';
    if (rank === 2) return 'border-gray-400/30 bg-gray-400/5';
    if (rank === 3) return 'border-amber-600/30 bg-amber-600/5';
    return '';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredPlayers = players.filter(player =>
    player.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-gray-400 mt-1">Top performers from around the world</p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#7c3aed]" />
          <span className="text-sm text-gray-300">{players.length} players</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['all', 'month', 'week', 'today'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                timeFilter === filter
                  ? 'bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all text-sm w-48"
          />
        </div>
      </div>

      {/* Top 3 */}
      {filteredPlayers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPlayers.slice(0, 3).map((player, index) => (
            <motion.div
              key={player.id || player.user_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-6 text-center ${getRankClass(index + 1)}`}
            >
              <div className="text-4xl mb-2">
                {player.avatar || '🧠'}
              </div>
              <div className="text-xl font-bold text-white">{player.userName}</div>
              <div className="text-3xl font-bold text-[#7c3aed] mt-1">
                {player.score}%
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  {player.score} pts
                </span>
                {player.category && (
                  <span className="text-xs text-gray-500">{player.category}</span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                {getRankIcon(index + 1)}
                <span className="text-xs text-gray-500">Rank #{index + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full List */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          All Players
          <span className="text-xs text-gray-500 ml-2">({filteredPlayers.length} players)</span>
        </h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredPlayers.map((player) => (
            <motion.div
              key={player.id || player.user_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (player.rank || 0) * 0.02 }}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                currentUser?.id === player.user_id ? 'bg-[#7c3aed]/10 border border-[#7c3aed]/30' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center">
                  {getRankIcon(player.rank)}
                </div>
                <span className="text-2xl">{player.avatar || '🧠'}</span>
                <span className="text-white font-medium">
                  {player.userName}
                  {currentUser?.id === player.user_id && (
                    <span className="ml-2 text-xs text-[#a78bfa]">(You)</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {player.category || 'General'}
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-3 h-3 text-yellow-400" />
                  {player.score} pts
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(player.score)}`}>
                    {player.score}%
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredPlayers.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#7c3aed]/10 flex items-center justify-center">
              <Users className="w-10 h-10 text-[#7c3aed]" />
            </div>
            <h3 className="text-xl font-bold text-white">No Players Yet</h3>
            <p className="text-gray-400 max-w-md">
              Be the first to take a quiz and claim your spot on the leaderboard! 🏆
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;