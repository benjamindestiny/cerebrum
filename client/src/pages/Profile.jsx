import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Settings,
  ChevronRight,
  Star,
  Medal,
  Target,
  Brain,
  Puzzle,
  MapPin,
  Globe,
  LogOut,
  Sparkles,
  Plus,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../services/supabase";
import AvatarSelector from "../components/Common/AvatarSelector";
import { defaultAvatars, getAvatarById } from "../data/avatars";

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

const ACHIEVEMENT_DEFINITIONS = [
  { id: "first_quiz", name: "First Quiz", description: "Completed your first quiz", icon: "🎯", check: (stats) => stats.totalQuizzes >= 1 },
  { id: "quiz_enthusiast", name: "Quiz Enthusiast", description: "Completed 10+ quizzes", icon: "📚", check: (stats) => stats.totalQuizzes >= 10 },
  { id: "quiz_master", name: "Quiz Master", description: "Completed 50+ quizzes", icon: "👑", check: (stats) => stats.totalQuizzes >= 50 },
  { id: "quiz_legend", name: "Quiz Legend", description: "Completed 100+ quizzes", icon: "🏆", check: (stats) => stats.totalQuizzes >= 100 },
  { id: "perfect_score", name: "Perfect Score", description: "Scored 100% on a quiz", icon: "⭐", check: (stats) => stats.bestScore === 100 },
  { id: "perfect_score_5", name: "Perfect Streak", description: "Got 5 perfect scores", icon: "🌟", check: (stats) => stats.perfectScores >= 5 },
  { id: "high_scorer", name: "High Scorer", description: "Average score above 80%", icon: "📈", check: (stats) => stats.averageScore >= 80 && stats.totalQuizzes >= 5 },
  { id: "genius", name: "Genius", description: "Average score above 90%", icon: "🧠", check: (stats) => stats.averageScore >= 90 && stats.totalQuizzes >= 10 },
  { id: "score_50", name: "Half Century", description: "Scored 50% or higher on a quiz", icon: "🎯", check: (stats) => stats.bestScore >= 50 },
  { id: "score_80", name: "Star Student", description: "Scored 80% or higher on a quiz", icon: "⭐", check: (stats) => stats.bestScore >= 80 },
  { id: "on_fire", name: "On Fire!", description: "5+ day streak", icon: "🔥", check: (stats) => stats.streak >= 5 },
  { id: "dedicated_learner", name: "Dedicated Learner", description: "30+ day streak", icon: "🌟", check: (stats) => stats.streak >= 30 },
  { id: "learning_monster", name: "Learning Monster", description: "100+ day streak", icon: "💪", check: (stats) => stats.streak >= 100 },
  { id: "riddle_master", name: "Riddle Master", description: "Solved 5+ riddles", icon: "🧩", check: (stats) => stats.riddlesSolved >= 5 },
  { id: "riddle_legend", name: "Riddle Legend", description: "Solved 25+ riddles", icon: "🧠", check: (stats) => stats.riddlesSolved >= 25 },
  { id: "avid_reader", name: "Avid Reader", description: "Read 10+ articles", icon: "📖", check: (stats) => stats.readArticles >= 10 },
  { id: "bookworm", name: "Bookworm", description: "Read 50+ articles", icon: "📚", check: (stats) => stats.readArticles >= 50 },
  { id: "point_collector", name: "Point Collector", description: "Earned 1000+ points", icon: "💎", check: (stats) => stats.totalPoints >= 1000 },
  { id: "point_millionaire", name: "Point Millionaire", description: "Earned 10,000+ points", icon: "💰", check: (stats) => stats.totalPoints >= 10000 },
  { id: "five_quizzes", name: "Five Quizzes", description: "Completed 5 quizzes", icon: "📝", check: (stats) => stats.totalQuizzes >= 5 },
  { id: "ten_quizzes", name: "Ten Quizzes", description: "Completed 10 quizzes", icon: "📚", check: (stats) => stats.totalQuizzes >= 10 },
  { id: "twenty_quizzes", name: "Twenty Quizzes", description: "Completed 20 quizzes", icon: "📖", check: (stats) => stats.totalQuizzes >= 20 },
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
  });
  const [achievements, setAchievements] = useState([]);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (stats) {
      calculateAchievements();
    }
  }, [stats]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) { navigate("/auth"); return; }

      setUser(user);

      const { data: freshData, error: freshError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (freshError && freshError.code !== "PGRST116") {
        console.error("Error fetching fresh data:", freshError);
      }

      if (freshData) {
        setProfile(freshData);
        setFormData({
          name: freshData.name || user.user_metadata?.name || "",
          email: user.email || "",
          avatar_id: freshData.avatar_id || 1,
          bio: freshData.bio || "",
          bio_text: freshData.bio || "",
          location: freshData.location || "",
          website: freshData.website || "",
        });

        const bioText = freshData.bio || "";
        const isPredefined = PREDEFINED_BIOS.some((b) => b.text === bioText);
        if (!isPredefined && bioText) {
          setSelectedBioType("custom");
          setCustomBio(bioText);
        } else {
          setSelectedBioType("predefined");
        }
      } else {
        const defaultStats = {
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
          last_quiz_date: null,
        };

        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          name: user.user_metadata?.name || "",
          email: user.email,
          avatar_id: 1,
          stats: defaultStats,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("Error creating profile:", insertError);
        }
      }

      await loadStatsFromQuizzes(user.id);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatsFromQuizzes = async (userId) => {
    try {
      const { data: quizResults, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching quiz results:", error);
        return;
      }

      if (!quizResults || quizResults.length === 0) {
        setStats({
          totalQuizzes: 0,
          totalPoints: 0,
          averageScore: 0,
          streak: 0,
          bestScore: 0,
          perfectScores: 0,
          longestStreak: 0,
          riddlesSolved: 0,
          readArticles: 0,
          totalTime: 0,
        });
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
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
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

      let riddlesSolved = 0;
      try {
        const { data: riddleHistory } = await supabase
          .from("riddle_history")
          .select("*")
          .eq("user_id", userId)
          .eq("solved", true);
        if (riddleHistory) {
          riddlesSolved = riddleHistory.length;
        }
      } catch (error) {}

      let readArticles = 0;
      try {
        const { data: articleHistory } = await supabase
          .from("article_history")
          .select("*")
          .eq("user_id", userId);
        if (articleHistory) {
          readArticles = articleHistory.length;
        }
      } catch (error) {}

      const newStats = {
        totalQuizzes,
        totalPoints,
        averageScore,
        streak,
        bestScore,
        perfectScores,
        longestStreak: streak,
        riddlesSolved,
        readArticles,
        totalTime: 0,
      };

      setStats(newStats);
      setRenderKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading stats from quizzes:", error);
    }
  };

  const calculateAchievements = () => {
    const unlockedAchievements = ACHIEVEMENT_DEFINITIONS.filter((def) => def.check(stats));
    setAchievements(unlockedAchievements);
  };

  const refreshStats = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      await loadStatsFromQuizzes(user.id);
    } catch (error) {
      console.error("Error refreshing stats:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      const finalBio = selectedBioType === "custom" ? customBio : formData.bio;
      const updates = {
        name: formData.name,
        avatar_id: formData.avatar_id,
        bio: finalBio,
        location: formData.location,
        website: formData.website,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

      if (updateError) throw updateError;

      setEditing(false);
      await loadProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const getAvatar = () => getAvatarById(formData.avatar_id) || defaultAvatars[0];
  const currentAvatar = getAvatar();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/dashboard")}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </motion.button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <UserCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
            Profile
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshStats}
            disabled={refreshing}
            className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
          {editing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setEditing(false); loadProfile(); }}
                className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs flex items-center gap-1.5"
                disabled={saving}
              >
                <X className="w-3 h-3" /> Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs flex items-center gap-1.5"
              >
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                {saving ? "Saving..." : "Save"}
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs flex items-center gap-1.5"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4, type: "spring" }}
        className="bg-[#1A1A1A] rounded-xl p-4 sm:p-6 border border-white/5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg"
              style={{ backgroundColor: currentAvatar?.bg || "#2d2d5e" }}
            >
              {currentAvatar?.emoji || "🧠"}
            </motion.div>
            {editing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAvatarSelector(true)}
                className="absolute bottom-0 right-0 p-1.5 bg-blue-500 rounded-full border-2 border-[#1A1A1A] hover:bg-blue-600 transition-all"
              >
                <Camera className="w-3 h-3 text-white" />
              </motion.button>
            )}
          </div>

          <div className="flex-1 w-full">
            {editing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full bg-[#262626] text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowBioSelector(!showBioSelector)}
                  className="w-full bg-[#262626] text-white px-3 py-2 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors text-left text-sm flex items-center gap-2"
                >
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span className="truncate">{formData.bio || "Select or write a bio"}</span>
                </motion.button>
                {showBioSelector && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-[#262626] rounded-lg p-2 max-h-48 overflow-y-auto"
                  >
                    {PREDEFINED_BIOS.map((bio) => (
                      <button
                        key={bio.id}
                        onClick={() => handleBioSelect(bio.text)}
                        className={`w-full text-left px-2 py-1.5 rounded text-sm ${formData.bio === bio.text && selectedBioType === "predefined" ? "bg-blue-500" : "hover:bg-[#3d3d54]"}`}
                      >
                        {bio.emoji} {bio.text}
                      </button>
                    ))}
                    <input
                      type="text"
                      value={customBio}
                      onChange={(e) => setCustomBio(e.target.value)}
                      placeholder="Custom bio..."
                      className="w-full bg-[#1A1A1A] text-white px-2 py-1.5 rounded border border-gray-700 text-sm mt-1"
                    />
                    <button
                      onClick={handleCustomBio}
                      className="w-full bg-blue-500 text-white py-1.5 rounded text-sm mt-1"
                    >
                      Use Custom Bio
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {profile?.name || user?.user_metadata?.name || "User"}
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">{user?.email}</p>
                {profile?.bio && (
                  <p className="text-gray-300 text-sm mt-1 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-blue-400" /> {profile.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  {profile?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {profile.location}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {!editing && (
            <div className="flex gap-4 w-full sm:w-auto justify-center sm:justify-end">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{stats.totalQuizzes}</div>
                <div className="text-[10px] text-gray-400">Quizzes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-teal-400">{stats.bestScore}%</div>
                <div className="text-[10px] text-gray-400">Best Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">{stats.streak}</div>
                <div className="text-[10px] text-gray-400">Streak</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        key={`profile-stats-${renderKey}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
      >
        {[
          { icon: Trophy, label: 'Total Points', value: stats.totalPoints, color: 'text-teal-400' },
          { icon: Award, label: 'Average Score', value: `${stats.averageScore || 0}%`, color: 'text-blue-400' },
          { icon: Flame, label: 'Day Streak', value: stats.streak || 0, color: 'text-orange-400' },
          { icon: Brain, label: 'Quizzes Taken', value: stats.totalQuizzes, color: 'text-blue-400' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + index * 0.08, duration: 0.3 }}
            whileHover={{ y: -3 }}
            className="bg-[#1A1A1A] rounded-xl p-3 text-center border border-white/5"
          >
            <item.icon className={`w-5 h-5 ${item.color} mx-auto mb-1`} />
            <div className="text-lg font-bold text-white">{item.value}</div>
            <div className="text-[10px] text-gray-400">{item.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3"
      >
        {[
          { icon: Brain, label: 'Riddles Solved', value: stats.riddlesSolved || 0, color: 'text-blue-400' },
          { icon: BookOpen, label: 'Articles Read', value: stats.readArticles || 0, color: 'text-green-400' },
          { icon: Star, label: 'Perfect Scores', value: stats.perfectScores || 0, color: 'text-purple-400' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.08, duration: 0.3 }}
            whileHover={{ y: -2 }}
            className="bg-[#1A1A1A] rounded-xl p-3 flex items-center gap-3 border border-white/5"
          >
            <div className={`p-2 ${item.color.replace('text', 'bg')}/10 rounded-lg`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{item.value}</div>
              <div className="text-[10px] text-gray-400">{item.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Achievements */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Medal className="w-4 h-4 text-teal-400" /> Achievements ({achievements.length})
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshStats}
            disabled={refreshing}
            className="text-xs text-blue-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </motion.button>
        </div>
        {achievements.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-gray-400 text-sm">No achievements yet. Start learning!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + index * 0.04, duration: 0.3 }}
                className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5"
              >
                <span className="text-xl">{achievement.icon}</span>
                <div>
                  <div className="text-white text-xs font-medium">{achievement.name}</div>
                  <div className="text-[10px] text-gray-400">{achievement.description}</div>
                </div>
                <CheckCircle className="w-3 h-3 text-green-400 ml-auto" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Account Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5"
      >
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-400" /> Account Settings
        </h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (confirm("Are you sure you want to sign out?")) {
              supabase.auth.signOut();
              navigate("/auth");
            }
          }}
          className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors group w-full"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400/50 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={currentAvatar}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </motion.div>
  );
};

export default Profile;
