import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DailyMissions from "../components/Common/DailyMissions";
import StreakFreeze from "../components/Common/StreakFreeze";
import TestimonialPopup from "../components/Common/TestimonialPopup";
import {
  Trophy,
  Brain,
  Zap,
  Target,
  BookOpen,
  Users,
  Clock,
  ArrowRight,
  Flame,
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
  const { currentUser, loading } = useAuth();
  const [showTestimonial, setShowTestimonial] = useState(false);

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalPoints: 0,
    averageScore: 0,
    streak: 0,
    bestScore: 0,
    perfectScores: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Show testimonial popup after loading
    if (!loading && currentUser) {
      const hasSeen = localStorage.getItem('cerebrum_testimonial_seen');
      if (!hasSeen) {
        setTimeout(() => {
          setShowTestimonial(true);
        }, 3000);
      }
    }
  }, [loading, currentUser]);

  const loadDashboardData = useCallback(async () => {
    if (!currentUser) return;
    setLoadingStats(true);
    try {
      const { data: quizResults, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!quizResults || quizResults.length === 0) {
        setStats({
          totalQuizzes: 0,
          totalPoints: 0,
          averageScore: 0,
          streak: 0,
          bestScore: 0,
          perfectScores: 0,
        });
        setRecentActivity([]);
        setLoadingStats(false);
        return;
      }

      let totalQuizzes = quizResults.length;
      let totalPoints = 0;
      let totalScore = 0;
      let bestScore = 0;
      let perfectScores = 0;

      quizResults.forEach((q) => {
        let pct = parseFloat(q.percentage) || 0;
        if (pct === 0 && q.score && q.total_questions) {
          pct = Math.round((q.score / q.total_questions) * 100);
        }
        totalScore += pct;
        totalPoints += q.points || Math.floor(pct / 10) || 0;
        bestScore = Math.max(bestScore, pct);
        if (pct === 100) perfectScores++;
      });

      const averageScore = Math.round(totalScore / totalQuizzes);

      let streak = 0;
      const dates = quizResults
        .map((q) => new Date(q.created_at).toISOString().split("T")[0])
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();

      if (dates.length > 0) {
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];
        const lastDate = dates[dates.length - 1];

        if (lastDate === today || lastDate === yesterday) {
          streak = 1;
          let current = new Date(lastDate);
          for (let i = dates.length - 2; i >= 0; i--) {
            const prev = new Date(dates[i]);
            const diff = Math.floor((current - prev) / 86400000);
            if (diff === 1) {
              streak++;
              current = prev;
            } else {
              break;
            }
          }
        }
      }

      setStats({
        totalQuizzes,
        totalPoints,
        averageScore,
        streak,
        bestScore,
        perfectScores,
      });
      setRecentActivity(quizResults.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoadingStats(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!loading && currentUser) {
      loadDashboardData();
    }
  }, [currentUser, loading, loadDashboardData]);

  const refreshDashboard = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshTrigger(prev => prev + 1);
    setRefreshing(false);
  };

  if (!currentUser && !loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto space-y-6 px-3 sm:px-4 pb-12"
      >
        <div className="glass-card p-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 20 }}
          >
            <div className="flex justify-center">
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center"
              >
                <Brain className="w-10 h-10 text-[#3B82F6]" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold text-white mt-4">
              Welcome to <span className="text-[#3B82F6]">Cerebrum</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-2">
              Challenge your mind with interactive quizzes, riddles, and brain teasers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")} 
                className="btn-primary"
              >
                Get Started <ArrowRight className="w-4 h-4 inline" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/categories")} 
                className="btn-secondary"
              >
                Browse Quizzes
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-3 sm:px-4 pb-12">
      {/* Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back,{" "}
              <span className="text-[#3B82F6]">
                {currentUser?.user_metadata?.name || "Learner"}! 👋
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {stats.streak > 0
                ? `🔥 ${stats.streak}-day learning streak!`
                : "Ready to learn something new today?"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshDashboard}
              disabled={refreshing}
              className="px-3 py-2 bg-surface-2 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/categories")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Start Learning
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Daily Missions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <DailyMissions
          userId={currentUser?.id}
          onMissionComplete={() => loadDashboardData()}
          refreshTrigger={refreshTrigger}
        />
      </motion.div>

      {/* Streak Freeze */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
      >
        <StreakFreeze 
          userId={currentUser?.id} 
          currentStreak={stats.streak} 
        />
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { icon: Trophy, label: 'Total Points', value: stats.totalPoints, color: 'text-yellow-400' },
          { icon: Flame, label: 'Day Streak', value: stats.streak, color: 'text-orange-400' },
          { icon: Brain, label: 'Quizzes Taken', value: stats.totalQuizzes, color: 'text-[#3B82F6]' },
          { icon: Target, label: 'Avg Score', value: `${stats.averageScore}%`, color: 'text-teal-400' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.08, duration: 0.3 }}
            className="glass-card p-4 text-center"
          >
            <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-1`} />
            <div className="text-2xl font-bold text-white">{item.value}</div>
            <div className="text-xs text-gray-400">{item.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { icon: Play, label: 'Take Quiz', desc: 'Test your knowledge', path: '/categories', color: 'text-[#3B82F6]' },
          { icon: Puzzle, label: 'Riddles', desc: 'Solve brain teasers', path: '/riddles', color: 'text-purple-400' },
          { icon: BookOpen, label: 'Read & Test', desc: 'Learn and quiz', path: '/read-and-test', color: 'text-green-400' },
          { icon: Users, label: 'Leaderboard', desc: 'See top players', path: '/leaderboard', color: 'text-yellow-400' },
        ].map((item, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + index * 0.06, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(item.path)}
            className="glass-card p-4 text-center hover:border-blue-500/30 transition-all"
          >
            <div className={`w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-2`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <span className="text-white font-medium">{item.label}</span>
            <p className="text-gray-400 text-xs">{item.desc}</p>
          </motion.button>
        ))}
      </motion.div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" /> Recent Activity
          </h3>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + index * 0.05, duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-white text-sm">
                    {activity.category || "Quiz"}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {activity.percentage || activity.score}%
                  </span>
                </div>
                <span className="text-gray-500 text-xs">
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Daily Challenge CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="glass-card p-6 border border-blue-500/20 bg-blue-500/5"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </motion.span>
              Daily Challenge
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Complete a quiz today to maintain your streak!
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/categories")}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Take Challenge <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Testimonial Popup */}
      {showTestimonial && (
        <TestimonialPopup
          userId={currentUser?.id}
          userName={currentUser?.user_metadata?.name || "User"}
          onClose={() => {
            setShowTestimonial(false);
            localStorage.setItem('cerebrum_testimonial_seen', 'true');
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
