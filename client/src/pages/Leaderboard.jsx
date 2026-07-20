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

  const calculateWeightedScore = (records) => {
    if (!records || records.length === 0) return 0;
    const sorted = [...records].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    let totalWeight = 0;
    let weightedSum = 0;
    sorted.forEach((record, index) => {
      const weight = Math.max(0, 1 - (index * 0.05));
      let pct = parseFloat(record.percentage) || 0;
      if (pct === 0 && record.score && record.total_questions) {
        pct = Math.round((record.score / record.total_questions) * 100);
      }
      weightedSum += pct * weight;
      totalWeight += weight;
    });
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
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

      const userIds = [...new Set(quizData.map((q) => q.user_id))];

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
          percentage = Math.round((record.score / record.total_questions) * 100);
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
            records: [],
          };
        }

        const player = playerMap[userId];
        player.totalScore += percentage;
        player.quizCount += 1;
        player.bestScore = Math.max(player.bestScore, percentage);
        player.records.push(record);
        if (record.created_at > player.lastPlayed) {
          player.lastPlayed = record.created_at;
        }
      });

      const leaderboard = Object.values(playerMap).map((player) => ({
        ...player,
        averageScore: player.quizCount > 0
          ? Math.round(player.totalScore / player.quizCount)
          : 0,
        weightedScore: calculateWeightedScore(player.records),
      }));

      leaderboard.sort((a, b) => {
        if (b.weightedScore !== a.weightedScore) {
          return b.weightedScore - a.weightedScore;
        }
        if (b.averageScore !== a.averageScore) {
          return b.averageScore - a.averageScore;
        }
        return b.quizCount - a.quizCount;
      });

      leaderboard.forEach((player, index) => {
        player.rank = index + 1;
      });

      const avatarMap = {
        1: "🧠", 2: "🚀", 3: "🌟", 4: "🎯", 5: "💪",
        6: "🧙", 7: "🦊", 8: "🐉", 9: "🦅", 10: "🐺",
        11: "🦄", 12: "🐼", 13: "🦁", 14: "🐧", 15: "🐱", 16: "🐶",
      };
      leaderboard.forEach((player) => {
        player.avatar = avatarMap[player.avatarId] || "🧠";
      });

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
    await loadLeaderboard();
    setRefreshing(false);
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-500/10 border-yellow-500/30";
    if (rank === 2) return "bg-gray-400/10 border-gray-400/30";
    if (rank === 3) return "bg-amber-600/10 border-amber-600/30";
    return "";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-[#3B82F6]";
    return "text-red-400";
  };

  const filteredPlayers = players.filter((player) =>
    player.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUserData = players.find((p) => p.userId === currentUser?.id);
  const currentUserRank = currentUserData?.rank || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-6 px-4 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {players.length} players competing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#3B82F6]" />
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
                <div className="text-2xl font-bold text-[#3B82F6]">
                  #{currentUserRank || "-"}
                </div>
                <div className="text-xs text-gray-500">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {currentUserData.weightedScore || currentUserData.averageScore || 0}%
                </div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#3B82F6]">
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
      {filteredPlayers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filteredPlayers.slice(0, 3).map((player, index) => {
            const rank = index + 1;
            return (
              <div
                key={player.userId}
                className={`bg-white/5 border rounded-xl p-6 text-center transition-all ${getRankColor(rank)} hover:border-blue-500/30`}
              >
                <div className="text-4xl mb-2">{player.avatar || "🧠"}</div>
                <div className="text-lg font-bold text-white truncate">
                  {player.userName}
                </div>
                <div className="text-3xl font-bold text-[#3B82F6] mt-1">
                  {player.weightedScore || player.averageScore}%
                </div>
                <div className="text-xs text-gray-500">
                  {player.weightedScore ? '⭐ Weighted Score' : 'Average Score'}
                </div>
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
          <Users className="w-4 h-4 text-[#3B82F6]" />
          All Players
          <span className="text-sm text-gray-500 ml-2">
            ({filteredPlayers.length} players)
          </span>
        </h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredPlayers.slice(0, 50).map((player, index) => {
            const isCurrentUser = currentUser?.id === player.userId;
            return (
              <div
                key={player.userId}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  isCurrentUser
                    ? "bg-blue-500/10 border border-blue-500/20"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-8 text-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-400">#{player.rank}</span>
                  </div>
                  <span className="text-xl flex-shrink-0">
                    {player.avatar || "🧠"}
                  </span>
                  <span className="text-white font-medium truncate">
                    {player.userName}
                    {isCurrentUser && (
                      <span className="ml-2 text-sm text-[#3B82F6]">(You)</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {player.quizCount}
                  </div>
                  {player.streak > 0 && (
                    <div className="flex items-center gap-1 text-sm text-orange-400">
                      <Zap className="w-3 h-3" />
                      <span className="hidden sm:inline">{player.streak}d</span>
                    </div>
                  )}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(player.weightedScore || player.averageScore || 0)}`}>
                      {player.weightedScore || player.averageScore || 0}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {player.weightedScore ? '⭐ Weighted' : 'Avg'}
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
              <Users className="w-10 h-10 text-[#3B82F6]" />
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
    </motion.div>
  );
};

export default Leaderboard;
