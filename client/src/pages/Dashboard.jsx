import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Brain,
  Zap,
  Target,
  BookOpen,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Flame,
  Star,
  Sparkles,
  Loader2,
  ChevronRight,
  UserCircle,
  BarChart3,
  Puzzle,
  Play,
  Settings,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, loading } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalPoints: 0,
    averageScore: 0,
    streak: 0,
    bestScore: 0,
    riddlesSolved: 0,
    readArticles: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!currentUser);
      if (currentUser) {
        loadUserStats();
        loadRecentActivity();
      }
    }
  }, [currentUser, loading]);

  const loadUserStats = async () => {
    try {
      if (userProfile?.stats) {
        const statsData = userProfile.stats;
        setStats({
          totalQuizzes: statsData.total_quizzes || 0,
          totalPoints: statsData.total_points || 0,
          averageScore: statsData.average_score || 0,
          streak: statsData.streak || 0,
          bestScore: statsData.best_score || 0,
          riddlesSolved: statsData.riddles_solved || 0,
          readArticles: statsData.read_articles || 0,
        });
      } else {
        // Fetch from users table
        const { data, error } = await supabase
          .from("users")
          .select("stats")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (!error && data?.stats) {
          const statsData = data.stats;
          setStats({
            totalQuizzes: statsData.total_quizzes || 0,
            totalPoints: statsData.total_points || 0,
            averageScore: statsData.average_score || 0,
            streak: statsData.streak || 0,
            bestScore: statsData.best_score || 0,
            riddlesSolved: statsData.riddles_solved || 0,
            readArticles: statsData.read_articles || 0,
          });
        }
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setRecentActivity(data);
      }
    } catch (error) {
      console.error("Error loading recent activity:", error);
    }
  };

  // Public Dashboard - For non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 px-3 sm:px-4 pb-12">
        {/* Hero Section */}
        <div className="glass-card p-6 sm:p-8 md:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
                <Brain className="w-10 h-10 text-[#7c3aed]" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Welcome to <span className="text-[#7c3aed]">Cerebrum</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Challenge your mind with interactive quizzes, riddles, and brain
              teasers. Sign up to track your progress and compete with others!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => navigate("/auth")}
                className="px-6 py-3 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Browse Quizzes
              </button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center hover:border-[#7c3aed]/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-blue-400/10 flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold">Interactive Quizzes</h3>
            <p className="text-gray-400 text-sm mt-1">
              Test your knowledge across various subjects
            </p>
          </div>
          <div className="glass-card p-6 text-center hover:border-[#7c3aed]/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-purple-400/10 flex items-center justify-center mx-auto mb-3">
              <Puzzle className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold">Brain Teasers</h3>
            <p className="text-gray-400 text-sm mt-1">
              Solve challenging riddles and puzzles
            </p>
          </div>
          <div className="glass-card p-6 text-center hover:border-[#7c3aed]/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold">Track Progress</h3>
            <p className="text-gray-400 text-sm mt-1">
              Monitor your scores and achievements
            </p>
          </div>
        </div>

        {/* Public Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-[#7c3aed]">50+</div>
            <div className="text-xs text-gray-400">Quizzes Available</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">100+</div>
            <div className="text-xs text-gray-400">Riddles</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-green-400">10+</div>
            <div className="text-xs text-gray-400">Categories</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">500+</div>
            <div className="text-xs text-gray-400">Active Users</div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="max-w-6xl mx-auto space-y-6 px-3 sm:px-4 pb-12">
      {/* Welcome Header */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back,{" "}
              <span className="text-[#7c3aed]">
                {currentUser?.user_metadata?.name || "Learner"}! 👋
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {stats.streak > 0
                ? `🔥 You're on a ${stats.streak}-day learning streak!`
                : "Ready to learn something new today?"}
            </p>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <Play className="w-4 h-4" />
            Start Learning
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {stats.totalPoints || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">
            Total Points
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-400">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {stats.streak || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">Day Streak</div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-[#7c3aed]">
            <Brain className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {stats.totalQuizzes || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">
            Quizzes Taken
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-green-400">
            <Target className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {stats.averageScore || 0}%
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">Avg Score</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => navigate("/categories")}
          className="glass-card p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#7c3aed]/20 transition-all">
            <Play className="w-5 h-5 text-[#7c3aed]" />
          </div>
          <span className="text-white text-sm font-medium">Take Quiz</span>
          <p className="text-gray-400 text-xs">Test your knowledge</p>
        </button>
        <button
          onClick={() => navigate("/riddles")}
          className="glass-card p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-400/20 transition-all">
            <Puzzle className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-white text-sm font-medium">Riddles</span>
          <p className="text-gray-400 text-xs">Solve brain teasers</p>
        </button>
        <button
          onClick={() => navigate("/read-and-test")}
          className="glass-card p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-green-400/20 transition-all">
            <BookOpen className="w-5 h-5 text-green-400" />
          </div>
          <span className="text-white text-sm font-medium">Read & Test</span>
          <p className="text-gray-400 text-xs">Learn and quiz</p>
        </button>
        <button
          onClick={() => navigate("/leaderboard")}
          className="glass-card p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-yellow-400/20 transition-all">
            <Users className="w-5 h-5 text-yellow-400" />
          </div>
          <span className="text-white text-sm font-medium">Leaderboard</span>
          <p className="text-gray-400 text-xs">See top players</p>
        </button>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="glass-card p-4 sm:p-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4 text-gray-400" />
            Recent Activity
          </h3>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#7c3aed]"></div>
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

      {/* Recommendation */}
      <div className="glass-card p-4 sm:p-6 border border-[#7c3aed]/20 bg-[#7c3aed]/5">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Daily Challenge
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Complete a quiz today to maintain your streak!
            </p>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm flex items-center gap-2"
          >
            Take Challenge
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
