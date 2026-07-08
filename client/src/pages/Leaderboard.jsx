import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Users,
  Search,
  TrendingUp,
  Calendar,
  Zap,
  Loader2,
  User,
  Star,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadLeaderboard();
    getCurrentUser();

    // Set up real-time subscription for user stats updates
    const subscription = supabase
      .channel("leaderboard_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
        },
        () => {
          // When any user stats update, refresh leaderboard
          refreshLeaderboard();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "users",
        },
        () => {
          // When new user joins, refresh leaderboard
          refreshLeaderboard();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getCurrentUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Get all users with their stats
      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .order("stats->total_points", { ascending: false })
        .limit(100);

      if (error) {
        // If ordering fails, get all and sort manually
        const { data: allUsers, error: fetchError } = await supabase
          .from("users")
          .select("*");

        if (fetchError) throw fetchError;

        const sortedUsers = allUsers.sort((a, b) => {
          const aPoints = a.stats?.total_points || 0;
          const bPoints = b.stats?.total_points || 0;
          return bPoints - aPoints;
        });

        processUsers(sortedUsers);
        return;
      }

      processUsers(users || []);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      toast.error("Failed to load leaderboard");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const processUsers = (users) => {
    // Process users and calculate stats
    const processed = users.map((user) => {
      const stats = user.stats || {};
      const totalQuizzes = stats.total_quizzes || 0;
      const totalPoints = stats.total_points || 0;
      const averageScore = stats.average_score || 0;
      const bestScore = stats.best_score || 0;
      const streak = stats.streak || 0;
      const totalCorrect = stats.total_correct || 0;
      const totalIncorrect = stats.total_incorrect || 0;

      // Calculate accuracy
      const totalQuestions = totalCorrect + totalIncorrect;
      const accuracy =
        totalQuestions > 0
          ? Math.round((totalCorrect / totalQuestions) * 100)
          : 0;

      // Avatar mapping
      const avatarMap = {
        1: "🧠",
        2: "🚀",
        3: "🌟",
        4: "🎯",
        5: "💪",
        6: "🧙",
        7: "🦊",
        8: "🐉",
        9: "🦅",
        10: "🐺",
        11: "🦄",
        12: "🐼",
        13: "🦁",
        14: "🐧",
        15: "🐱",
        16: "🐶",
      };

      return {
        id: user.id,
        name: user.name || user.email?.split("@")[0] || "Anonymous",
        email: user.email,
        avatar: avatarMap[user.avatar_id] || "🧠",
        totalQuizzes,
        totalPoints,
        averageScore,
        bestScore,
        streak,
        accuracy,
        totalCorrect,
        totalIncorrect,
        stats: stats,
        created_at: user.created_at,
      };
    });

    // Sort by total points (or average score if same)
    processed.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return b.averageScore - a.averageScore;
    });

    // Add rank
    processed.forEach((user, index) => {
      user.rank = index + 1;
    });

    setPlayers(processed);
  };

  const refreshLeaderboard = async () => {
    setRefreshing(true);
    try {
      await loadLeaderboard();
      toast.success("Leaderboard refreshed! 🔄");
    } catch (error) {
      console.error("Error refreshing:", error);
      toast.error("Failed to refresh leaderboard");
    } finally {
      setRefreshing(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-500 font-medium">#{rank}</span>;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return "border-yellow-400/30 bg-yellow-400/5";
    if (rank === 2) return "border-gray-400/30 bg-gray-400/5";
    if (rank === 3) return "border-amber-600/30 bg-amber-600/5";
    return "";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Find current user's rank
  const currentUserRank =
    players.findIndex((p) => p.id === currentUser?.id) + 1;
  const currentUserData = players.find((p) => p.id === currentUser?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-3 sm:px-4 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Top performers from around the world
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-xs sm:text-sm text-gray-300">
              {players.length} players
            </span>
          </div>
          <button
            onClick={refreshLeaderboard}
            disabled={refreshing}
            className="p-2 glass-card hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-400 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Current User Rank */}
      {currentUser && currentUserRank > 0 && currentUserData && (
        <div className="glass-card p-3 sm:p-4 border-2 border-[#7c3aed] bg-[#7c3aed]/5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentUserData.avatar || "🧠"}</span>
              <div>
                <p className="text-white font-medium text-sm sm:text-base">
                  {currentUserData.name}
                </p>
                <p className="text-xs text-gray-400">Your current rank</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#7c3aed]">
                  #{currentUserRank}
                </div>
                <div className="text-[10px] text-gray-500">Rank</div>
              </div>
              <div className="text-center px-3">
                <div className="text-xl font-bold text-white">
                  {currentUserData.averageScore}%
                </div>
                <div className="text-[10px] text-gray-500">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">
                  {currentUserData.streak}🔥
                </div>
                <div className="text-[10px] text-gray-500">Streak</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all text-sm"
          />
        </div>
        <div className="text-xs text-gray-500">
          Showing {filteredPlayers.length} players
        </div>
      </div>

      {/* Top 3 - Mobile Responsive */}
      {filteredPlayers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {filteredPlayers.slice(0, 3).map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-4 sm:p-6 text-center ${getRankClass(index + 1)}`}
            >
              <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">
                {player.avatar || "🧠"}
              </div>
              <div className="text-base sm:text-xl font-bold text-white truncate">
                {player.name}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#7c3aed] mt-1">
                {player.averageScore}%
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-400 flex-wrap">
                <span>{player.totalQuizzes} quizzes</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  {player.totalPoints} pts
                </span>
                {player.streak > 0 && (
                  <span className="flex items-center gap-1 text-orange-400">
                    <Zap className="w-3 h-3" />
                    {player.streak}d
                  </span>
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
      <div className="glass-card p-3 sm:p-6">
        <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Trophy className="w-4 h-4 text-yellow-400" />
          All Players
          <span className="text-xs text-gray-500 ml-2">
            ({filteredPlayers.length} players)
          </span>
        </h3>
        <div className="space-y-1.5 sm:space-y-2 max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
          {filteredPlayers.map((player) => {
            const isCurrentUser = currentUser?.id === player.id;
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (player.rank || 0) * 0.02 }}
                className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-colors ${
                  isCurrentUser
                    ? "bg-[#7c3aed]/10 border border-[#7c3aed]/30"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                  <div className="w-6 sm:w-8 text-center flex-shrink-0">
                    {getRankIcon(player.rank)}
                  </div>
                  <span className="text-xl sm:text-2xl flex-shrink-0">
                    {player.avatar || "🧠"}
                  </span>
                  <span className="text-white font-medium text-sm sm:text-base truncate">
                    {player.name}
                    {isCurrentUser && (
                      <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs text-[#a78bfa]">
                        (You)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {player.totalQuizzes}
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                    <Star className="w-3 h-3 text-yellow-400" />
                    {player.totalPoints}
                  </div>
                  {player.streak > 0 && (
                    <div className="flex items-center gap-1 text-xs text-orange-400">
                      <Zap className="w-3 h-3" />
                      <span className="hidden sm:inline">{player.streak}d</span>
                    </div>
                  )}
                  <div className="text-right">
                    <div
                      className={`text-sm sm:text-lg font-bold ${getScoreColor(player.averageScore)}`}
                    >
                      {player.averageScore}%
                    </div>
                    <div className="text-[8px] sm:text-xs text-gray-500">
                      Avg
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {filteredPlayers.length === 0 && (
        <div className="glass-card p-8 sm:p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7c3aed]/10 flex items-center justify-center">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#7c3aed]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              No Players Yet
            </h3>
            <p className="text-gray-400 text-sm sm:text-base max-w-md">
              Be the first to take a quiz and claim your spot on the
              leaderboard! 🏆
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
