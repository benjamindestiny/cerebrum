import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Puzzle,
  Brain,
  Lightbulb,
  Sparkles,
  Trophy,
  Zap,
  Check,
  X,
  Send,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { riddles, getDailyRiddle, getRandomRiddle } from "../data/riddles";

const STORAGE_KEY = "cerebrum_riddle_progress";

const getStoredProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Error reading local riddle progress:", error);
    return [];
  }
};

const saveStoredProgress = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving local riddle progress:", error);
  }
};

const mergeProgressEntries = (remoteEntries = [], localEntries = []) => {
  const normalizedRemote = (remoteEntries || []).map((entry) => ({
    id: entry.riddle_id || entry.id,
    solved: Boolean(entry.solved),
    attempts: entry.attempts || 0,
    solvedAt: entry.solved_at || entry.solvedAt || null,
    points: entry.points || 0,
    streak: entry.streak || 0,
  }));

  const localMap = new Map(
    (localEntries || []).map((entry) => [entry.id || entry.riddle_id, entry]),
  );

  const merged = [...normalizedRemote];
  localEntries.forEach((entry) => {
    const id = entry.id || entry.riddle_id;
    if (!id) return;

    const existing = merged.find((item) => item.id === id);
    if (!existing) {
      merged.push({
        id,
        solved: Boolean(entry.solved),
        attempts: entry.attempts || 0,
        solvedAt: entry.solvedAt || entry.solved_at || null,
        points: entry.points || 0,
        streak: entry.streak || 0,
      });
      return;
    }

    existing.solved = Boolean(existing.solved || entry.solved);
    existing.attempts = Math.max(existing.attempts, entry.attempts || 0);
    existing.solvedAt =
      existing.solvedAt || entry.solvedAt || entry.solved_at || null;
    existing.points = existing.points || entry.points || 0;
    existing.streak = existing.streak || entry.streak || 0;
  });

  return merged;
};

const applyProgressEntries = (
  entries,
  setSolvedCountState,
  setPointsState,
  setHistoryState,
  setStreakState,
) => {
  const normalized = (entries || []).map((entry) => ({
    id: entry.riddle_id || entry.id,
    solved: Boolean(entry.solved),
    attempts: entry.attempts || 0,
    solvedAt: entry.solved_at || entry.solvedAt || null,
    points: entry.points || 0,
    streak: entry.streak || 0,
  }));

  const solved = normalized.filter((entry) => entry.solved).length;
  const totalPoints = normalized.reduce(
    (sum, entry) => sum + (entry.solved ? entry.points : 0),
    0,
  );
  const latestStreak = normalized.reduce(
    (best, entry) => Math.max(best, entry.streak || 0),
    0,
  );

  setSolvedCountState(solved);
  setPointsState(totalPoints);
  setHistoryState(
    normalized.map((entry) => ({
      id: entry.id,
      solved: entry.solved,
      attempts: entry.attempts,
      solvedAt: entry.solvedAt,
    })),
  );
  setStreakState(latestStreak);
};

const Riddles = () => {
  const navigate = useNavigate();
  const [currentRiddle, setCurrentRiddle] = useState(null);
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeRiddles = async () => {
      const authenticatedUser = await loadUser();
      const daily = getDailyRiddle();
      setCurrentRiddle(daily);
      await loadRiddleProgress(authenticatedUser);
      setIsLoading(false);
    };

    initializeRiddles();
  }, []);

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    return user;
  };

  const loadRiddleProgress = async (activeUser = user) => {
    const localProgress = getStoredProgress();

    try {
      if (activeUser) {
        const { data, error } = await supabase
          .from("riddle_progress")
          .select("*")
          .eq("user_id", activeUser.id);

        if (!error && data) {
          const mergedProgress = mergeProgressEntries(data, localProgress);
          applyProgressEntries(
            mergedProgress,
            setSolvedCount,
            setPoints,
            setHistory,
            setStreak,
          );
          return;
        }

        console.warn(
          "Supabase riddle progress unavailable, falling back to local storage:",
          error,
        );
      }
    } catch (error) {
      console.warn(
        "Error loading remote riddle progress, falling back to local storage:",
        error,
      );
    }

    if (localProgress.length > 0) {
      applyProgressEntries(
        localProgress,
        setSolvedCount,
        setPoints,
        setHistory,
        setStreak,
      );
    }
  };

  const handleSolveRiddle = async (riddleId, userAnswer) => {
    const riddle = riddles.find((r) => r.id === riddleId);
    if (!riddle) return;

    const isCorrectAnswer =
      userAnswer.toLowerCase().trim() === riddle.answer.toLowerCase().trim();

    try {
      let saveError = null;
      const existingProgress = getStoredProgress();
      const existingEntry = existingProgress.find(
        (entry) => entry.id === riddleId,
      );
      const earnedPoints =
        isCorrectAnswer && !existingEntry?.solved ? riddle.points || 10 : 0;
      const nextStreak = isCorrectAnswer ? (existingEntry?.streak || 0) + 1 : 0;

      if (user) {
        const { error } = await supabase.from("riddle_progress").upsert({
          user_id: user.id,
          riddle_id: riddleId,
          solved: isCorrectAnswer || Boolean(existingEntry?.solved),
          attempts: (existingEntry?.attempts || 0) + 1,
          solved_at:
            isCorrectAnswer || existingEntry?.solved
              ? new Date().toISOString()
              : null,
        });

        saveError = error;
      }

      // Update local state immediately so the user sees progress even when cloud saving fails
      if (isCorrectAnswer) {
        setSolvedCount((prev) => prev + (existingEntry?.solved ? 0 : 1));
        setPoints((prev) => prev + earnedPoints);
        setStreak((prev) => prev + 1);
        toast.success(`🎉 Correct! +${riddle.points || 10} points`);
      } else {
        setStreak(0);
        toast.error("❌ Not quite right. Try again!");
      }

      const nextEntry = {
        id: riddleId,
        solved: isCorrectAnswer || Boolean(existingEntry?.solved),
        attempts: (existingEntry?.attempts || 0) + 1,
        solvedAt:
          isCorrectAnswer || existingEntry?.solved
            ? new Date().toISOString()
            : existingEntry?.solvedAt || null,
        points: existingEntry?.solved
          ? existingEntry?.points || 0
          : isCorrectAnswer
            ? riddle.points || 10
            : 0,
        streak: isCorrectAnswer ? nextStreak : 0,
      };
      const nextProgress = existingEntry
        ? existingProgress.map((entry) =>
            entry.id === riddleId ? nextEntry : entry,
          )
        : [...existingProgress, nextEntry];
      saveStoredProgress(nextProgress);

      if (saveError) {
        console.warn(
          "Cloud save failed, progress was stored locally:",
          saveError,
        );
      }

      if (user && (isCorrectAnswer || !existingEntry?.solved)) {
        try {
          const { data: profileRow, error: profileError } = await supabase
            .from("users")
            .select("stats")
            .eq("id", user.id)
            .maybeSingle();

          if (!profileError) {
            const currentStats = profileRow?.stats || {};
            const updatedStats = {
              ...currentStats,
              total_points: (currentStats.total_points || 0) + earnedPoints,
              streak: isCorrectAnswer ? (currentStats.streak || 0) + 1 : 0,
              riddles_solved:
                (currentStats.riddles_solved || 0) + (earnedPoints > 0 ? 1 : 0),
            };

            await supabase.from("users").upsert({
              id: user.id,
              stats: updatedStats,
              updated_at: new Date().toISOString(),
            });
          }
        } catch (statsError) {
          console.warn("Unable to sync riddle stats to profile:", statsError);
        }
      }

      setHistory((prev) => {
        const existing = prev.find((h) => h.id === riddleId);
        if (existing) {
          return prev.map((h) =>
            h.id === riddleId
              ? { ...h, solved: isCorrectAnswer, attempts: h.attempts + 1 }
              : h,
          );
        }
        return [
          ...prev,
          { id: riddleId, solved: isCorrectAnswer, attempts: 1 },
        ];
      });

      setResultMap((prev) => ({ ...prev, [riddleId]: isCorrectAnswer }));
      setShowAnswerMap((prev) => ({ ...prev, [riddleId]: true }));

      await loadRiddleProgress(user);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save progress");
    }
  };

  const loadRandomRiddle = () => {
    const random = getRandomRiddle();
    setCurrentRiddle(random);
    setAnswer("");
    setShowHint(false);
    setShowAnswer(false);
    setIsCorrect(null);
  };

  const toggleRiddle = (riddleId) => {
    setExpandedRiddle(expandedRiddle === riddleId ? null : riddleId);
  };

  const handleSubmitRiddle = (riddleId) => {
    const riddle = riddles.find((r) => r.id === riddleId);
    if (!riddle) return;

    const userAnswer = inputValues[riddleId]?.trim() || "";
    if (!userAnswer) {
      toast.warning("Please enter your answer!");
      return;
    }

    handleSolveRiddle(riddleId, userAnswer);
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

  const getAttemptCount = (riddleId) => {
    const entry = history.find((h) => h.id === riddleId);
    return entry?.attempts || 0;
  };

  const canShowHint = (riddleId) => {
    return getAttemptCount(riddleId) >= 2 && !isRiddleSolved(riddleId);
  };

  const canRevealAnswer = (riddleId) => {
    return getAttemptCount(riddleId) >= 3 && !isRiddleSolved(riddleId);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Puzzle className="w-8 h-8 text-[#7c3aed]" />
            Riddle Challenge
          </h1>
          <p className="text-gray-400 mt-1">
            Test your lateral thinking skills
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-[#7c3aed]">{solvedCount}</div>
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

      {/* Daily Riddle */}
      {currentRiddle && (
        <div className="glass-card p-6 bg-gradient-to-r from-[#7c3aed]/10 to-[#a78bfa]/10 border border-[#7c3aed]/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <span className="text-xs text-yellow-400 font-semibold">
                  ✨ RIDDLE OF THE DAY
                </span>
                <p className="text-white font-medium mt-1">
                  {currentRiddle.question}
                </p>
              </div>
            </div>
            <button
              onClick={loadRandomRiddle}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              title="New Riddle"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {isRiddleSolved(currentRiddle.id) ? (
            <div className="mt-4 p-3 bg-[#00C9A7]/10 border border-[#00C9A7]/20 rounded-lg">
              <p className="text-[#00C9A7] text-sm font-semibold">
                ✅ Riddle solved! Come back tomorrow for a new riddle.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full px-4 py-3 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
                    />
                    <button
                      onClick={() => {
                        if (!answer.trim()) {
                          toast.warning("Please enter your answer!");
                          return;
                        }
                        handleSolveRiddle(currentRiddle.id, answer);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!canShowHint(currentRiddle.id)) {
                        toast.info("Hint unlocks after 2 incorrect attempts.");
                        return;
                      }
                      setShowHint(!showHint);
                    }}
                    disabled={!canShowHint(currentRiddle.id)}
                    className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      canShowHint(currentRiddle.id)
                        ? "Show hint"
                        : "Hint unlocks after 2 incorrect attempts"
                    }
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showHint ? "Hide" : "Hint"}
                  </button>
                  <button
                    onClick={() => {
                      if (!canRevealAnswer(currentRiddle.id)) {
                        toast.info(
                          "Reveal unlocks after 3 incorrect attempts.",
                        );
                        return;
                      }
                      setShowAnswer(!showAnswer);
                    }}
                    disabled={!canRevealAnswer(currentRiddle.id)}
                    className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      canRevealAnswer(currentRiddle.id)
                        ? "Reveal answer"
                        : "Reveal unlocks after 3 incorrect attempts"
                    }
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
                    💡 {currentRiddle.hint}
                  </p>
                </div>
              )}
              {showAnswer && (
                <div className="mt-3 p-3 bg-[#00C9A7]/10 border border-[#00C9A7]/20 rounded-lg">
                  <p className="text-[#00C9A7] text-sm">
                    <span className="font-semibold">Answer:</span>{" "}
                    {currentRiddle.answer}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {currentRiddle.explanation}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* All Riddles */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7c3aed]" />
            All Riddles
          </h3>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#2D2D5E] rounded-lg border border-white/10 text-white text-sm focus:border-[#7c3aed] focus:outline-none"
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

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {getFilteredRiddles().map((riddle) => {
            const isSolved = isRiddleSolved(riddle.id);
            const isExpanded = expandedRiddle === riddle.id;

            return (
              <div
                key={riddle.id}
                className={`rounded-lg border transition-all ${
                  isSolved
                    ? "border-[#00C9A7]/30 bg-[#00C9A7]/5"
                    : "border-white/10 bg-white/5"
                } ${isExpanded ? "ring-1 ring-[#7c3aed]" : ""}`}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-white/5 transition-colors rounded-lg"
                  onClick={() => toggleRiddle(riddle.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
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

                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Type your answer..."
                              className="w-full px-4 py-3 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:outline-none"
                              value={inputValues[riddle.id] || ""}
                              onChange={(e) =>
                                setInputValues((prev) => ({
                                  ...prev,
                                  [riddle.id]: e.target.value,
                                }))
                              }
                            />
                            <button
                              onClick={() => handleSubmitRiddle(riddle.id)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-all"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (!canShowHint(riddle.id)) {
                                toast.info(
                                  "Hint unlocks after 2 incorrect attempts.",
                                );
                                return;
                              }
                              setShowHintMap((prev) => ({
                                ...prev,
                                [riddle.id]: !prev[riddle.id],
                              }));
                            }}
                            disabled={!canShowHint(riddle.id)}
                            className="btn-secondary text-sm px-3 py-2 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              canShowHint(riddle.id)
                                ? "Show hint"
                                : "Hint unlocks after 2 incorrect attempts"
                            }
                          >
                            <Lightbulb className="w-4 h-4" />
                            {showHintMap[riddle.id] ? "Hide" : "Hint"}
                          </button>
                          <button
                            onClick={() => {
                              if (!canRevealAnswer(riddle.id)) {
                                toast.info(
                                  "Reveal unlocks after 3 incorrect attempts.",
                                );
                                return;
                              }
                              setShowAnswerMap((prev) => ({
                                ...prev,
                                [riddle.id]: !prev[riddle.id],
                              }));
                            }}
                            disabled={!canRevealAnswer(riddle.id)}
                            className="btn-secondary text-sm px-3 py-2 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              canRevealAnswer(riddle.id)
                                ? "Reveal answer"
                                : "Reveal unlocks after 3 incorrect attempts"
                            }
                          >
                            {showAnswerMap[riddle.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                            {showAnswerMap[riddle.id] ? "Hide" : "Reveal"}
                          </button>
                        </div>
                      </div>

                      {showHintMap[riddle.id] && (
                        <div className="mt-3 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                          <p className="text-yellow-400 text-sm">
                            💡 {riddle.hint}
                          </p>
                        </div>
                      )}

                      {showAnswerMap[riddle.id] && (
                        <div className="mt-3 p-3 bg-[#00C9A7]/10 border border-[#00C9A7]/20 rounded-lg">
                          <p className="text-[#00C9A7] text-sm">
                            <span className="font-semibold">Answer:</span>{" "}
                            {riddle.answer}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {riddle.explanation}
                          </p>
                        </div>
                      )}

                      {resultMap[riddle.id] !== null && (
                        <div
                          className={`mt-3 p-3 rounded-lg border ${
                            resultMap[riddle.id]
                              ? "border-[#00C9A7]/30 bg-[#00C9A7]/5 text-[#00C9A7]"
                              : "border-red-400/30 bg-red-400/5 text-red-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {resultMap[riddle.id] ? (
                              <>
                                <Check className="w-5 h-5" /> Correct! +
                                {riddle.points} points
                              </>
                            ) : (
                              <>
                                <X className="w-5 h-5" /> Not quite right. Try
                                again!
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Riddles;
