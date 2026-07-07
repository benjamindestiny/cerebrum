import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Users,
  Filter,
  Search,
  TrendingUp,
  Calendar,
  Zap,
  Loader2,
  User,
  Star,
  Clock,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadLeaderboard();
    getCurrentUser();
  }, [timeFilter]);

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  // ✅ Go to profile when clicking on a player
  const goToProfile = (userId) => {
    if (userId === currentUser?.id) {
      navigate("/profile");
    } else {
      // For other users, you can navigate to a public profile or show message
      toast.info("👤 Viewing other profiles coming soon!");
    }
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase.from("leaderboard").select("*");

      if (timeFilter !== "all") {
        const now = new Date();
        let startDate;
        switch (timeFilter) {
          case "today":
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case "week":
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case "month":
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            break;
        }
        if (startDate) {
          query = query.gte("created_at", startDate.toISOString());
        }
      }

      query = query.order("score", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching leaderboard:", error);
        setPlayers([]);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        console.log("No leaderboard entries found");
        setPlayers([]);
        setLoading(false);
        return;
      }

      console.log("📊 Leaderboard data:", data);

      const processedPlayers = data.map((player, index) => {
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

        const avatarIndex = ((player.user_id?.charCodeAt(0) || 0) % 16) + 1;

        return {
          ...player,
          rank: index + 1,
          avatar: avatarMap[avatarIndex] || "🧠",
          userName: player.username || "Player",
        };
      });

      setPlayers(processedPlayers);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1)
      return (
        <Crown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" />
      );
    if (rank === 2)
      return (
        <Medal className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
      );
    if (rank === 3)
      return (
        <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-600" />
      );
    return (
      <span className="text-gray-500 font-medium text-sm sm:text-base">
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Top performers from around the world
          </p>
        </div>
        <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#7c3aed]" />
          <span className="text-xs sm:text-sm text-gray-300">
            {players.length} players
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {["all", "month", "week", "today"].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm transition-all ${
                timeFilter === filter
                  ? "bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-48">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Top 3 */}
      {filteredPlayers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {filteredPlayers.slice(0, 3).map((player, index) => (
            <motion.div
              key={player.id || player.user_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-4 sm:p-5 md:p-6 text-center ${getRankClass(index + 1)}`}
            >
              <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">
                {player.avatar || "🧠"}
              </div>
              <div
                className="text-base sm:text-lg md:text-xl font-bold text-white cursor-pointer hover:text-[#a78bfa] transition-colors"
                onClick={() => goToProfile(player.user_id)}
              >
                {player.userName}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#7c3aed] mt-1">
                {player.score}%
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  {player.score} pts
                </span>
                {player.category && (
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    {player.category}
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

      {/* Full List */}
      <div className="glass-card p-3 sm:p-4 md:p-6">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          All Players
          <span className="text-[10px] sm:text-xs text-gray-500 ml-1 sm:ml-2">
            ({filteredPlayers.length} players)
          </span>
        </h3>
        <div className="space-y-1.5 sm:space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
          {filteredPlayers.map((player) => (
            <motion.div
              key={player.id || player.user_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (player.rank || 0) * 0.02 }}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 rounded-lg transition-colors gap-2 sm:gap-0 ${
                currentUser?.id === player.user_id
                  ? "bg-[#7c3aed]/10 border border-[#7c3aed]/30"
                  : "hover:bg-white/5"
              }`}
            >
              <div
                className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto cursor-pointer"
                onClick={() => goToProfile(player.user_id)}
              >
                <div className="w-6 sm:w-8 text-center flex-shrink-0">
                  {getRankIcon(player.rank)}
                </div>
                <span className="text-xl sm:text-2xl flex-shrink-0">
                  {player.avatar || "🧠"}
                </span>
                <span className="text-white font-medium text-sm sm:text-base truncate hover:text-[#a78bfa] transition-colors">
                  {player.userName}
                  {currentUser?.id === player.user_id && (
                    <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs text-[#a78bfa]">
                      (You)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="hidden sm:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {player.category || "General"}
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400">
                  <Star className="w-3 h-3 text-yellow-400" />
                  {player.score} pts
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className={`text-sm sm:text-base md:text-lg font-bold ${getScoreColor(player.score)}`}
                  >
                    {player.score}%
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500">
                    Score
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
