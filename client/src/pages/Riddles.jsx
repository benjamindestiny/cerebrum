import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Star,
  Medal,
  Award,
  Users,
  Loader2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Timer,
} from "lucide-react";
import { riddles, getDailyRiddle } from "../data/riddles";
import { supabase } from "../services/supabase";

const Riddles = () => {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
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

  const inputRefs = useRef({});

  useEffect(() => {
    loadDailyRiddle();
    setIsLoading(false);
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  useEffect(() => {
    if (expandedRiddle && inputRefs.current[expandedRiddle]) {
      setTimeout(() => {
        inputRefs.current[expandedRiddle]?.focus();
      }, 100);
    }
  }, [expandedRiddle]);

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

  const loadDailyRiddle = () => {
    const daily = getDailyRiddle();
    setDailyRiddleData(daily);
    setAnswer("");
    setShowHint(false);
    setShowAnswer(false);
    setIsCorrect(null);
    setDailyAttempts(0);
    setDailyHintUsed(false);
    setDailyAnswerRevealed(false);
    setDailySolved(false);
  };

  const saveRiddleToHistory = async (riddleId, solved) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("riddle_history").insert({
        user_id: user.id,
        riddle_id: riddleId,
        solved: solved,
        solved_at: solved ? new Date().toISOString() : null,
      });
      if (error) console.error("Error saving riddle history:", error);
    } catch (error) {
      console.error("Error saving riddle history:", error);
    }
  };

  const updateUserStats = async () => {
    if (!user) return;
    try {
      // Get current stats
      const { data: userData } = await supabase
        .from("users")
        .select("stats")
        .eq("id", user.id)
        .single();

      const currentStats = userData?.stats || {};
      const updatedStats = {
        ...currentStats,
        riddles_solved: solvedCount,
        total_points: (currentStats.total_points || 0) + points,
      };

      await supabase
        .from("users")
        .update({ stats: updatedStats })
        .eq("id", user.id);
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  const handleDailySubmit = () => {
    if (dailySolved) return;
    const userAnswer = answer.trim().toLowerCase();
    if (!userAnswer) return;
    const correctAnswer = dailyRiddleData.answer.toLowerCase();
    const isCorrectAnswer =
      userAnswer === correctAnswer ||
      userAnswer.includes(correctAnswer) ||
      correctAnswer.includes(userAnswer);
    setDailyAttempts((prev) => prev + 1);
    if (isCorrectAnswer) {
      setIsCorrect(true);
      setShowAnswer(true);
      setDailySolved(true);
      setSolvedCount((prev) => prev + 1);
      setPoints((prev) => prev + dailyRiddleData.points);
      setStreak((prev) => prev + 1);
      setHistory((prev) => [
        {
          id: dailyRiddleData.id,
          question: dailyRiddleData.question,
          answer: dailyRiddleData.answer,
          userAnswer: userAnswer,
          solved: true,
          points: dailyRiddleData.points,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      saveRiddleToHistory(dailyRiddleData.id, true);
      updateUserStats();
    } else {
      setIsCorrect(false);
      setStreak(0);
      setHistory((prev) => [
        {
          id: dailyRiddleData.id,
          question: dailyRiddleData.question,
          answer: dailyRiddleData.answer,
          userAnswer: userAnswer,
          solved: false,
          points: 0,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      if (dailyAttempts + 1 >= 3) {
        setShowAnswer(true);
      }
    }
  };

  const handleDailyHint = () => {
    if (dailySolved) return;
    if (dailyHintUsed) return;
    if (dailyAttempts < 2) return;
    setShowHint(true);
    setDailyHintUsed(true);
  };

  const handleDailyReveal = () => {
    if (dailySolved) return;
    if (dailyAnswerRevealed) return;
    if (dailyAttempts < 3) return;
    setShowAnswer(true);
    setDailyAnswerRevealed(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleDailySubmit();
    }
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
    }
  };

  const handleInputChange = (riddleId, value) => {
    setInputValues((prev) => ({ ...prev, [riddleId]: value }));
  };

  const handleSubmitRiddle = (riddleId) => {
    const riddle = riddles.find((r) => r.id === riddleId);
    if (!riddle) return;
    const userAnswer = inputValues[riddleId]?.trim().toLowerCase() || "";
    if (!userAnswer) return;
    setAttemptsMap((prev) => ({
      ...prev,
      [riddleId]: (prev[riddleId] || 0) + 1,
    }));
    const correctAnswer = riddle.answer.toLowerCase();
    const isCorrectAnswer =
      userAnswer === correctAnswer ||
      userAnswer.includes(correctAnswer) ||
      correctAnswer.includes(userAnswer);
    setResultMap((prev) => ({ ...prev, [riddleId]: isCorrectAnswer }));
    if (isCorrectAnswer) {
      setShowAnswerMap((prev) => ({ ...prev, [riddleId]: true }));
      setSolvedCount((prev) => prev + 1);
      setPoints((prev) => prev + riddle.points);
      setStreak((prev) => prev + 1);
      setHistory((prev) => [
        {
          id: riddle.id,
          question: riddle.question,
          answer: riddle.answer,
          userAnswer: userAnswer,
          solved: true,
          points: riddle.points,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      saveRiddleToHistory(riddle.id, true);
      updateUserStats();
    } else {
      setStreak(0);
      if ((attemptsMap[riddleId] || 0) + 1 >= 3) {
        setShowAnswerMap((prev) => ({ ...prev, [riddleId]: true }));
      }
      setHistory((prev) => [
        {
          id: riddle.id,
          question: riddle.question,
          answer: riddle.answer,
          userAnswer: userAnswer,
          solved: false,
          points: 0,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const handleRiddleHint = (riddleId) => {
    const attempts = attemptsMap[riddleId] || 0;
    if (attempts < 2) return;
    setShowHintMap((prev) => ({ ...prev, [riddleId]: !prev[riddleId] }));
  };

  const handleRiddleReveal = (riddleId) => {
    const attempts = attemptsMap[riddleId] || 0;
    if (attempts < 3) return;
    setShowAnswerMap((prev) => ({ ...prev, [riddleId]: !prev[riddleId] }));
  };

  const handleKeyPressRiddle = (riddleId, e) => {
    if (e.key === "Enter") {
      handleSubmitRiddle(riddleId);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "easy")
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (difficulty === "medium")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (difficulty === "hard")
      return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getDifficultyEmoji = (difficulty) => {
    if (difficulty === "easy") return "🌱";
    if (difficulty === "medium") return "⚡";
    if (difficulty === "hard") return "🔥";
    return "📚";
  };

  const isRiddleSolved = (riddleId) => {
    return history.some((h) => h.id === riddleId && h.solved);
  };

  const getFilteredRiddles = () => {
    if (filter === "all") return riddles;
    if (filter === "solved") return riddles.filter((r) => isRiddleSolved(r.id));
    if (filter === "unsolved")
      return riddles.filter((r) => !isRiddleSolved(r.id));
    if (filter === "easy")
      return riddles.filter((r) => r.difficulty === "easy");
    if (filter === "medium")
      return riddles.filter((r) => r.difficulty === "medium");
    if (filter === "hard")
      return riddles.filter((r) => r.difficulty === "hard");
    return riddles;
  };

  const filteredRiddles = getFilteredRiddles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#6C2BD9] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading riddles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Puzzle className="w-8 h-8 text-[#6C2BD9]" />
            Riddle Challenge
          </h1>
          <p className="text-gray-400 mt-1">
            Test your lateral thinking skills
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Daily Riddle</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">{points} pts</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-300">{streak} streak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-[#6C2BD9]">{solvedCount}</div>
          <div className="text-xs text-gray-400">Solved</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{points}</div>
          <div className="text-xs text-gray-400">Points</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{streak}</div>
          <div className="text-xs text-gray-400">Streak</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-[#00C9A7]">
            {riddles.length}
          </div>
          <div className="text-xs text-gray-400">Total Riddles</div>
        </div>
      </div>

      {dailyRiddleData && (
        <div className="glass-card p-6 bg-gradient-to-r from-[#6C2BD9]/10 to-[#8B5CF6]/10 border border-[#6C2BD9]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-yellow-400 font-semibold">
                    ✨ RIDDLE OF THE DAY
                  </span>
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
                <p className="text-white font-medium mt-1">
                  {dailyRiddleData.question}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#6C2BD9]/20 transition-all"
                  disabled={dailySolved}
                />
                <button
                  onClick={handleDailySubmit}
                  disabled={dailySolved}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-lg transition-all ${dailySolved ? "bg-green-500/20 text-green-400 cursor-not-allowed" : "bg-[#6C2BD9] text-white hover:bg-[#5A1BB8]"}`}
                >
                  {dailySolved ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
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
                className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${dailySolved || dailyAttempts < 2 ? "bg-gray-700/50 text-gray-500 cursor-not-allowed" : showHint ? "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30 cursor-pointer hover:bg-yellow-500/30" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
              <button
                onClick={handleDailyReveal}
                disabled={dailySolved}
                className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${dailySolved || dailyAttempts < 3 ? "bg-gray-700/50 text-gray-500 cursor-not-allowed" : showAnswer ? "bg-blue-500/20 text-blue-400 border border-blue-400/30 cursor-pointer hover:bg-blue-500/30" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
              >
                {showAnswer ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showAnswer ? "Hide" : "Reveal"}
              </button>
            </div>
          </div>

          {showHint && (
            <div className="mt-3 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                💡 {dailyRiddleData.hint}
              </p>
            </div>
          )}
          {showAnswer && (
            <div className="mt-3 p-3 bg-[#00C9A7]/10 border border-[#00C9A7]/20 rounded-lg">
              <p className="text-[#00C9A7] text-sm">
                <span className="font-semibold">Answer:</span>{" "}
                {dailyRiddleData.answer}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {dailyRiddleData.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#6C2BD9]" />
            All Riddles
          </h3>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#2D2D5E] rounded-lg border border-white/10 text-white text-sm focus:border-[#6C2BD9] focus:outline-none"
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
                className={`rounded-lg border transition-all ${isSolved ? "border-[#00C9A7]/30 bg-[#00C9A7]/5" : "border-white/10 bg-white/5"} ${isExpanded ? "ring-1 ring-[#6C2BD9]" : ""}`}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-white/5 transition-colors rounded-lg"
                  onClick={() => toggleRiddle(riddle.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(riddle.difficulty)}`}
                        >
                          {getDifficultyEmoji(riddle.difficulty)}{" "}
                          {riddle.difficulty}
                        </span>
                        {isSolved && (
                          <span className="text-xs text-[#00C9A7] flex items-center gap-1">
                            <Check className="w-3 h-3" /> Solved
                          </span>
                        )}
                        {!isSolved && attempts > 0 && (
                          <span className="text-xs text-gray-400">
                            {attempts}/3 attempts
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {riddle.points} pts
                        </span>
                      </div>
                      <p className="text-white font-medium">
                        {riddle.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {isSolved ? (
                        <Trophy className="w-4 h-4 text-yellow-400" />
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

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 overflow-hidden"
                    >
                      <div className="border-t border-white/10 pt-4 space-y-3">
                        <div className="flex flex-col md:flex-row gap-3">
                          <div className="flex-1">
                            <div className="relative">
                              <input
                                ref={(el) =>
                                  (inputRefs.current[riddle.id] = el)
                                }
                                type="text"
                                value={inputValue}
                                onChange={(e) =>
                                  handleInputChange(riddle.id, e.target.value)
                                }
                                onKeyPress={(e) =>
                                  handleKeyPressRiddle(riddle.id, e)
                                }
                                placeholder="Type your answer..."
                                className="w-full px-4 py-3 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#6C2BD9]/20 transition-all"
                                disabled={result === true}
                              />
                              <button
                                onClick={() => handleSubmitRiddle(riddle.id)}
                                disabled={result === true}
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-lg transition-all ${result === true ? "bg-green-500/20 text-green-400 cursor-not-allowed" : "bg-[#6C2BD9] text-white hover:bg-[#5A1BB8]"}`}
                              >
                                {result === true ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
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
                              className={`text-sm px-3 py-2 rounded-lg flex items-center gap-1 transition-all ${result === true || attempts < 2 ? "bg-gray-700/50 text-gray-500 cursor-not-allowed" : showHintForRiddle ? "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30 cursor-pointer hover:bg-yellow-500/30" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                            >
                              <Lightbulb className="w-4 h-4" />
                              {showHintForRiddle ? "Hide" : "Hint"}
                            </button>
                            <button
                              onClick={() => handleRiddleReveal(riddle.id)}
                              disabled={result === true}
                              className={`text-sm px-3 py-2 rounded-lg flex items-center gap-1 transition-all ${result === true || attempts < 3 ? "bg-gray-700/50 text-gray-500 cursor-not-allowed" : showAnswerForRiddle ? "bg-blue-500/20 text-blue-400 border border-blue-400/30 cursor-pointer hover:bg-blue-500/30" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                            >
                              {showAnswerForRiddle ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                              {showAnswerForRiddle ? "Hide" : "Reveal"}
                            </button>
                          </div>
                        </div>

                        {showHintForRiddle && (
                          <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                            <p className="text-yellow-400 text-sm">
                              💡 {riddle.hint}
                            </p>
                          </div>
                        )}

                        {showAnswerForRiddle && (
                          <div
                            className={`p-3 rounded-lg border ${result === true ? "bg-[#00C9A7]/10 border-[#00C9A7]/20" : result === false ? "bg-red-500/10 border-red-500/20" : "bg-[#00C9A7]/10 border-[#00C9A7]/20"}`}
                          >
                            <p
                              className={`text-sm ${result === true ? "text-[#00C9A7]" : result === false ? "text-red-400" : "text-[#00C9A7]"}`}
                            >
                              <span className="font-semibold">Answer:</span>{" "}
                              {riddle.answer}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {riddle.explanation}
                            </p>
                          </div>
                        )}

                        {result !== null && (
                          <div
                            className={`p-3 rounded-lg border ${result ? "border-[#00C9A7]/30 bg-[#00C9A7]/5 text-[#00C9A7]" : "border-red-400/30 bg-red-400/5 text-red-400"}`}
                          >
                            <div className="flex items-center gap-2">
                              {result ? (
                                <>
                                  <Check className="w-5 h-5" />{" "}
                                  <span>Correct! +{riddle.points} points</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-5 h-5" />{" "}
                                  <span>Not quite right. Try again!</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Riddles;
