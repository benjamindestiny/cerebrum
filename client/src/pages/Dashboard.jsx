import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Brain,
  Zap,
  Target,
  BookOpen,
  Users,
  Clock,
  ArrowRight,
  Award,
  Flame,
  Star,
  Sparkles,
  Loader2,
  ChevronRight,
  Puzzle,
  Play,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, loading } = useAuth();

  // Simple, flat state
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalPoints: 0,
    averageScore: 0,
    streak: 0,
    bestScore: 0,
    riddlesSolved: 0,
    readArticles: 0,
    perfectScores: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [renderKey, setRenderKey] = useState(Date.now());

  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!currentUser);
      if (currentUser) {
        console.log("🔄 Loading dashboard for user:", currentUser.id);
        loadDashboardData();
      }
    }
  }, [currentUser, loading, location.key]);

  const loadDashboardData = async () => {
    try {
      setLoadingStats(true);
      await loadUserStats();
      await loadRecentActivity();
      // Force re-render
      setRenderKey(Date.now());
      console.log("✅ Dashboard updated at:", new Date().toISOString());
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadUserStats = async () => {
    try {
      if (!currentUser) {
        console.log("⚠️ No current user");
        return;
      }

      console.log("📊 Fetching quiz results for user:", currentUser.id);

      // First, check if the user has any quiz results
      const { data: checkData, error: checkError } = await supabase
        .from("quiz_results")
        .select("id")
        .eq("user_id", currentUser.id)
        .limit(1);

      console.log("📊 Check data:", checkData);

      if (checkError) {
        console.error("❌ Check error:", checkError);
        setLoadingStats(false);
        return;
      }

      if (!checkData || checkData.length === 0) {
        console.log("📊 No quiz results found, setting stats to 0");
        setStats({
          totalQuizzes: 0,
          totalPoints: 0,
          averageScore: 0,
          streak: 0,
          bestScore: 0,
          riddlesSolved: 0,
          readArticles: 0,
          perfectScores: 0,
        });
        setLoadingStats(false);
        return;
      }

      // Get all quiz results
      const { data: quizResults, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ Error fetching:", error);
        setLoadingStats(false);
        return;
      }

      console.log("📊 Raw quiz data:", quizResults);

      if (!quizResults || quizResults.length === 0) {
        setStats({
          totalQuizzes: 0,
          totalPoints: 0,
          averageScore: 0,
          streak: 0,
          bestScore: 0,
          riddlesSolved: 0,
          readArticles: 0,
          perfectScores: 0,
        });
        setLoadingStats(false);
        return;
      }

      // Calculate stats
      let totalQuizzes = quizResults.length;
      let totalPoints = 0;
      let totalScore = 0;
      let bestScore = 0;
      let perfectScores = 0;
      let streak = 0;

      // Process each quiz
      quizResults.forEach((quiz) => {
        // Calculate percentage
        let percentage = parseFloat(quiz.percentage) || 0;
        if (percentage === 0 && quiz.score && quiz.total_questions) {
          percentage = Math.round((quiz.score / quiz.total_questions) * 100);
        }
        if (percentage === 0 && quiz.score) {
          percentage = Math.round(quiz.score);
        }

        // Add to totals
        totalScore += percentage;
        const points = quiz.points || Math.floor(percentage / 10) || 0;
        totalPoints += points;
        bestScore = Math.max(bestScore, percentage);
        if (percentage === 100) perfectScores++;
      });

      // Calculate average
      const averageScore = Math.round(totalScore / totalQuizzes);

      // Calculate streak (consecutive days)
      const dates = quizResults
        .map((q) => new Date(q.created_at).toISOString().split("T")[0])
        .sort();
      const uniqueDates = [...new Set(dates)].sort();

      console.log("📊 Unique dates:", uniqueDates);

      if (uniqueDates.length > 0) {
        const today = new Date().toISOString().split("T")[0];
        const lastDate = uniqueDates[uniqueDates.length - 1];

        // Check if last quiz was today or yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastDate === today || lastDate === yesterdayStr) {
          streak = 1;
          // Count backward
          let currentDate = new Date(lastDate);
          for (let i = uniqueDates.length - 2; i >= 0; i--) {
            const prevDate = new Date(uniqueDates[i]);
            const diffDays = Math.floor(
              (currentDate - prevDate) / (1000 * 60 * 60 * 24),
            );
            if (diffDays === 1) {
              streak++;
              currentDate = prevDate;
            } else {
              break;
            }
          }
        }
      }

      // Get riddles solved count (if table exists)
      let riddlesSolved = 0;
      try {
        const { data: riddlesData } = await supabase
          .from("riddle_history")
          .select("*")
          .eq("user_id", currentUser.id);
        riddlesSolved = riddlesData?.length || 0;
      } catch (e) {
        console.log("⚠️ Riddle history table not found");
      }

      // Get articles read count (if table exists)
      let readArticles = 0;
      try {
        const { data: articlesData } = await supabase
          .from("article_history")
          .select("*")
          .eq("user_id", currentUser.id);
        readArticles = articlesData?.length || 0;
      } catch (e) {
        console.log("⚠️ Article history table not found");
      }

      console.log("📊 Calculated stats:", {
        totalQuizzes,
        totalPoints,
        averageScore,
        streak,
        bestScore,
        perfectScores,
        riddlesSolved,
        readArticles,
      });

      // Update stats state
      const newStats = {
        totalQuizzes,
        totalPoints,
        averageScore,
        streak,
        bestScore,
        perfectScores,
        riddlesSolved,
        readArticles,
      };
      setStats(newStats);

      // Update users table
      try {
        const updatedStats = {
          total_quizzes: totalQuizzes,
          total_points: totalPoints,
          average_score: averageScore,
          streak: streak,
          best_score: bestScore,
          perfect_scores: perfectScores,
          riddles_solved: riddlesSolved,
          read_articles: readArticles,
          last_quiz_date: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from("users")
          .update({
            stats: updatedStats,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentUser.id);

        if (updateError) {
          console.error("❌ Error updating user stats:", updateError);
        } else {
          console.log("✅ User stats updated in database");
        }
      } catch (updateError) {
        console.error("❌ Update error:", updateError);
      }
    } catch (error) {
      console.error("❌ Error in loadUserStats:", error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        console.log("📊 Recent activity:", data);
        setRecentActivity(data);
      }
    } catch (error) {
      console.error("❌ Error loading recent activity:", error);
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Public Dashboard
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 px-3 sm:px-4 pb-12">
        <div className="glass-card p-6 sm:p-8 md:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-[#7c3aed]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Welcome to <span className="text-[#7c3aed]">Cerebrum</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Challenge your mind with interactive quizzes, riddles, and brain
              teasers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3 sm:pt-4">
              <button
                onClick={() => navigate("/auth")}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm sm:text-base"
              >
                Browse Quizzes
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loadingStats) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading your stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      key={renderKey}
      className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12"
    >
      {/* Welcome Header */}
      <div className="glass-card p-5 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Welcome back,{" "}
              <span className="text-[#7c3aed]">
                {currentUser?.user_metadata?.name || "Learner"}! 👋
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {stats.streak > 0
                ? `🔥 You're on a ${stats.streak}-day learning streak!`
                : "Ready to learn something new today?"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshDashboard}
              disabled={refreshing}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs sm:text-sm flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={() => navigate("/categories")}
              className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Play className="w-4 h-4" /> Start Learning
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-1">
            {stats.totalPoints}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">
            Total Points
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-400">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-1">
            {stats.streak}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">Day Streak</div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-[#7c3aed]">
            <Brain className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-1">
            {stats.totalQuizzes}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">
            Quizzes Taken
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-green-400">
            <Target className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-1">
            {stats.averageScore}%
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">Avg Score</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => navigate("/categories")}
          className="glass-card p-3 sm:p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-1 sm:mb-2 group-hover:bg-[#7c3aed]/20 transition-all">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 text-[#7c3aed]" />
          </div>
          <span className="text-white text-xs sm:text-sm font-medium">
            Take Quiz
          </span>
          <p className="text-gray-400 text-[10px] sm:text-xs">
            Test your knowledge
          </p>
        </button>
        <button
          onClick={() => navigate("/riddles")}
          className="glass-card p-3 sm:p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-400/10 flex items-center justify-center mx-auto mb-1 sm:mb-2 group-hover:bg-purple-400/20 transition-all">
            <Puzzle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <span className="text-white text-xs sm:text-sm font-medium">
            Riddles
          </span>
          <p className="text-gray-400 text-[10px] sm:text-xs">
            Solve brain teasers
          </p>
        </button>
        <button
          onClick={() => navigate("/read-and-test")}
          className="glass-card p-3 sm:p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-1 sm:mb-2 group-hover:bg-green-400/20 transition-all">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          </div>
          <span className="text-white text-xs sm:text-sm font-medium">
            Read & Test
          </span>
          <p className="text-gray-400 text-[10px] sm:text-xs">Learn and quiz</p>
        </button>
        <button
          onClick={() => navigate("/leaderboard")}
          className="glass-card p-3 sm:p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-400/10 flex items-center justify-center mx-auto mb-1 sm:mb-2 group-hover:bg-yellow-400/20 transition-all">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
          </div>
          <span className="text-white text-xs sm:text-sm font-medium">
            Leaderboard
          </span>
          <p className="text-gray-400 text-[10px] sm:text-xs">
            See top players
          </p>
        </button>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="glass-card p-4 sm:p-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4 text-gray-400" /> Recent Activity
          </h3>
          <div className="space-y-1.5 sm:space-y-2">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#7c3aed]"></div>
                  <span className="text-white text-xs sm:text-sm">
                    {activity.category || "Quiz"}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {activity.percentage || activity.score}%
                  </span>
                </div>
                <span className="text-gray-500 text-[10px] sm:text-xs">
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Challenge */}
      <div className="glass-card p-4 sm:p-6 border border-[#7c3aed]/20 bg-[#7c3aed]/5">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-yellow-400" /> Daily Challenge
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Complete a quiz today to maintain your streak!
            </p>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Take Challenge <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
