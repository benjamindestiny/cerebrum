import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Users,
  Search,
  Calendar,
  Zap,
  Loader2,
  RefreshCw,
  TrendingUp,
  Flame,
} from "lucide-react";
import { supabase } from "../services/supabase";

const Leaderboard = () => {
  const location = useLocation();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadLeaderboard();
    getCurrentUser();
  }, [location.key]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  // ✅ NEW: Strict ranking calculation
  const calculateRankScore = (stats) => {
    if (!stats) return 0;
    
    // 1. Average Score (40% weight)
    const avgScore = stats.average_score || 0;
    
    // 2. Quiz Count Bonus (30% weight)
    const quizCount = stats.total_quizzes || 0;
    const quizBonus = Math.min(quizCount / 10, 10);
    
    // 3. Consistency Bonus (30% weight)
    const streak = stats.streak || 0;
    const streakBonus = Math.min(streak / 5, 5);
    
    const daysActive = stats.days_active || 0;
    const daysBonus = Math.min(daysActive / 10, 5);
    
    const consistencyBonus = streakBonus + daysBonus;
    
    // Final Score
    const finalScore = (avgScore * 0.4) + (quizBonus * 3) + (consistencyBonus * 3);
    
    return Math.round(Math.min(finalScore, 100));
  };

  // ✅ NEW: Get rank tier
  const getRankTier = (rankScore) => {
    if (rankScore >= 90) return { label: '🏆 Grandmaster', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    if (rankScore >= 75) return { label: '👑 Master', color: 'text-purple-400', bg: 'bg-purple-500/10' };
    if (rankScore >= 60) return { label: '⭐ Expert', color: 'text-blue-400', bg: 'bg-blue-500/10' };
    if (rankScore >= 45) return { label: '📈 Advanced', color: 'text-green-400', bg: 'bg-green-500/10' };
    if (rankScore >= 30) return { label: '🌱 Learner', color: 'text-teal-400', bg: 'bg-teal-500/10' };
    return { label: '🌀 Beginner', color: 'text-gray-400', bg: 'bg-gray-500/10' };
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Get all users with stats
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, name, avatar_id, email, stats")
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error("Error fetching users:", usersError);
        setPlayers([]);
        setLoading(false);
        return;
      }

      if (!usersData || usersData.length === 0) {
        setPlayers([]);
        setLoading(false);
        return;
      }

      // Get quiz counts per user
      const { data: quizData, error: quizError } = await supabase
        .from("quiz_results")
        .select("user_id, percentage");

      if (quizError) {
        console.error("Error fetching quiz data:", quizError);
      }

      // Build user stats
      const userQuizCounts = {};
      if (quizData) {
        quizData.forEach(q => {
          userQuizCounts[q.user_id] = (userQuizCounts[q.user_id] || 0) + 1;
        });
      }

      // Calculate rank score for each user
      const rankedPlayers = usersData.map((user) => {
        const stats = user.stats || {};
        const quizCount = userQuizCounts[user.id] || 0;
        
        // Update stats with quiz count
        const fullStats = {
          ...stats,
          total_quizzes: quizCount,
        };
        
        const rankScore = calculateRankScore(fullStats);
        const tier = getRankTier(rankScore);
        
        return {
          userId: user.id,
          userName: user.name || user.email?.split("@")[0] || "Anonymous",
          avatarId: user.avatar_id || 1,
          rankScore,
          tier,
          quizCount: quizCount,
          streak: stats.streak || 0,
          averageScore: stats.average_score || 0,
          totalPoints: stats.total_points || 0,
          lastPlayed: stats.last_quiz_date,
        };
      });

      // Sort by rank score (highest first)
      rankedPlayers.sort((a, b) => b.rankScore - a.rankScore);

      // Add ranks
      rankedPlayers.forEach((player, index) => {
        player.rank = index + 1;
      });

      // ✅ Require minimum quizzes to be ranked
      const MIN_QUIZZES = 3;
      const ranked = rankedPlayers.map(player => ({
        ...player,
        isRanked: player.quizCount >= MIN_QUIZZES,
      }));

      // Avatar map
      const avatarMap = {
        1: "🧠", 2: "🦊", 3: "🐉", 4: "🦅", 5: "🐺",
        6: "🦄", 7: "🐼", 8: "🦁", 9: "🐧", 10: "🐱",
        11: "🐶", 12: "🦋", 13: "🦉", 14: "🐨", 15: "🦦", 16: "🐘",
      };
      ranked.forEach((player) => {
        player.avatar = avatarMap[player.avatarId] || "🧠";
      });

      setPlayers(ranked);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboard = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-500 font-medium">#{rank}</span>;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "border-yellow-400/30 bg-yellow-400/5";
    if (rank === 2) return "border-gray-400/30 bg-gray-400/5";
    if (rank === 3) return "border-amber-600/30 bg-amber-600/5";
    return "";
  };

  const filteredPlayers = players.filter((player) =>
    player.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUserData = players.find((p) => p.userId === currentUser?.id);
  const currentUserRank = currentUserData?.rank || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {players.filter(p => p.isRanked).length} ranked players • Min {3} quizzes required
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">{players.length} players</span>
          </div>
          <button
            onClick={refreshLeaderboard}
            disabled={refreshing}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Current User Rank */}
      {currentUser && currentUserData && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentUserData.avatar || "🧠"}</span>
              <div>
                <p className="text-white font-medium">{currentUserData.userName}</p>
                <p className="text-sm text-gray-400">Your current rank</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  #{currentUserRank || "-"}
                </div>
                <div className="text-xs text-gray-500">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {currentUserData.rankScore || 0}
                </div>
                <div className="text-xs text-gray-500">Rank Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">
                  {currentUserData.quizCount || 0}
                </div>
                <div className="text-xs text-gray-500">Quizzes</div>
              </div>
              {currentUserData.streak > 0 && (
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-400">
                    {currentUserData.streak}🔥
                  </div>
                  <div className="text-xs text-gray-500">Streak</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 pl-10 pr-4 py-2 bg-[#1E1E3A] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* Top 3 Podium */}
      {filteredPlayers.filter(p => p.isRanked).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filteredPlayers.filter(p => p.isRanked).slice(0, 3).map((player, index) => {
            const rank = index + 1;
            const tier = player.tier || getRankTier(player.rankScore);
            return (
              <div
                key={player.userId}
                className={`bg-white/5 border rounded-xl p-6 text-center transition-all ${getRankColor(rank)} hover:border-blue-500/30`}
              >
                <div className="text-4xl mb-2">{player.avatar || "🧠"}</div>
                <div className="text-lg font-bold text-white truncate">
                  {player.userName}
                </div>
                <div className="text-3xl font-bold text-blue-400 mt-1">
                  {player.rankScore}
                </div>
                <div className="text-xs text-gray-500">Rank Score</div>
                <div className={`text-xs mt-1 ${tier.color}`}>{tier.label}</div>
                <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-400">
                  <span>{player.quizCount} quizzes</span>
                  {player.streak > 0 && (
                    <span className="flex items-center gap-1 text-orange-400">
                      <Zap className="w-3 h-3" />
                      {player.streak}d
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-2xl">{getRankBadge(rank)}</span>
                  <span className="text-sm text-gray-500">Rank #{rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All Players List */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          All Players
          <span className="text-sm text-gray-500 ml-2">
            ({filteredPlayers.length} players)
          </span>
        </h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredPlayers.map((player) => {
            const isCurrentUser = currentUser?.id === player.userId;
            const isRanked = player.isRanked;
            const tier = player.tier || getRankTier(player.rankScore);
            
            return (
              <div
                key={player.userId}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  isCurrentUser
                    ? "bg-blue-500/10 border border-blue-500/20"
                    : "hover:bg-white/5"
                } ${!isRanked ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-8 text-center flex-shrink-0">
                    {isRanked ? (
                      getRankIcon(player.rank)
                    ) : (
                      <span className="text-gray-600 text-sm">—</span>
                    )}
                  </div>
                  <span className="text-xl flex-shrink-0">
                    {player.avatar || "🧠"}
                  </span>
                  <span className="text-white font-medium truncate">
                    {player.userName}
                    {isCurrentUser && (
                      <span className="ml-2 text-sm text-blue-400">(You)</span>
                    )}
                    {!isRanked && (
                      <span className="ml-2 text-xs text-gray-500">(Needs 3 quizzes)</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {isRanked && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tier.bg} ${tier.color}`}>
                      {tier.label.split(' ')[1] || tier.label}
                    </span>
                  )}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${isRanked ? 'text-white' : 'text-gray-500'}`}>
                      {isRanked ? player.rankScore : '-'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isRanked ? 'Score' : 'Not ranked'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredPlayers.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">No Players Yet</h3>
            <p className="text-gray-400 max-w-md">
              Be the first to take a quiz and claim your spot on the leaderboard! 🏆
            </p>
            <button
              onClick={() => (window.location.href = "/categories")}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              Start a Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
