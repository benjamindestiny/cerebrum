import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Puzzle,
  Brain,
  Lightbulb,
  Sparkles,
  Trophy,
  Clock,
  Zap,
  Check,
  X,
  Send,
  Eye,
  EyeOff,
  Loader2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Timer,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { riddles, getDailyRiddle } from "../data/riddles";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";

const Riddles = () => {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [solvedCount, setSolvedCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedRiddle, setExpandedRiddle] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [showHintMap, setShowHintMap] = useState({});
  const [showAnswerMap, setShowAnswerMap] = useState({});
  const [resultMap, setResultMap] = useState({});
  const [attemptsMap, setAttemptsMap] = useState({});
  const [dailyAttempts, setDailyAttempts] = useState(0);
  const [dailyHintUsed, setDailyHintUsed] = useState(false);
  const [dailyAnswerRevealed, setDailyAnswerRevealed] = useState(false);
  const [dailySolved, setDailySolved] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState("");
  const [dailyRiddleData, setDailyRiddleData] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const inputRefs = useRef({});

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadAllRiddleData();
    }
  }, [user]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setIsLoading(false);
        setLoadingHistory(false);
      }
    } catch (error) {
      console.error("Error getting user:", error);
      setIsLoading(false);
      setLoadingHistory(false);
    }
  };

  const loadAllRiddleData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      await loadUserStats();
      await loadRiddleHistory();
      // Load daily riddle AFTER history is loaded
      loadDailyRiddle();
    } catch (error) {
      console.error("Error loading riddle data:", error);
      toast.error("Failed to load riddle data");
    } finally {
      setIsLoading(false);
      setLoadingHistory(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("stats")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading user stats:", error);
        return;
      }

      if (data?.stats) {
        setSolvedCount(data.stats.riddles_solved || 0);
        setPoints(data.stats.total_points || 0);
        setStreak(data.stats.riddle_streak || 0);
      }
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  };

  const loadRiddleHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("riddle_history")
        .select("*")
        .eq("user_id", user.id)
        .order("solved_at", { ascending: false });

      if (error) {
        console.warn("Riddle history table may not exist:", error);
        return;
      }

      if (data) {
        setHistory(data);
        const solved = data.filter(h => h.solved === true).length;
        setSolvedCount(solved);
      }
    } catch (error) {
      console.error("Error loading riddle history:", error);
    }
  };

  // ✅ FIX: Load daily riddle with proper check
  const loadDailyRiddle = () => {
    const daily = getDailyRiddle();
    setDailyRiddleData(daily);
    setAnswer("");
    setShowHint(false);
    setShowAnswer(false);
    setIsCorrect(null);
    setFeedbackMessage("");
    setFeedbackType("");
    setDailyAttempts(0);
    setDailyHintUsed(false);
    setDailyAnswerRevealed(false);

    // ✅ Check if today's riddle is already solved
    const today = new Date().toISOString().split("T")[0];
    const dailySolvedToday = history.some(
      (h) => 
        h.riddle_id === daily.id && 
        h.solved === true && 
        h.solved_at && 
        h.solved_at.split("T")[0] === today
    );

    if (dailySolvedToday) {
      setDailySolved(true);
      setIsCorrect(true);
      setShowAnswer(true);
      setFeedbackMessage("✅ You already solved today's riddle!");
      setFeedbackType("success");
    } else {
      setDailySolved(false);
    }
  };

  const saveRiddleToHistory = async (riddleId, solved, pointsEarned = 0) => {
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from("riddle_history")
        .select("*")
        .eq("user_id", user.id)
        .eq("riddle_id", riddleId)
        .maybeSingle();

      if (existing) {
        // ✅ Only update if not already solved
        if (!existing.solved) {
          const { error } = await supabase
            .from("riddle_history")
            .update({
              solved: solved,
              solved_at: solved ? new Date().toISOString() : null,
              points: pointsEarned,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);

          if (error) throw error;
        }
      } else {
        const { error } = await supabase
          .from("riddle_history")
          .insert({
            user_id: user.id,
            riddle_id: riddleId,
            solved: solved,
            solved_at: solved ? new Date().toISOString() : null,
            points: pointsEarned,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      await loadRiddleHistory();
    } catch (error) {
      console.error("Error saving riddle history:", error);
    }
  };

  const updateUserStats = async (newSolvedCount, newPoints, newStreak) => {
    if (!user) return;

    try {
      const { data: userData } = await supabase
        .from("users")
        .select("stats")
        .eq("id", user.id)
        .single();

      const currentStats = userData?.stats || {};

      const updatedStats = {
        ...currentStats,
        riddles_solved: newSolvedCount,
        total_points: newPoints,
        riddle_streak: newStreak,
        last_riddle_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("users")
        .update({ stats: updatedStats })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating user stats:", error);
        return;
      }

      console.log("✅ User stats updated:", updatedStats);
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  const checkAnswer = (userAnswer, correctAnswer) => {
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();

    if (normalizedUser === normalizedCorrect) {
      return { correct: true, message: "✅ Perfect! That's exactly right!" };
    }

    if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 2) {
      return { correct: true, message: "✅ Close enough! That works!" };
    }

    if (normalizedUser.includes(normalizedCorrect) && normalizedCorrect.length > 2) {
      return { correct: true, message: "✅ That's right!" };
    }

    return { correct: false, message: "❌ Not quite right. Try again!" };
  };

  // ✅ FIX: Prevent multiple completions
  const handleDailySubmit = async () => {
    // ✅ Check if already solved today
    if (dailySolved) {
      setFeedbackMessage("✅ You already solved today's riddle!");
      setFeedbackType("info");
      return;
    }

    if (!dailyRiddleData) {
      setFeedbackMessage("No riddle available today.");
      setFeedbackType("error");
      return;
    }

    const userAnswer = answer.trim();
    if (!userAnswer) {
      setFeedbackMessage("📝 Please type an answer first!");
      setFeedbackType("error");
      return;
    }

    const correctAnswer = dailyRiddleData.answer;
    const result = checkAnswer(userAnswer, correctAnswer);

    setDailyAttempts((prev) => prev + 1);

    if (result.correct) {
      setIsCorrect(true);
      setShowAnswer(true);
      setDailySolved(true);
      setFeedbackMessage(result.message);
      setFeedbackType("success");

      const newSolvedCount = solvedCount + 1;
      const newPoints = points + dailyRiddleData.points;
      const newStreak = streak + 1;

      setSolvedCount(newSolvedCount);
      setPoints(newPoints);
      setStreak(newStreak);

      await saveRiddleToHistory(dailyRiddleData.id, true, dailyRiddleData.points);
      await updateUserStats(newSolvedCount, newPoints, newStreak);

      toast.success(`🎉 Correct! +${dailyRiddleData.points} points`);
      await loadUserStats();
    } else {
      setIsCorrect(false);
      setFeedbackMessage(result.message);
      setFeedbackType("error");
      setStreak(0);
      await updateUserStats(solvedCount, points, 0);

      if (dailyAttempts + 1 >= 3) {
        setShowAnswer(true);
        setFeedbackMessage(`💡 Answer revealed after 3 attempts. The answer was: "${correctAnswer}"`);
        setFeedbackType("info");
        toast.info("💡 Answer revealed after 3 attempts");
      } else {
        const remaining = 3 - (dailyAttempts + 1);
        toast.error(`❌ Not quite right. ${remaining} attempts remaining!`);
      }
    }
  };

  const handleSubmitRiddle = async (riddleId) => {
    const riddle = riddles.find((r) => r.id === riddleId);
    if (!riddle) return;

    // ✅ Check if already solved
    if (isRiddleSolved(riddleId)) {
      toast.info("✅ You already solved this riddle!");
      return;
    }

    const userAnswer = inputValues[riddleId]?.trim() || "";
    if (!userAnswer) {
      toast.warning("📝 Please type an answer first!");
      return;
    }

    setAttemptsMap((prev) => ({
      ...prev,
      [riddleId]: (prev[riddleId] || 0) + 1,
    }));

    const result = checkAnswer(userAnswer, riddle.answer);
    setResultMap((prev) => ({ ...prev, [riddleId]: result.correct }));

    if (result.correct) {
      setShowAnswerMap((prev) => ({ ...prev, [riddleId]: true }));
      const newSolvedCount = solvedCount + 1;
      const newPoints = points + riddle.points;
      const newStreak = streak + 1;

      setSolvedCount(newSolvedCount);
      setPoints(newPoints);
      setStreak(newStreak);
      setFeedbackMessage(result.message);
      setFeedbackType("success");

      await saveRiddleToHistory(riddle.id, true, riddle.points);
      await updateUserStats(newSolvedCount, newPoints, newStreak);

      toast.success(`🎉 Correct! +${riddle.points} points`);
      await loadUserStats();
    } else {
      setStreak(0);
      await updateUserStats(solvedCount, points, 0);
      setFeedbackMessage(result.message);
      setFeedbackType("error");

      const attempts = attemptsMap[riddleId] || 0;
      if (attempts + 1 >= 3) {
        setShowAnswerMap((prev) => ({ ...prev, [riddleId]: true }));
        setFeedbackMessage(`💡 The answer is: "${riddle.answer}"`);
        setFeedbackType("info");
        toast.info("💡 Answer revealed after 3 attempts");
      } else {
        const remaining = 3 - (attempts + 1);
        toast.error(`❌ Not quite right. ${remaining} attempts remaining!`);
      }
    }
  };

  const refreshStats = async () => {
    await loadAllRiddleData();
    toast.success("🔄 Stats refreshed!");
  };

  const handleDailyHint = () => {
    if (dailySolved) {
      toast.info("✅ You already solved today's riddle!");
      return;
    }
    if (dailyHintUsed) {
      toast.info("💡 You already used the hint!");
      return;
    }
    if (dailyAttempts < 2) {
      toast.warning("💡 Hint available after 2 attempts!");
      return;
    }
    setShowHint(true);
    setDailyHintUsed(true);
    setFeedbackMessage("💡 Hint revealed!");
    setFeedbackType("info");
  };

  const handleDailyReveal = () => {
    if (dailySolved) {
      toast.info("✅ You already solved today's riddle!");
      return;
    }
    if (dailyAnswerRevealed) {
      toast.info("💡 Answer already revealed!");
      return;
    }
    if (dailyAttempts < 3) {
      toast.warning("💡 Answer revealed after 3 attempts!");
      return;
    }
    setShowAnswer(true);
    setDailyAnswerRevealed(true);
    setFeedbackMessage(`💡 The answer is: "${dailyRiddleData.answer}"`);
    setFeedbackType("info");
  };

  const handleRiddleHint = (riddleId) => {
    const attempts = attemptsMap[riddleId] || 0;
    if (attempts < 2) {
      toast.warning("💡 Hint available after 2 attempts!");
      return;
    }
    setShowHintMap((prev) => ({ ...prev, [riddleId]: !prev[riddleId] }));
  };

  const handleRiddleReveal = (riddleId) => {
    const attempts = attemptsMap[riddleId] || 0;
    if (attempts < 3) {
      toast.warning("💡 Answer revealed after 3 attempts!");
      return;
    }
    setShowAnswerMap((prev) => ({ ...prev, [riddleId]: !prev[riddleId] }));
  };

  const handleInputChange = (riddleId, value) => {
    setInputValues((prev) => ({ ...prev, [riddleId]: value }));
    setFeedbackMessage("");
    setFeedbackType("");
  };

  const toggleRiddle = (riddleId) => {
    if (expandedRiddle === riddleId) {
      setExpandedRiddle(null);
    } else {
      setExpandedRiddle(riddleId);
      setInputValues((prev) => ({ ...prev, [riddleId]: "" }));
      setShowHintMap((prev) => ({ ...prev, [riddleId]: false }));
      setShowAnswerMap((prev) => ({ ...prev, [riddleId]: false }));
      setResultMap((prev) => ({ ...prev, [riddleId]: null }));
      setAttemptsMap((prev) => ({ ...prev, [riddleId]: 0 }));
      setFeedbackMessage("");
      setFeedbackType("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleDailySubmit();
    }
  };

  const handleKeyPressRiddle = (riddleId, e) => {
    if (e.key === "Enter") {
      handleSubmitRiddle(riddleId);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "easy") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (difficulty === "medium") return "bg-teal-500/20 text-teal-400 border-teal-500/30";
    if (difficulty === "hard") return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getDifficultyEmoji = (difficulty) => {
    if (difficulty === "easy") return "🌱";
    if (difficulty === "medium") return "⚡";
    if (difficulty === "hard") return "🔥";
    return "📚";
  };

  const isRiddleSolved = (riddleId) => {
    return history.some((h) => h.riddle_id === riddleId && h.solved === true);
  };

  const getFilteredRiddles = () => {
    if (filter === "all") return riddles;
    if (filter === "solved") return riddles.filter((r) => isRiddleSolved(r.id));
    if (filter === "unsolved") return riddles.filter((r) => !isRiddleSolved(r.id));
    if (filter === "easy") return riddles.filter((r) => r.difficulty === "easy");
    if (filter === "medium") return riddles.filter((r) => r.difficulty === "medium");
    if (filter === "hard") return riddles.filter((r) => r.difficulty === "hard");
    return riddles;
  };

  const filteredRiddles = getFilteredRiddles();

  useEffect(() => {
    if (dailyRiddleData) {
      const updateTimer = () => {
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const diff = tomorrow - now;
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeUntilNext("Available now!");
        }
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [dailyRiddleData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading riddles...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Puzzle className="w-8 h-8 text-blue-400" />
            Riddle Challenge
          </h1>
          <p className="text-gray-400 mt-1">Test your lateral thinking skills</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={refreshStats}
            className="glass-card px-4 py-2 flex items-center gap-2 hover:border-blue-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Refresh</span>
          </button>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-gray-300">{points} pts</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-300">{streak} streak</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{solvedCount}</div>
          <div className="text-xs text-gray-400">Solved</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-teal-400">{points}</div>
          <div className="text-xs text-gray-400">Points</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{streak}</div>
          <div className="text-xs text-gray-400">Streak</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-[#00C9A7]">{riddles.length}</div>
          <div className="text-xs text-gray-400">Total Riddles</div>
        </div>
      </div>

      {/* Daily Riddle */}
      {dailyRiddleData && (
        <div className="glass-card p-6 bg-blue-500/5 border border-blue-500/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-teal-400 font-semibold">✨ RIDDLE OF THE DAY</span>
                  {dailySolved && (
                    <span className="text-xs text-[#00C9A7] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Solved!
                    </span>
                  )}
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    Next: {timeUntilNext}
                  </span>
                </div>
                <p className="text-white font-medium mt-1">{dailyRiddleData.question}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setFeedbackMessage("");
                    setFeedbackType("");
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  disabled={dailySolved}
                />
                <button
                  onClick={handleDailySubmit}
                  disabled={dailySolved}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg transition-all ${
                    dailySolved
                      ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {dailySolved ? <Check className="w-5 h-5" /> : <Send className="w-4 h-4" />}
                </button>
              </div>

              {feedbackMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-2 p-2 rounded-lg text-sm flex items-center gap-2 ${
                    feedbackType === "success"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : feedbackType === "error"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : feedbackType === "info"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {feedbackType === "success" && <Check className="w-4 h-4" />}
                  {feedbackType === "error" && <X className="w-4 h-4" />}
                  {feedbackType === "info" && <AlertCircle className="w-4 h-4" />}
                  <span>{feedbackMessage}</span>
                </motion.div>
              )}

              {!dailySolved && (
                <div className="flex gap-2 mt-2 text-xs text-gray-500">
                  <span>Attempts: {dailyAttempts}/3</span>
                  <span>•</span>
                  <span>Hint after 2 attempts</span>
                  <span>•</span>
                  <span>Answer after 3 attempts</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDailyHint}
                disabled={dailySolved}
                className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  dailySolved || dailyAttempts < 2
                    ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                    : showHint
                    ? "bg-teal-500/20 text-teal-400 border border-teal-400/30 cursor-pointer hover:bg-teal-500/30"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
              <button
                onClick={handleDailyReveal}
                disabled={dailySolved}
                className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  dailySolved || dailyAttempts < 3
                    ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                    : showAnswer
                    ? "text-blue-400 border border-blue-400/30 cursor-pointer hover:bg-blue-500/30"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAnswer ? "Hide" : "Reveal"}
              </button>
            </div>
          </div>

          {showHint && (
            <div className="mt-3 p-3 bg-teal-400/10 border border-teal-400/20 rounded-lg">
              <p className="text-teal-400 text-sm">💡 {dailyRiddleData.hint}</p>
            </div>
          )}
          {showAnswer && (
            <div className="mt-3 p-3 bg-[#00C9A7]/10 border border-[#00C9A7]/20 rounded-lg">
              <p className="text-[#00C9A7] text-sm">
                <span className="font-semibold">Answer:</span> {dailyRiddleData.answer}
              </p>
              <p className="text-gray-400 text-xs mt-1">{dailyRiddleData.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* All Riddles */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            All Riddles ({riddles.length})
          </h3>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#262626] rounded-lg border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredRiddles.map((riddle) => {
            const isSolved = isRiddleSolved(riddle.id);
            const isExpanded = expandedRiddle === riddle.id;
            const inputValue = inputValues[riddle.id] || "";
            const showHintForRiddle = showHintMap[riddle.id] || false;
            const showAnswerForRiddle = showAnswerMap[riddle.id] || false;
            const result = resultMap[riddle.id];
            const attempts = attemptsMap[riddle.id] || 0;

            return (
              <motion.div
                key={riddle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg border transition-all ${
                  isSolved
                    ? "border-[#00C9A7]/30 bg-[#00C9A7]/5"
                    : "border-white/10 bg-white/5"
                } ${isExpanded ? "ring-1 ring-blue-500" : ""}`}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-white/5 transition-colors rounded-lg"
                  onClick={() => toggleRiddle(riddle.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(riddle.difficulty)}`}>
                          {getDifficultyEmoji(riddle.difficulty)} {riddle.difficulty}
                        </span>
                        {isSolved && (
                          <span className="text-xs text-[#00C9A7] flex items-center gap-1">
                            <Check className="w-3 h-3" /> Solved
                          </span>
                        )}
                        {!isSolved && attempts > 0 && (
                          <span className="text-xs text-gray-400">{attempts}/3 attempts</span>
                        )}
                        <span className="text-xs text-gray-500">{riddle.points} pts</span>
                      </div>
                      <p className="text-white font-medium">{riddle.question}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {isSolved ? (
                        <Trophy className="w-4 h-4 text-teal-400" />
                      ) : (
                        <Brain className="w-4 h-4 text-gray-500" />
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 overflow-hidden">
                    <div className="border-t border-white/10 pt-4 space-y-3">
                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              ref={(el) => (inputRefs.current[riddle.id] = el)}
                              type="text"
                              value={inputValue}
                              onChange={(e) => handleInputChange(riddle.id, e.target.value)}
                              onKeyPress={(e) => handleKeyPressRiddle(riddle.id, e)}
                              placeholder="Type your answer..."
                              className="w-full px-4 py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                              disabled={result === true}
                            />
                            <button
                              onClick={() => handleSubmitRiddle(riddle.id)}
                              disabled={result === true}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg transition-all ${
                                result === true
                                  ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                                  : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                            >
                              {result === true ? <Check className="w-5 h-5" /> : <Send className="w-4 h-4" />}
                            </button>
                          </div>
                          {!isSolved && (
                            <div className="flex gap-2 mt-1 text-xs text-gray-500">
                              <span>Attempts: {attempts}/3</span>
                              <span>•</span>
                              <span>Hint after 2 attempts</span>
                              <span>•</span>
                              <span>Answer after 3 attempts</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRiddleHint(riddle.id)}
                            disabled={result === true}
                            className={`text-sm px-3 py-2 rounded-lg flex items-center gap-1 transition-all ${
                              result === true || attempts < 2
                                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                                : showHintForRiddle
                                ? "bg-teal-500/20 text-teal-400 border border-teal-400/30 cursor-pointer hover:bg-teal-500/30"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <Lightbulb className="w-4 h-4" />
                            {showHintForRiddle ? "Hide" : "Hint"}
                          </button>
                          <button
                            onClick={() => handleRiddleReveal(riddle.id)}
                            disabled={result === true}
                            className={`text-sm px-3 py-2 rounded-lg flex items-center gap-1 transition-all ${
                              result === true || attempts < 3
                                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                                : showAnswerForRiddle
                                ? "text-blue-400 border border-blue-400/30 cursor-pointer hover:bg-blue-500/30"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {showAnswerForRiddle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showAnswerForRiddle ? "Hide" : "Reveal"}
                          </button>
                        </div>
                      </div>

                      {showHintForRiddle && (
                        <div className="p-3 bg-teal-400/10 border border-teal-400/20 rounded-lg">
                          <p className="text-teal-400 text-sm">💡 {riddle.hint}</p>
                        </div>
                      )}

                      {showAnswerForRiddle && (
                        <div className={`p-3 rounded-lg border ${
                          result === true
                            ? "bg-[#00C9A7]/10 border-[#00C9A7]/20"
                            : result === false
                            ? "bg-red-500/10 border-red-500/20"
                            : "bg-[#00C9A7]/10 border-[#00C9A7]/20"
                        }`}>
                          <p className={`text-sm ${
                            result === true
                              ? "text-[#00C9A7]"
                              : result === false
                              ? "text-red-400"
                              : "text-[#00C9A7]"
                          }`}>
                            <span className="font-semibold">Answer:</span> {riddle.answer}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">{riddle.explanation}</p>
                        </div>
                      )}

                      {result !== null && (
                        <div className={`p-3 rounded-lg border ${
                          result
                            ? "border-[#00C9A7]/30 bg-[#00C9A7]/5 text-[#00C9A7]"
                            : "border-red-400/30 bg-red-400/5 text-red-400"
                        }`}>
                          <div className="flex items-center gap-2">
                            {result ? (
                              <>
                                <Check className="w-5 h-5" /> <span>Correct! +{riddle.points} points</span>
                              </>
                            ) : (
                              <>
                                <X className="w-5 h-5" /> <span>Not quite right. Try again!</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Riddles;
