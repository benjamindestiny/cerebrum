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
  Star,
  RefreshCw,
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

  useEffect(() => {
    const subscription = supabase
      .channel("leaderboard_updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "quiz_results",
        },
        () => {
          refreshLeaderboard();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Step 1: Get all quiz results
      const { data: quizData, error: quizError } = await supabase
        .from("quiz_results")
        .select("*");

      if (quizError) {
        console.error("Error fetching quiz results:", quizError);
        setPlayers([]);
        setLoading(false);
        return;
      }

      if (!quizData || quizData.length === 0) {
        setPlayers([]);
        setLoading(false);
        return;
      }

      // Step 2: Get all user IDs from quiz results
      const userIds = [...new Set(quizData.map((q) => q.user_id))];

      // Step 3: Get user info for all users who have taken quizzes
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, name, avatar_id, email, stats")
        .in("id", userIds);

      const userMap = {};
      if (usersData) {
        usersData.forEach((u) => {
          userMap[u.id] = {
            name: u.name || u.email?.split("@")[0] || "Anonymous",
            avatarId: u.avatar_id || 1,
            stats: u.stats || {},
          };
        });
      }

      // Step 4: Aggregate data by user
      const playerMap = {};
      quizData.forEach((record) => {
        const userId = record.user_id;
        const userInfo = userMap[userId] || {
          name: "Anonymous",
          avatarId: 1,
          stats: {},
        };

        let percentage = parseFloat(record.percentage) || 0;

        if (percentage === 0 && record.score && record.total_questions) {
          percentage = Math.round(
            (record.score / record.total_questions) * 100,
          );
        }

        if (percentage === 0 && record.score) {
          percentage = Math.round(record.score);
        }

        if (!playerMap[userId]) {
          playerMap[userId] = {
            userId: userId,
            userName: userInfo.name,
            avatarId: userInfo.avatarId,
            totalScore: 0,
            quizCount: 0,
            bestScore: 0,
            streak: userInfo.stats?.streak || 0,
            totalPoints: userInfo.stats?.total_points || 0,
            lastPlayed: record.created_at,
          };
        }

        const player = playerMap[userId];
        player.totalScore += percentage;
        player.quizCount += 1;
        player.bestScore = Math.max(player.bestScore, percentage);

        if (record.created_at > player.lastPlayed) {
          player.lastPlayed = record.created_at;
        }
      });

      // Step 5: Convert to array and calculate averages
      const leaderboard = Object.values(playerMap).map((player) => ({
        ...player,
        averageScore:
          player.quizCount > 0
            ? Math.round(player.totalScore / player.quizCount)
            : 0,
      }));

      // Step 6: Sort by average score descending
      leaderboard.sort((a, b) => {
        if (b.averageScore !== a.averageScore) {
          return b.averageScore - a.averageScore;
        }
        return b.quizCount - a.quizCount;
      });

      // Step 7: Add ranks
      leaderboard.forEach((player, index) => {
        player.rank = index + 1;
      });

      // Step 8: Add avatars
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
      leaderboard.forEach((player) => {
        player.avatar = avatarMap[player.avatarId] || "🧠";
      });

      console.log("📊 Leaderboard loaded:", leaderboard.length, "players");
      setPlayers(leaderboard);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboard = async () => {
    setRefreshing(true);
    try {
      await loadLeaderboard();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1)
      return <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />;
    if (rank === 2)
      return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />;
    if (rank === 3)
      return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />;
    return (
      <span className="text-gray-500 font-medium text-xs sm:text-sm">
        #{rank}
      </span>
    );
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

  const filteredPlayers = players.filter((player) =>
    player.userName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const currentUserData = players.find((p) => p.userId === currentUser?.id);
  const currentUserRank = currentUserData?.rank || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
            {players.length} players competing
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="glass-card px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7c3aed]" />
            <span className="text-[10px] sm:text-xs md:text-sm text-gray-300">
              {players.length} players
            </span>
          </div>
          <button
            onClick={refreshLeaderboard}
            disabled={refreshing}
            className="p-1.5 sm:p-2 glass-card hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {currentUser && currentUserData && (
        <div className="glass-card p-3 sm:p-4 border-2 border-[#7c3aed] bg-[#7c3aed]/5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">
                {currentUserData.avatar || "🧠"}
              </span>
              <div>
                <p className="text-white font-medium text-xs sm:text-sm md:text-base">
                  {currentUserData.userName}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  Your current rank
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#7c3aed]">
                  #{currentUserRank || "-"}
                </div>
                <div className="text-[8px] sm:text-[10px] text-gray-500">
                  Rank
                </div>
              </div>
              <div className="text-center px-2 sm:px-3">
                <div className="text-base sm:text-lg md:text-xl font-bold text-white">
                  {currentUserData.averageScore || 0}%
                </div>
                <div className="text-[8px] sm:text-[10px] text-gray-500">
                  Avg Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg md:text-xl font-bold text-[#7c3aed]">
                  {currentUserData.quizCount || 0}
                </div>
                <div className="text-[8px] sm:text-[10px] text-gray-500">
                  Quizzes
                </div>
              </div>
              {currentUserData.streak > 0 && (
                <div className="text-center">
                  <div className="text-base sm:text-lg md:text-xl font-bold text-orange-400">
                    {currentUserData.streak}🔥
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-gray-500">
                    Streak
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-40 md:w-48 pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all text-xs sm:text-sm"
        />
      </div>

      {filteredPlayers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {filteredPlayers.slice(0, 3).map((player, index) => (
            <motion.div
              key={player.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-4 sm:p-6 text-center ${getRankClass(index + 1)}`}
            >
              <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">
                {player.avatar || "🧠"}
              </div>
              <div className="text-sm sm:text-base md:text-xl font-bold text-white truncate">
                {player.userName}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#7c3aed] mt-1">
                {player.averageScore}%
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2 text-[10px] sm:text-xs md:text-sm text-gray-400 flex-wrap">
                <span>{player.quizCount} quizzes</span>
                {player.streak > 0 && (
                  <span className="flex items-center gap-1 text-orange-400">
                    <Zap className="w-3 h-3" />
                    {player.streak}d streak
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                {getRankIcon(index + 1)}
                <span className="text-[10px] sm:text-xs text-gray-500">
                  Rank #{index + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="glass-card p-3 sm:p-6">
        <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Trophy className="w-4 h-4 text-yellow-400" />
          All Players
          <span className="text-xs text-gray-500 ml-2">
            ({filteredPlayers.length} players)
          </span>
        </h3>
        <div className="space-y-1.5 sm:space-y-2 max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
          {filteredPlayers.slice(0, 50).map((player) => {
            const isCurrentUser = currentUser?.id === player.userId;
            return (
              <motion.div
                key={player.userId}
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
                  <div className="w-5 sm:w-8 text-center flex-shrink-0">
                    {getRankIcon(player.rank)}
                  </div>
                  <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0">
                    {player.avatar || "🧠"}
                  </span>
                  <span className="text-white font-medium text-xs sm:text-sm md:text-base truncate">
                    {player.userName}
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
                    {player.quizCount}
                  </div>
                  {player.streak > 0 && (
                    <div className="flex items-center gap-1 text-xs text-orange-400">
                      <Zap className="w-3 h-3" />
                      <span className="hidden sm:inline">{player.streak}d</span>
                    </div>
                  )}
                  <div className="text-right">
                    <div
                      className={`text-sm sm:text-lg font-bold ${getScoreColor(player.averageScore || 0)}`}
                    >
                      {player.averageScore || 0}%
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
          <div className="flex flex-col items-center gap-3 sm:gap-4">
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
            <button
              onClick={() => (window.location.href = "/categories")}
              className="mt-2 px-6 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
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
