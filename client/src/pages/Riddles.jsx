import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Puzzle,
  Lightbulb,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  Brain,
  Trophy,
  Zap,
  Sparkles,
  RefreshCw,
  Clock,
  Award,
  Target,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Riddles = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [riddles, setRiddles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [riddleOfTheDay, setRiddleOfTheDay] = useState(null);
  const [showDailyAnswer, setShowDailyAnswer] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [totalRiddles, setTotalRiddles] = useState(0);
  const [solvedRiddles, setSolvedRiddles] = useState(0);

  // Sample riddles data (you can replace with your database)
  const riddlesData = [
    {
      id: 1,
      riddle:
        "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      answer: "An echo",
      category: "Nature",
      difficulty: "Easy",
    },
    {
      id: 2,
      riddle: "The more of me you take, the more you leave behind. What am I?",
      answer: "Footsteps",
      category: "Logic",
      difficulty: "Easy",
    },
    {
      id: 3,
      riddle: "What has keys but can't open locks?",
      answer: "A piano",
      category: "Music",
      difficulty: "Easy",
    },
    {
      id: 4,
      riddle: "What gets wetter as it dries?",
      answer: "A towel",
      category: "Everyday",
      difficulty: "Medium",
    },
    {
      id: 5,
      riddle: "What has a neck but no head?",
      answer: "A bottle",
      category: "Everyday",
      difficulty: "Easy",
    },
    {
      id: 6,
      riddle: "What has to be broken before you can use it?",
      answer: "An egg",
      category: "Food",
      difficulty: "Easy",
    },
    {
      id: 7,
      riddle: "I'm tall when I'm young, and short when I'm old. What am I?",
      answer: "A candle",
      category: "Everyday",
      difficulty: "Medium",
    },
    {
      id: 8,
      riddle:
        "What can travel around the world while staying in the same corner?",
      answer: "A stamp",
      category: "Logic",
      difficulty: "Medium",
    },
    {
      id: 9,
      riddle: "What has hands but can't clap?",
      answer: "A clock",
      category: "Everyday",
      difficulty: "Easy",
    },
    {
      id: 10,
      riddle:
        "What has cities, but no houses; forests, but no trees; and water, but no fish?",
      answer: "A map",
      category: "Geography",
      difficulty: "Medium",
    },
  ];

  useEffect(() => {
    loadRiddles();
    loadUserProgress();
  }, []);

  const loadRiddles = async () => {
    setLoading(true);
    try {
      // Try to get riddles from database first
      const { data, error } = await supabase
        .from("riddles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setRiddles(data);
        setTotalRiddles(data.length);

        // Set riddle of the day (first one)
        if (data.length > 0) {
          const today = new Date().toISOString().split("T")[0];
          const dailyRiddle = data.find((r) => r.date === today) || data[0];
          setRiddleOfTheDay(dailyRiddle);
        }
      } else {
        // Use sample data
        setRiddles(riddlesData);
        setTotalRiddles(riddlesData.length);
        setRiddleOfTheDay(riddlesData[0]);
      }
    } catch (error) {
      console.error("Error loading riddles:", error);
      // Fallback to sample data
      setRiddles(riddlesData);
      setTotalRiddles(riddlesData.length);
      setRiddleOfTheDay(riddlesData[0]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from("riddle_history")
        .select("*")
        .eq("user_id", currentUser.id);

      if (!error && data) {
        setSolvedRiddles(data.filter((r) => r.solved).length);
        setScore(data.filter((r) => r.solved).length * 10);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setAttempted((prev) => prev + 1);
  };

  const handleSolved = async () => {
    if (isSolved) return;

    setIsSolved(true);
    setScore((prev) => prev + 10);
    setSolvedRiddles((prev) => prev + 1);

    // Save to database
    if (currentUser) {
      try {
        await supabase.from("riddle_history").insert({
          user_id: currentUser.id,
          riddle_id: riddles[currentIndex]?.id,
          solved: true,
          solved_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }

    toast.success("🎉 Riddle solved! +10 points");
  };

  const nextRiddle = () => {
    setShowAnswer(false);
    setIsSolved(false);
    setCurrentIndex((prev) => (prev + 1) % riddles.length);
  };

  const prevRiddle = () => {
    setShowAnswer(false);
    setIsSolved(false);
    setCurrentIndex((prev) => (prev - 1 + riddles.length) % riddles.length);
  };

  const currentRiddle = riddles[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 px-3 sm:px-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Puzzle className="w-7 h-7 text-[#7c3aed]" />
            Riddles
          </h1>
          <p className="text-gray-400 text-sm">
            Challenge your brain with these riddles
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">
            {totalRiddles}
          </div>
          <div className="text-xs text-gray-400">Total Riddles</div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-400">
            {solvedRiddles}
          </div>
          <div className="text-xs text-gray-400">Solved</div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-yellow-400">
            {score}
          </div>
          <div className="text-xs text-gray-400">Points</div>
        </div>
        <div className="glass-card p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-[#7c3aed]">
            {attempted}
          </div>
          <div className="text-xs text-gray-400">Attempted</div>
        </div>
      </div>

      {/* Riddle of the Day */}
      {riddleOfTheDay && (
        <div className="glass-card p-4 sm:p-6 bg-gradient-to-r from-[#7c3aed]/10 to-[#8B5CF6]/10 border border-[#7c3aed]/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold text-white">Riddle of the Day</h2>
          </div>
          <p className="text-gray-200 text-base sm:text-lg font-medium">
            {riddleOfTheDay.riddle}
          </p>
          <button
            onClick={() => setShowDailyAnswer(!showDailyAnswer)}
            className="mt-3 text-[#7c3aed] hover:text-[#8B5CF6] text-sm transition-colors"
          >
            {showDailyAnswer ? "Hide Answer" : "Show Answer"}
          </button>
          {showDailyAnswer && (
            <p className="text-gray-400 text-sm mt-2">
              Answer: {riddleOfTheDay.answer}
            </p>
          )}
        </div>
      )}

      {/* Main Riddle */}
      {currentRiddle && (
        <div className="glass-card p-5 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                Riddle {currentIndex + 1} of {riddles.length}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  currentRiddle.difficulty === "Easy"
                    ? "bg-green-500/20 text-green-400"
                    : currentRiddle.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                }`}
              >
                {currentRiddle.difficulty || "Medium"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevRiddle}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={nextRiddle}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 sm:p-6">
              <p className="text-white text-base sm:text-lg md:text-xl font-medium">
                {currentRiddle.riddle}
              </p>
              {currentRiddle.category && (
                <span className="text-xs text-gray-500 mt-2 inline-block">
                  Category: {currentRiddle.category}
                </span>
              )}
            </div>

            {!showAnswer ? (
              <button
                onClick={handleShowAnswer}
                className="w-full py-3 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Show Answer
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-[#7c3aed]/10 rounded-lg p-4 border border-[#7c3aed]/20">
                  <p className="text-gray-300">
                    <span className="text-[#7c3aed] font-medium">Answer:</span>{" "}
                    {currentRiddle.answer}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSolved}
                    disabled={isSolved}
                    className={`flex-1 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isSolved
                        ? "bg-green-500/20 text-green-400 cursor-default"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isSolved ? "Solved! ✓" : "I Solved It!"}
                  </button>
                  <button
                    onClick={() => {
                      setShowAnswer(false);
                      nextRiddle();
                    }}
                    className="flex-1 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                    Next Riddle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Riddles;
