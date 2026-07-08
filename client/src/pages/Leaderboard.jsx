import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [filter, setFilter] = useState("points");
  const [timeFrame, setTimeFrame] = useState("all");

  useEffect(() => {
    loadLeaderboard();
  }, [filter, timeFrame]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        navigate("/auth");
        return;
      }

      setCurrentUser(user);

      // Get ALL users from the users table
      let { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*");

      if (usersError) {
        console.error("Error fetching users:", usersError);
        // If table doesn't exist or error, try to get from auth
        const authUsers = await getAuthUsers();
        if (authUsers.length > 0) {
          // Create user entries for auth users
          await ensureUsersInTable(authUsers);
          // Reload
          const { data: newData, error: newError } = await supabase
            .from("users")
            .select("*");
          if (!newError) {
            usersData = newData;
          }
        }
      }

      // If still no data, try to get from auth
      if (!usersData || usersData.length === 0) {
        const authUsers = await getAuthUsers();
        if (authUsers.length > 0) {
          await ensureUsersInTable(authUsers);
          const { data: newData, error: newError } = await supabase
            .from("users")
            .select("*");
          if (!newError) {
            usersData = newData;
          }
        }
      }

      // Process users
      const processedUsers = processUsers(usersData || []);
      setUsers(processedUsers);
      findUserRank(processedUsers, user.id);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getAuthUsers = async () => {
    try {
      // Get all users from auth (this requires admin access)
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error("Error fetching auth users:", error);
        return [];
      }
      return data?.users || [];
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  const ensureUsersInTable = async (authUsers) => {
    try {
      for (const authUser of authUsers) {
        // Check if user exists in users table
        const { data: existing, error: checkError } = await supabase
          .from("users")
          .select("id")
          .eq("id", authUser.id)
          .maybeSingle();

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Check error:", checkError);
          continue;
        }

        if (!existing) {
          // Create user in users table
          const { error: insertError } = await supabase.from("users").insert({
            id: authUser.id,
            name:
              authUser.user_metadata?.name ||
              authUser.email?.split("@")[0] ||
              "Anonymous",
            email: authUser.email,
            avatar_id: 1,
            stats: {
              total_quizzes: 0,
              total_points: 0,
              average_score: 0,
              best_score: 0,
              streak: 0,
              longest_streak: 0,
              riddles_solved: 0,
              read_articles: 0,
              total_time: 0,
              perfect_scores: 0,
              total_correct: 0,
              total_incorrect: 0,
              last_quiz_date: null,
              quizzes_by_category: {},
              achievements: [],
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error("Error inserting user:", insertError);
          }
        }
      }
    } catch (error) {
      console.error("Error ensuring users in table:", error);
    }
  };

  const processUsers = (usersData) => {
    return usersData.map((user) => {
      const stats = user.stats || {};

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
        ...user,
        displayName: user.name || user.email?.split("@")[0] || "Anonymous",
        avatar: avatarMap[user.avatar_id] || "🧠",
        totalQuizzes: stats.total_quizzes || 0,
        totalPoints: stats.total_points || 0,
        averageScore: stats.average_score || 0,
        bestScore: stats.best_score || 0,
        streak: stats.streak || 0,
        longestStreak: stats.longest_streak || 0,
        riddlesSolved: stats.riddles_solved || 0,
        readArticles: stats.read_articles || 0,
        perfectScores: stats.perfect_scores || 0,
      };
    });
  };

  const findUserRank = (usersList, userId) => {
    const sorted = getSortedUsers(usersList);
    const index = sorted.findIndex((u) => u.id === userId);
    if (index !== -1) {
      setCurrentUserRank(index + 1);
    } else {
      setCurrentUserRank(null);
    }
    setUsers(sorted);
  };

  const getSortedUsers = (usersList) => {
    let sorted = [...usersList];

    switch (filter) {
      case "quizzes":
        sorted.sort((a, b) => (b.totalQuizzes || 0) - (a.totalQuizzes || 0));
        break;
      case "streak":
        sorted.sort((a, b) => (b.streak || 0) - (a.streak || 0));
        break;
      case "points":
      default:
        sorted.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
        break;
    }

    return sorted;
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

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return (
      <span className="text-sm text-gray-500 w-5 text-center">{index + 1}</span>
    );
  };

  const getRankColor = (index) => {
    if (index === 0) return "bg-yellow-400/20 border-yellow-400/30";
    if (index === 1) return "bg-gray-400/20 border-gray-400/30";
    if (index === 2) return "bg-amber-600/20 border-amber-600/30";
    return "bg-white/5 border-white/5";
  };

  const getRankBadge = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const filteredUsers = getSortedUsers(users);
  const userInList = filteredUsers.some((u) => u.id === currentUser?.id);

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
            onClick={() => navigate("/dashboard")}
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
          <RefreshCw
            className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* User Stats Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="glass-card p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl font-bold text-white">
            {users.length}
          </div>
          <div className="text-[8px] sm:text-[10px] text-gray-400">Players</div>
        </div>
        <div className="glass-card p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl font-bold text-yellow-400">
            {currentUserRank || "-"}
          </div>
          <div className="text-[8px] sm:text-[10px] text-gray-400">
            Your Rank
          </div>
        </div>
        <div className="glass-card p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl font-bold text-[#7c3aed]">
            {currentUser?.user_metadata?.name || "You"}
          </div>
          <div className="text-[8px] sm:text-[10px] text-gray-400 truncate">
            Username
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {[
          {
            id: "points",
            label: "🏆 Points",
          },
          {
            id: "quizzes",
            label: "📚 Quizzes",
          },
          {
            id: "streak",
            label: "🔥 Streak",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm whitespace-nowrap transition-all ${
              filter === tab.id
                ? "bg-[#7c3aed] text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
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
          filteredUsers.slice(0, 100).map((user, index) => {
            const isCurrentUser = user.id === currentUser?.id;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`glass-card p-2 sm:p-3 transition-all ${
                  isCurrentUser
                    ? "border-2 border-[#7c3aed] bg-[#7c3aed]/10"
                    : "border border-white/5"
                } ${getRankColor(index)}`}
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Rank */}
                  <div className="w-8 sm:w-10 flex-shrink-0 text-center">
                    <div className="text-lg sm:text-xl">
                      {getRankBadge(index)}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-xl bg-white/5 border border-white/10">
                      {user.avatar || "🧠"}
                    </div>
                  </div>

                  {/* Name and Stats */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCurrentUser ? "text-[#a78bfa]" : "text-white"
                        }`}
                      >
                        {user.displayName}
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
                        {user.totalPoints || 0} pts
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {user.totalQuizzes || 0}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {user.streak || 0}
                      </span>
                    </div>
                  </div>

                  {/* Score/Value based on filter */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xs sm:text-sm font-bold text-white">
                      {filter === "quizzes" && (user.totalQuizzes || 0)}
                      {filter === "streak" && (user.streak || 0)}
                      {filter === "points" && (user.totalPoints || 0)}
                    </div>
                    <div className="text-[8px] sm:text-[10px] text-gray-500">
                      {filter === "quizzes" && "quizzes"}
                      {filter === "streak" && "days"}
                      {filter === "points" && "pts"}
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
            {filteredUsers.length > 0
              ? filteredUsers[0]?.displayName || "Anonymous"
              : "-"}
          </div>
        </div>
        <div className="glass-card p-2 text-center">
          <div className="text-xs text-gray-400">Total Players</div>
          <div className="text-sm font-bold text-white">
            {filteredUsers.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
