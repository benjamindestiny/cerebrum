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

  // ✅ CORRECTED loadLeaderboard function - matches actual database schema
  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('quiz_results')
        .select('user_id, category, score, total_questions, percentage, time_taken, answers, created_at');

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

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching quiz results:', error);
        setPlayers([]);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        console.log('No quiz results found');
        setPlayers([]);
        setLoading(false);
        return;
      }

      // Aggregate scores by user
      const userScores = {};
      data.forEach(record => {
        if (!userScores[record.user_id]) {
          userScores[record.user_id] = {
            userId: record.user_id,
            userName: 'Player', // Will be updated from users table
            totalScore: 0,
            quizCount: 0,
            bestScore: 0,
            averageScore: 0,
            recentScore: 0,
            category: record.category || 'General',
            rank: 0
          };
        }
        const user = userScores[record.user_id];
        const scorePercentage = record.percentage || (record.score / record.total_questions) * 100;
        user.totalScore += record.score;
        user.quizCount += 1;
        user.bestScore = Math.max(user.bestScore, Math.round(scorePercentage));
        user.recentScore = Math.round(scorePercentage);
        user.category = record.category || user.category;
      });

      // Calculate averages
      const leaderboard = Object.values(userScores).map(user => ({
        ...user,
        averageScore: Math.round(user.totalScore / user.quizCount)
      }));

      // Sort by average score (highest first)
      leaderboard.sort((a, b) => b.averageScore - a.averageScore);

      // Add rank
      leaderboard.forEach((user, index) => {
        user.rank = index + 1;
      });

      // Get user names from auth.users
      const userIds = leaderboard.map(u => u.userId);
      if (userIds.length > 0) {
        try {
          // Get user metadata from auth.users
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, name, email, avatar_id')
            .in('id', userIds);

          if (!userError && userData) {
            const userMap = {};
            userData.forEach(u => {
              userMap[u.id] = {
                name: u.name || u.email?.split('@')[0] || 'Player',
                avatar: u.avatar_id || 1
              };
            });
            
            const avatarMap = {
              1: '🧠', 2: '🚀', 3: '🌟', 4: '🎯', 5: '💪',
              6: '🧙', 7: '🦊', 8: '🐉', 9: '🦅', 10: '🐺',
              11: '🦄', 12: '🐼', 13: '🦁', 14: '🐧', 15: '🐱', 16: '🐶'
            };
            
            leaderboard.forEach(u => {
              const userInfo = userMap[u.userId];
              if (userInfo) {
                u.userName = userInfo.name;
                u.avatar = avatarMap[userInfo.avatar] || '🧠';
              } else {
                u.userName = 'Player';
                u.avatar = '🧠';
              }
            });
          } else {
            // If users table doesn't exist, use email from auth
            try {
              const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
              if (!authError && authUsers) {
                const authMap = {};
                authUsers.users.forEach(u => {
                  authMap[u.id] = u.email?.split('@')[0] || 'Player';
                });
                leaderboard.forEach(u => {
                  u.userName = authMap[u.userId] || 'Player';
                  u.avatar = '🧠';
                });
              }
            } catch (authErr) {
              // Fallback: use user_id as name
              leaderboard.forEach(u => {
                u.userName = 'Player_' + u.userId.slice(0, 6);
                u.avatar = '🧠';
              });
            }
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          // Fallback: use user_id as name
          leaderboard.forEach(u => {
            u.userName = 'Player_' + u.userId.slice(0, 6);
            u.avatar = '🧠';
          });
        }
      }

      setPlayers(leaderboard.slice(0, 20));
      
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
              key={player.userId}
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
                {player.averageScore}%
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-400">
                <span>{player.quizCount} quizzes</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  {player.totalScore} pts
                </span>
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
              key={player.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (player.rank || 0) * 0.02 }}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                currentUser?.id === player.userId ? 'bg-[#7c3aed]/10 border border-[#7c3aed]/30' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center">
                  {getRankIcon(player.rank)}
                </div>
                <span className="text-2xl">{player.avatar || '🧠'}</span>
                <span className="text-white font-medium">
                  {player.userName}
                  {currentUser?.id === player.userId && (
                    <span className="ml-2 text-xs text-[#a78bfa]">(You)</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {player.quizCount} quizzes
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-3 h-3 text-yellow-400" />
                  {player.totalScore} pts
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(player.averageScore)}`}>
                    {player.averageScore}%
                  </div>
                  <div className="text-xs text-gray-500">Avg Score</div>
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