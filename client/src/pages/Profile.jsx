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
  RefreshCw,
  Clock,
  Sparkles,
  Heart,
  Coffee,
  Compass,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";
import AvatarSelector from "../components/Common/AvatarSelector";
import { defaultAvatars, getAvatarById } from "../data/avatars";

// ✅ Default bios for users - makes profile feel alive
const getDefaultBio = (name) => {
  const bios = [
    "🧠 Lifelong learner exploring the world of knowledge",
    "🚀 On a mission to master everything!",
    "🌟 Curious mind with a passion for learning",
    "💪 Building knowledge one quiz at a time",
    "🎯 Sharpening my mind daily",
    "✨ Learning something new every day",
    "🔥 On a journey to become the best version of myself",
    "📚 Bookworm and quiz enthusiast",
    "🧩 Solving puzzles and expanding my mind",
    "🏆 Competing to be the best!",
    "🌱 Growing my knowledge every single day",
    "💡 Bright ideas and curious thoughts",
    "🎮 Learning is my favorite game",
    "⭐ Always reaching for the stars",
    "🌈 Exploring the colorful world of knowledge",
    "⚡ Powered by curiosity and coffee",
    "🦉 Wise owl in training",
    "🎯 Focused on growth and learning",
    "🚀 Shooting for the stars, one quiz at a time",
    "🌟 Every day is a learning adventure",
  ];
  const index = name?.length ? name.length % bios.length : 0;
  return bios[index];
};

// ✅ Default locations
const getDefaultLocation = () => {
  const locations = [
    "🌍 Earth",
    "🏠 Somewhere amazing",
    "🌆 City of dreams",
    "🏖️ Beach side",
    "🌄 Mountain view",
    "🌃 Night owl city",
    "🌿 Nature lover's paradise",
    "🏰 The learning castle",
    "🚀 Knowledge hub",
    "🌈 Rainbow valley",
    "🌊 Ocean breeze",
    "🌲 Forest whisper",
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar_id: 1,
    bio: "",
    location: "",
    website: "",
  });
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
  const [recentQuizzes, setRecentQuizzes] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

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
      const name = userMeta.name || user.email?.split("@")[0] || "User";

      // ✅ Set form data with defaults
      setFormData({
        name: userMeta.name || "",
        email: user.email || "",
        avatar_id: userMeta.avatar_id || 1,
        bio: userMeta.bio || getDefaultBio(name),
        location: userMeta.location || getDefaultLocation(),
        website: userMeta.website || "",
      });

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        const statsData = profileData.stats || {};
        setStats({
          totalQuizzes: statsData.total_quizzes || 0,
          bestScore: statsData.best_score || 0,
          averageScore: statsData.average_score || 0,
          totalPoints: statsData.total_points || 0,
          streak: statsData.streak || 0,
          riddlesSolved: statsData.riddles_solved || 0,
          readArticles: statsData.read_articles || 0,
          totalTime: statsData.total_time || 0,
          perfectScores: statsData.perfect_scores || 0,
        });
      }

      const { data: quizResults, error: quizError } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!quizError && quizResults && quizResults.length > 0) {
        setRecentQuizzes(quizResults.slice(0, 5));

        let totalScore = 0;
        let bestScore = 0;
        let totalPoints = 0;
        let totalTime = 0;
        let perfectScores = 0;

        quizResults.forEach((q) => {
          totalScore += q.score || 0;
          bestScore = Math.max(bestScore, q.score || 0);
          totalPoints += q.points || 0;
          totalTime += q.time_taken || 0;
          if (q.score === 100) perfectScores++;
        });

        const avgScore =
          quizResults.length > 0
            ? Math.round(totalScore / quizResults.length)
            : 0;

        const updatedStats = {
          totalQuizzes: quizResults.length,
          bestScore: bestScore,
          averageScore: avgScore,
          totalPoints: totalPoints,
          streak: stats.streak || 0,
          riddlesSolved: stats.riddlesSolved || 0,
          readArticles: stats.readArticles || 0,
          totalTime: totalTime,
          perfectScores: perfectScores,
        };

        setStats(updatedStats);

        if (profileData) {
          const { error: updateError } = await supabase
            .from("users")
            .update({
              stats: {
                total_quizzes: updatedStats.totalQuizzes,
                best_score: updatedStats.bestScore,
                average_score: updatedStats.averageScore,
                total_points: updatedStats.totalPoints,
                streak: updatedStats.streak,
                riddles_solved: updatedStats.riddlesSolved,
                read_articles: updatedStats.readArticles,
                total_time: updatedStats.totalTime,
                perfect_scores: updatedStats.perfectScores,
              },
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          if (updateError) {
            console.error("Error updating stats:", updateError);
          } else {
            console.log("✅ Stats updated in database");
          }
        }
      } else {
        setStats({
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
        setRecentQuizzes([]);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
    toast.success("Profile refreshed!");
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          avatar_id: formData.avatar_id,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
        },
      });

      if (updateError) throw updateError;

      const userData = {
        name: formData.name,
        email: formData.email,
        avatar_id: formData.avatar_id,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase.from("users").upsert({
        id: user.id,
        ...userData,
        stats: {
          total_quizzes: stats.totalQuizzes,
          best_score: stats.bestScore,
          average_score: stats.averageScore,
          total_points: stats.totalPoints,
          streak: stats.streak,
          riddles_solved: stats.riddlesSolved,
          read_articles: stats.readArticles,
          total_time: stats.totalTime,
          perfect_scores: stats.perfectScores,
        },
      });

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
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-[#7c3aed] animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-400 text-sm sm:text-base">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <UserCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#a78bfa]" />
            Profile
          </h1>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
          >
            <RefreshCw
              className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  loadProfile();
                }}
                className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                disabled={saving}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2"
              >
                {saving ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2"
            >
              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Card - With Default Bio */}
      <div className="glass-card p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="relative group flex-shrink-0">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-lg transition-all duration-300 group-hover:scale-105"
              style={{ backgroundColor: currentAvatar?.bg || "#2d2d5e" }}
            >
              {currentAvatar?.emoji || "🧠"}
            </div>
            <button
              onClick={() => setShowAvatarSelector(true)}
              className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-[#2d2d5e] rounded-full border-2 border-[#1a1a2e] hover:border-[#7c3aed] transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left w-full">
            {editing ? (
              <div className="space-y-3 w-full">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="input-theme pl-9 sm:pl-10 w-full text-sm sm:text-base"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="input-theme pl-9 sm:pl-10 w-full text-sm sm:text-base"
                    disabled
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <input
                    type="text"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Short bio (e.g., Lifelong learner 🚀)"
                    className="input-theme pl-9 sm:pl-10 w-full text-sm sm:text-base"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location"
                      className="input-theme pl-9 sm:pl-10 w-full text-sm sm:text-base"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Website"
                      className="input-theme pl-9 sm:pl-10 w-full text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {profile?.name || user?.user_metadata?.name || "User"}
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  {user?.email}
                </p>
                {profile?.bio ? (
                  <p className="text-gray-300 text-sm sm:text-base mt-2">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm sm:text-base mt-2 italic">
                    {getDefaultBio(
                      user?.user_metadata?.name ||
                        user?.email?.split("@")[0] ||
                        "User",
                    )}
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
                  {!profile?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {getDefaultLocation()}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-[10px] sm:text-xs px-2 py-1 bg-[#7c3aed]/20 text-[#a78bfa] rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {stats.totalQuizzes} quizzes
                  </span>
                  <span className="text-[10px] sm:text-xs px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {stats.bestScore}% best
                  </span>
                  <span className="text-[10px] sm:text-xs px-2 py-1 bg-orange-400/20 text-orange-400 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {stats.streak} day streak
                  </span>
                </div>
              </>
            )}
          </div>

          {!editing && (
            <div className="flex gap-4 sm:gap-6 flex-shrink-0">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  {stats.totalQuizzes}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400">
                  Quizzes
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">
                  {stats.bestScore}%
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400">
                  Best Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400">
                  {stats.streak}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400">
                  Streak
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-3 sm:p-4 text-center">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-1 sm:mb-2" />
          <div className="text-base sm:text-xl font-bold text-white">
            {stats.bestScore}%
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">Best Score</div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#a78bfa] mx-auto mb-1 sm:mb-2" />
          <div className="text-base sm:text-xl font-bold text-white">
            {stats.averageScore || 0}%
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">
            Average Score
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-1 sm:mb-2" />
          <div className="text-base sm:text-xl font-bold text-white">
            {stats.totalPoints || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">
            Total Points
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mx-auto mb-1 sm:mb-2" />
          <div className="text-base sm:text-xl font-bold text-white">
            {stats.streak || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">Day Streak</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-blue-400/10 rounded-lg">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white">
              {stats.riddlesSolved || 0}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400">
              Riddles Solved
            </div>
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-green-400/10 rounded-lg">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white">
              {stats.readArticles || 0}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400">
              Articles Read
            </div>
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-purple-400/10 rounded-lg">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white">
              {stats.perfectScores || 0}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400">
              Perfect Scores
            </div>
          </div>
        </div>
      </div>

      {/* Recent Quizzes */}
      <div className="glass-card p-4 sm:p-5 md:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          Recent Quizzes
        </h3>
        {recentQuizzes.length === 0 ? (
          <p className="text-gray-400 text-center py-4 text-sm sm:text-base">
            No quizzes taken yet. Start your first quiz!
          </p>
        ) : (
          <div className="space-y-2">
            {recentQuizzes.map((quiz, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors gap-2 sm:gap-0"
              >
                <div>
                  <div className="text-white font-medium text-sm sm:text-base">
                    {typeof quiz.category === "object"
                      ? quiz.category?.name || "Quiz"
                      : quiz.category || "Quiz"}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    {quiz.difficulty || "Medium"} • {quiz.total_questions || 0}{" "}
                    questions
                  </div>
                </div>
                <div className="text-right w-full sm:w-auto flex sm:block justify-between items-center sm:items-end">
                  <div
                    className={`text-base sm:text-lg font-bold ${
                      quiz.score >= 80
                        ? "text-green-400"
                        : quiz.score >= 50
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {quiz.score}%
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    {quiz.created_at
                      ? new Date(quiz.created_at).toLocaleDateString()
                      : "Today"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="glass-card p-4 sm:p-5 md:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
          Achievements
        </h3>
        {stats.totalQuizzes === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="text-3xl sm:text-4xl mb-3">🏆</div>
            <p className="text-gray-400 text-sm sm:text-base">
              No achievements yet. Start learning!
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="btn-primary mt-3 sm:mt-4 text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2"
            >
              Start Learning
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {stats.totalQuizzes >= 1 && (
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <div>
                  <div className="text-white text-xs sm:text-sm font-medium">
                    First Quiz
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    Completed first quiz
                  </div>
                </div>
              </div>
            )}
            {stats.bestScore === 100 && (
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <div>
                  <div className="text-white text-xs sm:text-sm font-medium">
                    Perfect Score
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    Scored 100%
                  </div>
                </div>
              </div>
            )}
            {stats.streak >= 5 && (
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-orange-400/10 rounded-lg border border-orange-400/20">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                <div>
                  <div className="text-white text-xs sm:text-sm font-medium">
                    On Fire!
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    5+ day streak
                  </div>
                </div>
              </div>
            )}
            {stats.riddlesSolved >= 5 && (
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
                <Puzzle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <div>
                  <div className="text-white text-xs sm:text-sm font-medium">
                    Riddle Master
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    Solved 5+ riddles
                  </div>
                </div>
              </div>
            )}
            {stats.totalQuizzes >= 10 && (
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <div>
                  <div className="text-white text-xs sm:text-sm font-medium">
                    Quiz Enthusiast
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    Completed 10+ quizzes
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="glass-card p-4 sm:p-5 md:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          Account Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to sign out?")) {
                supabase.auth.signOut();
                navigate("/auth");
              }
            }}
            className="flex items-center justify-between p-2 sm:p-3 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors group"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span className="text-red-400 text-sm sm:text-base">
                Sign Out
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400/50 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
            <div className="flex items-center gap-2 sm:gap-3">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span className="text-gray-400 text-sm sm:text-base">
                Change Password
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500/50 group-hover:translate-x-1 transition-transform" />
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
