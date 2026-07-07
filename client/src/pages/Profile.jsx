import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Camera,
  Save,
  ArrowLeft,
  UserCircle,
  Calendar,
  Award,
  Trophy,
  Zap,
  Flame,
  BookOpen,
  CheckCircle,
  Loader2,
  Edit2,
  X,
  AlertCircle,
  LayoutDashboard,
  Settings,
  ChevronRight,
  Star,
  Medal,
  Target,
  Brain,
  Puzzle,
  MapPin,
  Globe,
  Lock,
  LogOut,
  Sparkles,
  List,
  Plus,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";
import AvatarSelector from "../components/Common/AvatarSelector";
import { defaultAvatars, getAvatarById } from "../data/avatars";

// Predefined bios
const PREDEFINED_BIOS = [
  { id: 1, text: "🧠 Brain enthusiast | Quiz lover", emoji: "🧠" },
  { id: 2, text: "📚 Forever learning | Knowledge seeker", emoji: "📚" },
  { id: 3, text: "🎯 Trivia master in the making", emoji: "🎯" },
  { id: 4, text: "🧩 Curious mind | Puzzle solver", emoji: "🧩" },
  { id: 5, text: "🌟 Exploring the world of knowledge", emoji: "🌟" },
  { id: 6, text: "💡 Lifelong learner | Quiz challenger", emoji: "💡" },
  { id: 7, text: "🎮 Gaming my way through quizzes", emoji: "🎮" },
  { id: 8, text: "📖 Page turner | Fact collector", emoji: "📖" },
  { id: 9, text: "🚀 Knowledge adventurer", emoji: "🚀" },
  { id: 10, text: "🎓 Always learning, always growing", emoji: "🎓" },
];

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: "first_quiz",
    name: "First Quiz",
    description: "Completed your first quiz",
    icon: "🎯",
    check: (stats) => stats.totalQuizzes >= 1,
  },
  {
    id: "quiz_enthusiast",
    name: "Quiz Enthusiast",
    description: "Completed 10+ quizzes",
    icon: "📚",
    check: (stats) => stats.totalQuizzes >= 10,
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Completed 50+ quizzes",
    icon: "👑",
    check: (stats) => stats.totalQuizzes >= 50,
  },
  {
    id: "quiz_legend",
    name: "Quiz Legend",
    description: "Completed 100+ quizzes",
    icon: "🏆",
    check: (stats) => stats.totalQuizzes >= 100,
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Scored 100% on a quiz",
    icon: "⭐",
    check: (stats) => stats.bestScore === 100,
  },
  {
    id: "perfect_score_5",
    name: "Perfect Streak",
    description: "Got 5 perfect scores",
    icon: "🌟",
    check: (stats) => stats.perfectScores >= 5,
  },
  {
    id: "on_fire",
    name: "On Fire!",
    description: "5+ day streak",
    icon: "🔥",
    check: (stats) => stats.streak >= 5,
  },
  {
    id: "dedicated_learner",
    name: "Dedicated Learner",
    description: "30+ day streak",
    icon: "🌟",
    check: (stats) => stats.streak >= 30,
  },
  {
    id: "learning_monster",
    name: "Learning Monster",
    description: "100+ day streak",
    icon: "💪",
    check: (stats) => stats.streak >= 100,
  },
  {
    id: "riddle_master",
    name: "Riddle Master",
    description: "Solved 5+ riddles",
    icon: "🧩",
    check: (stats) => stats.riddlesSolved >= 5,
  },
  {
    id: "riddle_legend",
    name: "Riddle Legend",
    description: "Solved 25+ riddles",
    icon: "🧠",
    check: (stats) => stats.riddlesSolved >= 25,
  },
  {
    id: "avid_reader",
    name: "Avid Reader",
    description: "Read 10+ articles",
    icon: "📖",
    check: (stats) => stats.readArticles >= 10,
  },
  {
    id: "bookworm",
    name: "Bookworm",
    description: "Read 50+ articles",
    icon: "📚",
    check: (stats) => stats.readArticles >= 50,
  },
  {
    id: "point_collector",
    name: "Point Collector",
    description: "Earned 1000+ points",
    icon: "💎",
    check: (stats) => stats.totalPoints >= 1000,
  },
  {
    id: "point_millionaire",
    name: "Point Millionaire",
    description: "Earned 10,000+ points",
    icon: "💰",
    check: (stats) => stats.totalPoints >= 10000,
  },
  {
    id: "category_master",
    name: "Category Master",
    description: "Played quizzes in 5+ categories",
    icon: "🎯",
    check: (stats) => Object.keys(stats.quizzesByCategory || {}).length >= 5,
  },
  {
    id: "all_rounder",
    name: "All Rounder",
    description: "Played quizzes in 10+ categories",
    icon: "🌟",
    check: (stats) => Object.keys(stats.quizzesByCategory || {}).length >= 10,
  },
  {
    id: "high_scorer",
    name: "High Scorer",
    description: "Average score above 80%",
    icon: "📈",
    check: (stats) => stats.averageScore >= 80 && stats.totalQuizzes >= 5,
  },
  {
    id: "genius",
    name: "Genius",
    description: "Average score above 90%",
    icon: "🧠",
    check: (stats) => stats.averageScore >= 90 && stats.totalQuizzes >= 10,
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showBioSelector, setShowBioSelector] = useState(false);
  const [customBio, setCustomBio] = useState("");
  const [selectedBioType, setSelectedBioType] = useState("predefined");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar_id: 1,
    bio: "",
    bio_text: "",
    location: "",
    website: "",
  });
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    bestScore: 0,
    averageScore: 0,
    totalPoints: 0,
    streak: 0,
    longestStreak: 0,
    riddlesSolved: 0,
    readArticles: 0,
    totalTime: 0,
    perfectScores: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    lastQuizDate: null,
    quizzesByCategory: {},
    achievements: [],
  });
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  // Recalculate achievements whenever stats change
  useEffect(() => {
    if (stats) {
      calculateAchievements();
    }
  }, [stats]);

  const loadProfile = async () => {
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

      const userMeta = user.user_metadata || {};

      // Check if bio is from predefined or custom
      const bioText = userMeta.bio || "";
      const isPredefined = PREDEFINED_BIOS.some((b) => b.text === bioText);

      setFormData({
        name: userMeta.name || "",
        email: user.email || "",
        avatar_id: userMeta.avatar_id || 1,
        bio: bioText,
        bio_text: bioText,
        location: userMeta.location || "",
        website: userMeta.website || "",
      });

      if (!isPredefined && bioText) {
        setSelectedBioType("custom");
        setCustomBio(bioText);
      } else {
        setSelectedBioType("predefined");
      }

      // Get user profile from users table
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile error:", profileError);
      }

      if (profileData) {
        setProfile(profileData);
        const statsData = profileData.stats || {};

        // Merge with existing stats to preserve achievements
        const newStats = {
          totalQuizzes: statsData.total_quizzes || 0,
          bestScore: statsData.best_score || 0,
          averageScore: statsData.average_score || 0,
          totalPoints: statsData.total_points || 0,
          streak: statsData.streak || 0,
          longestStreak: statsData.longest_streak || 0,
          riddlesSolved: statsData.riddles_solved || 0,
          readArticles: statsData.read_articles || 0,
          totalTime: statsData.total_time || 0,
          perfectScores: statsData.perfect_scores || 0,
          totalCorrect: statsData.total_correct || 0,
          totalIncorrect: statsData.total_incorrect || 0,
          lastQuizDate: statsData.last_quiz_date || null,
          quizzesByCategory: statsData.quizzes_by_category || {},
          achievements: statsData.achievements || [],
        };

        setStats(newStats);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = () => {
    const unlockedAchievements = [];

    ACHIEVEMENT_DEFINITIONS.forEach((def) => {
      if (def.check(stats)) {
        unlockedAchievements.push({
          id: def.id,
          name: def.name,
          description: def.description,
          icon: def.icon,
          unlocked: true,
        });
      }
    });

    setAchievements(unlockedAchievements);

    // Update stats with achievements if changed
    if (unlockedAchievements.length !== (stats.achievements || []).length) {
      const achievementIds = unlockedAchievements.map((a) => a.id);
      setStats((prev) => ({
        ...prev,
        achievements: achievementIds,
      }));

      // Save achievements to database
      if (user) {
        saveAchievements(user.id, achievementIds);
      }
    }
  };

  const saveAchievements = async (userId, achievementIds) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          stats: {
            ...stats,
            achievements: achievementIds,
          },
        })
        .eq("id", userId);

      if (error) {
        console.error("Error saving achievements:", error);
      }
    } catch (error) {
      console.error("Error saving achievements:", error);
    }
  };

  const refreshStats = async () => {
    setRefreshing(true);
    try {
      // Get latest quiz data
      const { data: quizData, error: quizError } = await supabase
        .from("quiz_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (quizError) throw quizError;

      // Recalculate stats from quiz history
      let totalQuizzes = 0;
      let totalCorrect = 0;
      let totalIncorrect = 0;
      let totalPoints = 0;
      let bestScore = 0;
      let perfectScores = 0;
      let totalTime = 0;
      const categoryCount = {};

      if (quizData && quizData.length > 0) {
        totalQuizzes = quizData.length;

        quizData.forEach((quiz) => {
          totalCorrect += quiz.correct_answers || 0;
          totalIncorrect += quiz.incorrect_answers || 0;
          totalPoints += quiz.points || 0;
          totalTime += quiz.time_taken || 0;

          const score = quiz.score || 0;
          if (score > bestScore) bestScore = score;
          if (score === 100) perfectScores++;

          // Count by category
          const category = quiz.category || "Uncategorized";
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
      }

      // Calculate average score
      const totalQuestions = totalCorrect + totalIncorrect;
      const averageScore =
        totalQuestions > 0
          ? Math.round((totalCorrect / totalQuestions) * 100)
          : 0;

      // Calculate streak
      let streak = 0;
      let longestStreak = 0;
      let currentStreak = 0;
      let lastDate = null;

      if (quizData && quizData.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get unique dates
        const dates = quizData.map((q) => {
          const d = new Date(q.created_at);
          d.setHours(0, 0, 0, 0);
          return d;
        });

        // Remove duplicates and sort
        const uniqueDates = [...new Set(dates.map((d) => d.getTime()))]
          .map((t) => new Date(t))
          .sort((a, b) => b - a);

        if (uniqueDates.length > 0) {
          // Check if last quiz was today or yesterday
          const lastQuizDate = uniqueDates[0];
          const daysDiff = Math.floor(
            (today - lastQuizDate) / (1000 * 60 * 60 * 24),
          );

          if (daysDiff <= 1) {
            // Calculate streak
            currentStreak = 1;
            for (let i = 1; i < uniqueDates.length; i++) {
              const prevDate = uniqueDates[i - 1];
              const currDate = uniqueDates[i];
              const diff = Math.floor(
                (prevDate - currDate) / (1000 * 60 * 60 * 24),
              );

              if (diff === 1) {
                currentStreak++;
              } else {
                break;
              }
            }
            streak = currentStreak;

            // Calculate longest streak from all data
            let tempStreak = 0;
            let tempLongest = 0;
            let prevDate = null;

            for (const date of uniqueDates) {
              if (!prevDate) {
                tempStreak = 1;
              } else {
                const diff = Math.floor(
                  (prevDate - date) / (1000 * 60 * 60 * 24),
                );
                if (diff === 1) {
                  tempStreak++;
                } else {
                  tempStreak = 1;
                }
              }
              tempLongest = Math.max(tempLongest, tempStreak);
              prevDate = date;
            }
            longestStreak = tempLongest;
          }
        }
      }

      // Get riddles solved
      const { data: riddlesData, error: riddlesError } = await supabase
        .from("riddle_history")
        .select("*")
        .eq("user_id", user.id);

      const riddlesSolved = riddlesError ? 0 : riddlesData?.length || 0;

      // Get articles read
      const { data: articlesData, error: articlesError } = await supabase
        .from("article_history")
        .select("*")
        .eq("user_id", user.id);

      const readArticles = articlesError ? 0 : articlesData?.length || 0;

      // Update stats
      const updatedStats = {
        totalQuizzes,
        totalCorrect,
        totalIncorrect,
        totalPoints,
        bestScore,
        averageScore,
        perfectScores,
        totalTime,
        streak,
        longestStreak,
        riddlesSolved,
        readArticles,
        lastQuizDate:
          quizData && quizData.length > 0 ? quizData[0].created_at : null,
        quizzesByCategory: categoryCount,
        achievements: stats.achievements || [],
      };

      setStats(updatedStats);

      // Save to database
      const { error: updateError } = await supabase
        .from("users")
        .update({
          stats: {
            total_quizzes: totalQuizzes,
            total_correct: totalCorrect,
            total_incorrect: totalIncorrect,
            total_points: totalPoints,
            best_score: bestScore,
            average_score: averageScore,
            perfect_scores: perfectScores,
            total_time: totalTime,
            streak: streak,
            longest_streak: longestStreak,
            riddles_solved: riddlesSolved,
            read_articles: readArticles,
            last_quiz_date:
              quizData && quizData.length > 0 ? quizData[0].created_at : null,
            quizzes_by_category: categoryCount,
            achievements: stats.achievements || [],
          },
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating stats:", updateError);
      }

      toast.success("Stats refreshed successfully! 🔄");
    } catch (error) {
      console.error("Error refreshing stats:", error);
      toast.error("Failed to refresh stats");
    } finally {
      setRefreshing(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarSelect = (avatar) => {
    setFormData((prev) => ({ ...prev, avatar_id: avatar.id }));
  };

  const handleBioSelect = (bioText) => {
    setFormData((prev) => ({ ...prev, bio: bioText, bio_text: bioText }));
    setSelectedBioType("predefined");
    setShowBioSelector(false);
  };

  const handleCustomBio = () => {
    setSelectedBioType("custom");
    setFormData((prev) => ({ ...prev, bio: customBio, bio_text: customBio }));
    setShowBioSelector(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Determine final bio
      let finalBio = formData.bio;
      if (selectedBioType === "custom") {
        finalBio = customBio;
      }

      const updates = {
        name: formData.name,
        avatar_id: formData.avatar_id,
        bio: finalBio,
        location: formData.location,
        website: formData.website,
      };

      // Update auth user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: updates,
      });

      if (updateError) throw updateError;

      // Check if user exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Check error:", checkError);
      }

      const profileUpdates = {
        name: formData.name,
        email: formData.email,
        avatar_id: formData.avatar_id,
        bio: finalBio,
        location: formData.location,
        website: formData.website,
        updated_at: new Date().toISOString(),
      };

      let upsertError;
      if (existingUser) {
        const { error } = await supabase
          .from("users")
          .update(profileUpdates)
          .eq("id", user.id);
        upsertError = error;
      } else {
        const { error } = await supabase.from("users").insert({
          id: user.id,
          ...profileUpdates,
          stats: {
            total_quizzes: 0,
            best_score: 0,
            average_score: 0,
            total_points: 0,
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
        });
        upsertError = error;
      }

      if (upsertError) throw upsertError;

      toast.success("Profile updated successfully! 🎉");
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getAvatar = () => {
    return getAvatarById(formData.avatar_id) || defaultAvatars[0];
  };

  const currentAvatar = getAvatar();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#7c3aed] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-[#a78bfa]" />
            Profile
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshStats}
            disabled={refreshing}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Stats"}
          </button>
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  loadProfile();
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
                disabled={saving}
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[#1a1a2e] rounded-2xl p-8 shadow-xl border border-white/5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-lg transition-all duration-300 group-hover:scale-105 cursor-pointer"
              style={{ backgroundColor: currentAvatar?.bg || "#2d2d5e" }}
              onClick={() => editing && setShowAvatarSelector(true)}
            >
              {currentAvatar?.emoji || "🧠"}
            </div>
            {editing && (
              <button
                onClick={() => setShowAvatarSelector(true)}
                className="absolute bottom-0 right-0 p-2 bg-[#7c3aed] rounded-full border-2 border-[#1a1a2e] hover:bg-[#6d28d9] transition-all duration-300"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1">
            {editing ? (
              <div className="space-y-3 w-full">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full bg-[#2d2d44] text-white px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  />
                </div>

                {/* Bio Selection */}
                <div className="relative">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBioSelector(!showBioSelector)}
                      className="flex-1 bg-[#2d2d44] text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-[#7c3aed] transition-colors text-left flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#a78bfa]" />
                      <span className="truncate">
                        {formData.bio || "Select or write a bio"}
                      </span>
                    </button>
                  </div>

                  {showBioSelector && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#2d2d44] rounded-lg p-3 shadow-xl z-10 border border-gray-700 max-h-64 overflow-y-auto">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 font-medium px-2">
                          Predefined Bios
                        </p>
                        {PREDEFINED_BIOS.map((bio) => (
                          <button
                            key={bio.id}
                            onClick={() => handleBioSelect(bio.text)}
                            className={`w-full text-left px-3 py-2 rounded hover:bg-[#3d3d54] transition-colors flex items-center gap-2 ${
                              formData.bio === bio.text &&
                              selectedBioType === "predefined"
                                ? "bg-[#7c3aed]"
                                : "text-gray-300"
                            }`}
                          >
                            <span>{bio.emoji}</span>
                            <span className="truncate">{bio.text}</span>
                            {formData.bio === bio.text &&
                              selectedBioType === "predefined" && (
                                <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                              )}
                          </button>
                        ))}

                        <div className="border-t border-gray-700 my-2"></div>

                        <p className="text-xs text-gray-400 font-medium px-2">
                          Custom Bio
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customBio}
                            onChange={(e) => setCustomBio(e.target.value)}
                            placeholder="Write your own bio..."
                            className="flex-1 bg-[#1a1a2e] text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] text-sm"
                          />
                          <button
                            onClick={handleCustomBio}
                            className="px-4 py-2 bg-[#7c3aed] text-white rounded hover:bg-[#6d28d9] transition-colors text-sm"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {selectedBioType === "custom" && customBio && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-[#7c3aed]/20 rounded">
                            <span className="text-sm text-gray-300 flex-1">
                              {customBio}
                            </span>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location"
                      className="w-full bg-[#2d2d44] text-white px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Website"
                      className="w-full bg-[#2d2d44] text-white px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">
                  {profile?.name || user?.user_metadata?.name || "User"}
                </h2>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                {profile?.bio && (
                  <p className="text-gray-300 text-sm mt-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#a78bfa]" />
                    {profile.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined{" "}
                    {new Date(
                      user?.created_at || Date.now(),
                    ).toLocaleDateString()}
                  </span>
                  {profile?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {profile.location}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Quick Stats */}
          {!editing && (
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.totalQuizzes}
                </div>
                <div className="text-xs text-gray-400">Quizzes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {stats.bestScore}%
                </div>
                <div className="text-xs text-gray-400">Best Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {stats.streak}
                </div>
                <div className="text-xs text-gray-400">Streak</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a2e] rounded-xl p-4 text-center border border-white/5">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">{stats.bestScore}%</div>
          <div className="text-xs text-gray-400">Best Score</div>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 text-center border border-white/5">
          <Award className="w-6 h-6 text-[#a78bfa] mx-auto mb-2" />
          <div className="text-xl font-bold text-white">
            {stats.averageScore || 0}%
          </div>
          <div className="text-xs text-gray-400">Average Score</div>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 text-center border border-white/5">
          <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">
            {stats.totalPoints || 0}
          </div>
          <div className="text-xs text-gray-400">Total Points</div>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 text-center border border-white/5">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">
            {stats.streak || 0}
          </div>
          <div className="text-xs text-gray-400">Day Streak</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a2e] rounded-xl p-4 flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-blue-400/10 rounded-lg">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {stats.riddlesSolved || 0}
            </div>
            <div className="text-xs text-gray-400">Riddles Solved</div>
          </div>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-green-400/10 rounded-lg">
            <BookOpen className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {stats.readArticles || 0}
            </div>
            <div className="text-xs text-gray-400">Articles Read</div>
          </div>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 flex items-center gap-4 border border-white/5">
          <div className="p-3 bg-purple-400/10 rounded-lg">
            <Star className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {stats.perfectScores || 0}
            </div>
            <div className="text-xs text-gray-400">Perfect Scores</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Medal className="w-5 h-5 text-yellow-400" />
            Achievements ({achievements.length})
          </h3>
          <button
            onClick={refreshStats}
            disabled={refreshing}
            className="text-xs text-[#a78bfa] hover:text-white transition-colors flex items-center gap-1"
          >
            <RefreshCw
              className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-gray-400">
              No achievements yet. Start learning!
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="mt-4 px-6 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm"
            >
              Start Learning
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {achievement.icon}
                </span>
                <div>
                  <div className="text-white text-sm font-medium">
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {achievement.description}
                  </div>
                </div>
                <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" />
          Account Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to sign out?")) {
                supabase.auth.signOut();
                navigate("/auth");
              }
            }}
            className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Sign Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400/50 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <AnimatePresence>
        {showAvatarSelector && (
          <AvatarSelector
            currentAvatar={currentAvatar}
            onSelect={handleAvatarSelect}
            onClose={() => setShowAvatarSelector(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
