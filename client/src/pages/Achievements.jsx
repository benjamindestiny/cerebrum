import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Award,
  Medal,
  Star,
  Zap,
  Brain,
  BookOpen,
  Puzzle,
  Flame,
  Target,
  Crown,
  CheckCircle,
  Lock,
  Loader2,
  Sparkles,
  PartyPopper,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  ArrowLeft,
  Gift,
  Rocket,
  Shield,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../services/supabase";

const Achievements = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    bestScore: 0,
    averageScore: 0,
    totalPoints: 0,
    streak: 0,
    riddlesSolved: 0,
    readArticles: 0,
    totalTime: 0,
    perfectScores: 0,
  });
  const [recentAchievements, setRecentAchievements] = useState([]);

  // All achievements with requirements
  const allAchievements = [
    // Quiz Achievements
    {
      id: "first_quiz",
      title: "First Steps",
      description: "Complete your first quiz",
      icon: "🌱",
      category: "Quiz",
      points: 10,
      requirement: (stats) => stats.totalQuizzes >= 1,
      getProgress: (stats) => Math.min(stats.totalQuizzes, 1),
      maxProgress: 1,
      color: " ",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      id: "quiz_5",
      title: "Quiz Enthusiast",
      description: "Complete 5 quizzes",
      icon: "📚",
      category: "Quiz",
      points: 25,
      requirement: (stats) => stats.totalQuizzes >= 5,
      getProgress: (stats) => Math.min(stats.totalQuizzes, 5),
      maxProgress: 5,
      color: " ",
      bgColor: "",
      borderColor: "border-blue-500/30",
    },
    {
      id: "quiz_10",
      title: "Quiz Master",
      description: "Complete 10 quizzes",
      icon: "🎯",
      category: "Quiz",
      points: 50,
      requirement: (stats) => stats.totalQuizzes >= 10,
      getProgress: (stats) => Math.min(stats.totalQuizzes, 10),
      maxProgress: 10,
      color: " ",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      id: "quiz_25",
      title: "Quiz Legend",
      description: "Complete 25 quizzes",
      icon: "🏆",
      category: "Quiz",
      points: 100,
      requirement: (stats) => stats.totalQuizzes >= 25,
      getProgress: (stats) => Math.min(stats.totalQuizzes, 25),
      maxProgress: 25,
      color: " ",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/30",
    },
    // Score Achievements
    {
      id: "perfect_score",
      title: "Perfect Score!",
      description: "Score 100% on a quiz",
      icon: "⭐",
      category: "Score",
      points: 50,
      requirement: (stats) => stats.perfectScores >= 1,
      getProgress: (stats) => Math.min(stats.perfectScores, 1),
      maxProgress: 1,
      color: " ",
      bgColor: "bg-teal-400/10",
      borderColor: "border-teal-400/30",
    },
    {
      id: "perfect_5",
      title: "Perfect Streak",
      description: "Get 5 perfect scores",
      icon: "🌟",
      category: "Score",
      points: 75,
      requirement: (stats) => stats.perfectScores >= 5,
      getProgress: (stats) => Math.min(stats.perfectScores, 5),
      maxProgress: 5,
      color: " ",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/30",
    },
    {
      id: "score_90",
      title: "Top Performer",
      description: "Score 90% or higher on a quiz",
      icon: "🎯",
      category: "Score",
      points: 30,
      requirement: (stats) => stats.bestScore >= 90,
      getProgress: (stats) => Math.min(stats.bestScore, 100),
      maxProgress: 100,
      color: " ",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/30",
    },
    {
      id: "score_80",
      title: "Knowledge Seeker",
      description: "Score 80% or higher on a quiz",
      icon: "📖",
      category: "Score",
      points: 20,
      requirement: (stats) => stats.bestScore >= 80,
      getProgress: (stats) => Math.min(stats.bestScore, 100),
      maxProgress: 100,
      color: " ",
      bgColor: "bg-blue-400/10",
      borderColor: "border-[#3B82F6CC]/30",
    },
    // Streak Achievements
    {
      id: "streak_3",
      title: "Getting Started",
      description: "Maintain a 3-day streak",
      icon: "🔥",
      category: "Streak",
      points: 15,
      requirement: (stats) => stats.streak >= 3,
      getProgress: (stats) => Math.min(stats.streak, 3),
      maxProgress: 3,
      color: " ",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/30",
    },
    {
      id: "streak_7",
      title: "On Fire!",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      category: "Streak",
      points: 50,
      requirement: (stats) => stats.streak >= 7,
      getProgress: (stats) => Math.min(stats.streak, 7),
      maxProgress: 7,
      color: " ",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      id: "streak_30",
      title: "Unstoppable!",
      description: "Maintain a 30-day streak",
      icon: "⚡",
      category: "Streak",
      points: 150,
      requirement: (stats) => stats.streak >= 30,
      getProgress: (stats) => Math.min(stats.streak, 30),
      maxProgress: 30,
      color: " ",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    // Riddle Achievements
    {
      id: "riddle_1",
      title: "Riddle Solver",
      description: "Solve your first riddle",
      icon: "🧩",
      category: "Riddles",
      points: 10,
      requirement: (stats) => stats.riddlesSolved >= 1,
      getProgress: (stats) => Math.min(stats.riddlesSolved, 1),
      maxProgress: 1,
      color: " ",
      bgColor: "bg-indigo-400/10",
      borderColor: "border-indigo-400/30",
    },
    {
      id: "riddle_10",
      title: "Riddle Master",
      description: "Solve 10 riddles",
      icon: "🧠",
      category: "Riddles",
      points: 40,
      requirement: (stats) => stats.riddlesSolved >= 10,
      getProgress: (stats) => Math.min(stats.riddlesSolved, 10),
      maxProgress: 10,
      color: " ",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      id: "riddle_25",
      title: "Riddle Legend",
      description: "Solve 25 riddles",
      icon: "🏅",
      category: "Riddles",
      points: 80,
      requirement: (stats) => stats.riddlesSolved >= 25,
      getProgress: (stats) => Math.min(stats.riddlesSolved, 25),
      maxProgress: 25,
      color: " ",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/30",
    },
    // Reading Achievements
    {
      id: "read_1",
      title: "Bookworm",
      description: "Read your first article",
      icon: "📖",
      category: "Reading",
      points: 10,
      requirement: (stats) => stats.readArticles >= 1,
      getProgress: (stats) => Math.min(stats.readArticles, 1),
      maxProgress: 1,
      color: " ",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/30",
    },
    {
      id: "read_10",
      title: "Scholar",
      description: "Read 10 articles",
      icon: "📚",
      category: "Reading",
      points: 50,
      requirement: (stats) => stats.readArticles >= 10,
      getProgress: (stats) => Math.min(stats.readArticles, 10),
      maxProgress: 10,
      color: " ",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    // Points Achievements
    {
      id: "points_100",
      title: "Points Collector",
      description: "Earn 100 total points",
      icon: "💎",
      category: "Points",
      points: 20,
      requirement: (stats) => stats.totalPoints >= 100,
      getProgress: (stats) => Math.min(stats.totalPoints, 100),
      maxProgress: 100,
      color: " ",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400/30",
    },
    {
      id: "points_500",
      title: "Points Hunter",
      description: "Earn 500 total points",
      icon: "💎",
      category: "Points",
      points: 75,
      requirement: (stats) => stats.totalPoints >= 500,
      getProgress: (stats) => Math.min(stats.totalPoints, 500),
      maxProgress: 500,
      color: " ",
      bgColor: "",
      borderColor: "border-blue-500/30",
    },
    {
      id: "points_1000",
      title: "Points Champion",
      description: "Earn 1,000 total points",
      icon: "🏆",
      category: "Points",
      points: 150,
      requirement: (stats) => stats.totalPoints >= 1000,
      getProgress: (stats) => Math.min(stats.totalPoints, 1000),
      maxProgress: 1000,
      color: " ",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30",
    },
    // Special Achievements
    {
      id: "time_1hour",
      title: "Dedicated Learner",
      description: "Spend 1 hour total learning",
      icon: "⏰",
      category: "Special",
      points: 25,
      requirement: (stats) => stats.totalTime >= 3600,
      getProgress: (stats) => Math.min(stats.totalTime, 3600),
      maxProgress: 3600,
      color: " ",
      bgColor: "bg-rose-400/10",
      borderColor: "border-rose-400/30",
    },
    {
      id: "diversity",
      title: "Diverse Learner",
      description: "Complete quizzes in 3 different categories",
      icon: "🌈",
      category: "Special",
      points: 30,
      requirement: (stats) => stats.totalQuizzes >= 3,
      getProgress: (stats) => Math.min(stats.totalQuizzes, 3),
      maxProgress: 3,
      color: " ",
      bgColor: "bg-fuchsia-400/10",
      borderColor: "border-fuchsia-400/30",
    },
  ];

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("stats")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching stats:", profileError);
      }

      const statsData = profileData?.stats || {};
      const mappedStats = {
        totalQuizzes: statsData.total_quizzes || 0,
        bestScore: statsData.best_score || 0,
        averageScore: statsData.average_score || 0,
        totalPoints: statsData.total_points || 0,
        streak: statsData.streak || 0,
        riddlesSolved: statsData.riddles_solved || 0,
        readArticles: statsData.read_articles || 0,
        totalTime: statsData.total_time || 0,
        perfectScores: statsData.perfect_scores || 0,
      };

      setStats(mappedStats);
      updateAchievements(mappedStats);
    } catch (error) {
      console.error("Error loading achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAchievements = (statsData) => {
    const earned = allAchievements.filter((a) => a.requirement(statsData));
    setRecentAchievements(earned.slice(0, 5));
  };

  const refreshAchievements = async () => {
    setRefreshing(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("stats")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching stats:", profileError);
      }

      const statsData = profileData?.stats || {};
      const mappedStats = {
        totalQuizzes: statsData.total_quizzes || 0,
        bestScore: statsData.best_score || 0,
        averageScore: statsData.average_score || 0,
        totalPoints: statsData.total_points || 0,
        streak: statsData.streak || 0,
        riddlesSolved: statsData.riddles_solved || 0,
        readArticles: statsData.read_articles || 0,
        totalTime: statsData.total_time || 0,
        perfectScores: statsData.perfect_scores || 0,
      };

      setStats(mappedStats);
      updateAchievements(mappedStats);
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const calculateProgress = (achievement) => {
    const current = achievement.getProgress(stats);
    const max = achievement.maxProgress;
    return Math.min((current / max) * 100, 100);
  };

  const getProgressText = (achievement) => {
    const current = achievement.getProgress(stats);
    const max = achievement.maxProgress;
    if (achievement.requirement(stats)) {
      return "✅ Completed!";
    }
    return `${Math.min(current, max)} / ${max}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Quiz: "🎯",
      Score: "⭐",
      Streak: "🔥",
      Riddles: "🧩",
      Reading: "📖",
      Points: "💎",
      Special: "🌟",
    };
    return icons[category] || "🏆";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Quiz: "text-[#3B82F6CC]",
      Score: "text-teal-400",
      Streak: "text-orange-400",
      Riddles: "text-purple-400",
      Reading: "text-green-400",
      Points: "text-cyan-400",
      Special: "text-pink-400",
    };
    return colors[category] || "text-gray-400";
  };

  const earnedCount = allAchievements.filter((a) => a.requirement(stats)).length;
  const totalAchievements = allAchievements.length;
  const totalPoints = allAchievements
    .filter((a) => a.requirement(stats))
    .reduce((sum, a) => sum + a.points, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] px-4  text-white border-[#2A2A4A]">
        <div className="text-center  text-white border-[#2A2A4A]">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 animate-spin mx-auto mb-3  text-white border-[#2A2A4A]" />
          <p className="text-gray-400 text-sm  text-white border-[#2A2A4A]">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12  text-white border-[#2A2A4A]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4  text-white border-[#2A2A4A]">
        <div className="flex items-center gap-2 sm:gap-4  text-white border-[#2A2A4A]">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 sm:p-2 rounded-lg /5 transition-colors  text-white border-[#2A2A4A]"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400  text-white border-[#2A2A4A]" />
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3  text-white border-[#2A2A4A]">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-400  text-white border-[#2A2A4A]" />
            Achievements
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3  text-white border-[#2A2A4A]">
          <button
            onClick={refreshAchievements}
            disabled={refreshing}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-700 text-white rounded-lg  transition-colors text-xs sm:text-sm flex items-center gap-2  text-white border-[#2A2A4A]"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2  text-white border-[#2A2A4A]">
            <Star className="w-4 h-4 text-teal-400  text-white border-[#2A2A4A]" />
            <span className="text-xs sm:text-sm text-white  text-white border-[#2A2A4A]">
              {earnedCount}/{totalAchievements}
            </span>
          </div>
          <div className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2  text-white border-[#2A2A4A]">
            <Sparkles className="w-4 h-4 text-blue-400  text-white border-[#2A2A4A]" />
            <span className="text-xs sm:text-sm text-white  text-white border-[#2A2A4A]">
              {totalPoints} pts
            </span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4  text-white border-[#2A2A4A]">
        <div className="glass-card p-3 sm:p-4 text-center  text-white border-[#2A2A4A]">
          <div className="text-lg sm:text-xl font-bold text-white  text-white border-[#2A2A4A]">{stats.totalQuizzes}</div>
          <div className="text-[10px] sm:text-xs text-gray-400  text-white border-[#2A2A4A]">Quizzes Taken</div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center  text-white border-[#2A2A4A]">
          <div className="text-lg sm:text-xl font-bold text-teal-400  text-white border-[#2A2A4A]">{stats.bestScore}%</div>
          <div className="text-[10px] sm:text-xs text-gray-400  text-white border-[#2A2A4A]">Best Score</div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center  text-white border-[#2A2A4A]">
          <div className="text-lg sm:text-xl font-bold text-orange-400  text-white border-[#2A2A4A]">{stats.streak}</div>
          <div className="text-[10px] sm:text-xs text-gray-400  text-white border-[#2A2A4A]">Day Streak</div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center  text-white border-[#2A2A4A]">
          <div className="text-lg sm:text-xl font-bold text-blue-400  text-white border-[#2A2A4A]">{stats.totalPoints}</div>
          <div className="text-[10px] sm:text-xs text-gray-400  text-white border-[#2A2A4A]">Total Points</div>
        </div>
      </div>

      {/* Achievement Categories */}
      {["Quiz", "Score", "Streak", "Riddles", "Reading", "Points", "Special"].map((category) => {
        const categoryAchievements = allAchievements.filter((a) => a.category === category);
        const earnedInCategory = categoryAchievements.filter((a) => a.requirement(stats)).length;

        if (categoryAchievements.length === 0) return null;

        return (
          <div key={category} className="space-y-3 sm:space-y-4  text-white border-[#2A2A4A]">
            <div className="flex items-center gap-2  text-white border-[#2A2A4A]">
              <span className="text-lg sm:text-xl  text-white border-[#2A2A4A]">{getCategoryIcon(category)}</span>
              <h2 className={`text-base sm:text-lg font-bold ${getCategoryColor(category)}`}>
                {category}
              </h2>
              <span className="text-xs text-gray-500  text-white border-[#2A2A4A]">
                ({earnedInCategory}/{categoryAchievements.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4  text-white border-[#2A2A4A]">
              {categoryAchievements.map((achievement) => {
                const isEarned = achievement.requirement(stats);
                const progress = calculateProgress(achievement);
                const progressText = getProgressText(achievement);

                return (
                  <div
                    key={achievement.id}
                    
                    
                    
                    className={`glass-card p-4 sm:p-5 transition-all  ${
                      isEarned
                        ? `border ${achievement.borderColor} ${achievement.bgColor}`
                        : "border border-white/5 opacity-70"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4  text-white border-[#2A2A4A]">
                      <div className={`text-2xl sm:text-3xl ${isEarned ? "" : "opacity-50"}`}>
                        {isEarned ? achievement.icon : "🔒"}
                      </div>
                      <div className="flex-1 min-w-0  text-white border-[#2A2A4A]">
                        <div className="flex items-center gap-2 flex-wrap  text-white border-[#2A2A4A]">
                          <h3 className={`text-sm sm:text-base font-semibold ${isEarned ? "text-white" : "text-gray-400"}`}>
                            {achievement.title}
                          </h3>
                          {isEarned && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0  text-white border-[#2A2A4A]" />}
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5  text-white border-[#2A2A4A]">
                          {achievement.description}
                        </p>
                        <div className="mt-2  text-white border-[#2A2A4A]">
                          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500  text-white border-[#2A2A4A]">
                            <span>{isEarned ? "✅ Completed!" : progressText}</span>
                            <span className="text-blue-400  text-white border-[#2A2A4A]">+{achievement.points} pts</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1  text-white border-[#2A2A4A]">
                            <div
                              
                              animate={{ width: `${progress}%` }}
                              
                              className={`h-full rounded-full ${
                                isEarned
                                  ? "  "
                                  : "  "
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* No Achievements Yet */}
      {earnedCount === 0 && (
        <div className="glass-card p-8 sm:p-12 text-center  text-white border-[#2A2A4A]">
          <div className="flex flex-col items-center gap-3 sm:gap-4  text-white border-[#2A2A4A]">
            <div className="text-5xl sm:text-6xl  text-white border-[#2A2A4A]">🏆</div>
            <h3 className="text-lg sm:text-xl font-bold text-white  text-white border-[#2A2A4A]">No Achievements Yet</h3>
            <p className="text-gray-400 text-sm sm:text-base max-w-md  text-white border-[#2A2A4A]">
              Start taking quizzes, solving riddles, and reading articles to earn your first achievement!
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="btn-primary mt-2 text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2  text-white border-[#2A2A4A]"
            >
              Start Learning
            </button>
          </div>
        </div>
      )}

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="glass-card p-4 sm:p-5 md:p-6 border border-teal-400/20 bg-teal-400/5  text-white border-[#2A2A4A]">
          <h3 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2  text-white border-[#2A2A4A]">
            <Sparkles className="w-4 h-4 text-teal-400  text-white border-[#2A2A4A]" />
            Recently Earned
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3  text-white border-[#2A2A4A]">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${achievement.bgColor} border ${achievement.borderColor}`}
              >
                <span className="text-sm sm:text-base  text-white border-[#2A2A4A]">{achievement.icon}</span>
                <span className="text-xs sm:text-sm text-white  text-white border-[#2A2A4A]">{achievement.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Stats */}
      <div className="glass-card p-4 sm:p-5 md:p-6  text-white border-[#2A2A4A]">
        <h3 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2  text-white border-[#2A2A4A]">
          <TrendingUp className="w-4 h-4 text-blue-400  text-white border-[#2A2A4A]" />
          Achievement Progress
        </h3>
        <div className="space-y-2 sm:space-y-3  text-white border-[#2A2A4A]">
          <div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-400  text-white border-[#2A2A4A]">
              <span>Overall Progress</span>
              <span>{Math.round((earnedCount / totalAchievements) * 100)}%</span>
            </div>
            <div className="w-full h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden mt-1  text-white border-[#2A2A4A]">
              <div
                
                animate={{ width: `${(earnedCount / totalAchievements) * 100}%` }}
                
                className="h-full    rounded-full  text-white border-[#2A2A4A]"
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-2 text-xs text-gray-500  text-white border-[#2A2A4A]">
            <span>🏆 {earnedCount} / {totalAchievements} unlocked</span>
            <span>⭐ {totalPoints} points earned from achievements</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;