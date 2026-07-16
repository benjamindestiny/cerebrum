import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmail, emailTemplates } from "../services/emailService";
import DailyMissions from "../components/Common/DailyMissions";
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
  Mail,
  Sparkles,
  Loader2,
  ChevronRight,
  Puzzle,
  Play,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import EmailSubscribe from "../components/Email/EmailSubscribe";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

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

  const loadDashboardData = useCallback(async () => {
    if (!currentUser) return;

    setLoadingStats(true);
    try {
      console.log("📊 Loading dashboard for user:", currentUser.id);

      const { data: quizResults, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching:", error);
        setLoadingStats(false);
        return;
      }

      console.log(`📊 Found ${quizResults?.length || 0} quiz results`);

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

      const newStats = {
        totalQuizzes,
        totalPoints,
        averageScore,
        streak,
        bestScore,
        perfectScores,
      };

      console.log("📊 Stats calculated:", newStats);
      setStats(newStats);
      setRecentActivity(quizResults.slice(0, 5));
    } catch (error) {
      console.error("❌ Error loading dashboard:", error);
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
    setRefreshing(false);
  };

  // Public Dashboard
  if (!currentUser && !loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 px-3 sm:px-4 pb-12">
        <div className="glass-card p-6 sm:p-8 md:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-[#7c3aed]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4">
              Welcome to <span className="text-[#7c3aed]">Cerebrum</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-2">
              Challenge your mind with interactive quizzes, riddles, and brain
              teasers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <button
                onClick={() => navigate("/auth")}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4 inline" />
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
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

  // ✅ FIX: DailyMissions component is now properly inside the return
  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12">
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
                ? `🔥 ${stats.streak}-day learning streak!`
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
              className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Start Learning
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Daily Missions Component */}
      <DailyMissions
        userId={currentUser?.id}
        onMissionComplete={(data) => {
          console.log("Mission complete!", data);
          loadDashboardData();
        }}
      />


      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-3 sm:p-4 text-center">
          <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {stats.totalPoints}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">
            Total Points
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {stats.streak}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">Day Streak</div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <Brain className="w-5 h-5 text-[#7c3aed] mx-auto mb-1" />
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {stats.totalQuizzes}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">
            Quizzes Taken
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {stats.averageScore}%
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">Avg Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => navigate("/categories")}
          className="glass-card p-3 sm:p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#7c3aed]/20 transition-all">
            <Play className="w-5 h-5 text-[#7c3aed]" />
          </div>
          <span className="text-white text-sm font-medium">Take Quiz</span>
          <p className="text-gray-400 text-xs">Test your knowledge</p>
        </button>
        <button
          onClick={() => navigate("/riddles")}
          className="glass-card p-3 sm:p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-400/20 transition-all">
            <Puzzle className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-white text-sm font-medium">Riddles</span>
          <p className="text-gray-400 text-xs">Solve brain teasers</p>
        </button>
        <button
          onClick={() => navigate("/read-and-test")}
          className="glass-card p-3 sm:p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-green-400/20 transition-all">
            <BookOpen className="w-5 h-5 text-green-400" />
          </div>
          <span className="text-white text-sm font-medium">Read & Test</span>
          <p className="text-gray-400 text-xs">Learn and quiz</p>
        </button>
        <button
          onClick={() => navigate("/leaderboard")}
          className="glass-card p-3 sm:p-4 text-center hover:border-[#7c3aed]/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-yellow-400/20 transition-all">
            <Users className="w-5 h-5 text-yellow-400" />
          </div>
          <span className="text-white text-sm font-medium">Leaderboard</span>
          <p className="text-gray-400 text-xs">See top players</p>
        </button>
      </div>

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

      <div className="glass-card p-4 sm:p-6 border border-[#7c3aed]/20 bg-[#7c3aed]/5">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
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
