import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Settings,
  Target,
  Zap,
  Brain,
  Sparkles,
} from "lucide-react";
import { fetchQuestions, shuffleArray, decodeHTML } from "../services/quizApi";
import {
  getCustomQuestions,
  hasCustomQuestions,
} from "../data/customQuestions";
import { supabase } from "../services/supabase";

// Fallback questions - always available
const FALLBACK_QUESTIONS = [
  {
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
    category: "General Knowledge",
  },
  {
    question: "Which planet is known as the Red Planet?",
    correct_answer: "Mars",
    incorrect_answers: ["Venus", "Jupiter", "Saturn"],
    category: "General Knowledge",
  },
  {
    question: "What is the largest ocean on Earth?",
    correct_answer: "Pacific Ocean",
    incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    category: "General Knowledge",
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [questionCount, setQuestionCount] = useState(15);
  const [user, setUser] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(Date.now());

  useEffect(() => {
    const storedCategory = sessionStorage.getItem("selectedCategory");
    if (storedCategory) {
      const category = JSON.parse(storedCategory);
      setCategoryInfo(category);
      setQuestionCount(category.count || 15);
    } else {
      setCategoryInfo({ id: 9, name: "General Knowledge" });
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const loadQuestions = async (diff) => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setShowDifficultySelect(false);
    setSelectedDifficulty(diff);
    setDifficulty(diff);
    setQuizStartTime(Date.now());

    try {
      const storedCategory = sessionStorage.getItem("selectedCategory");
      let categoryId = null;
      let categoryName = "General Knowledge";
      let count = 15;
      let isCustom = false;

      if (storedCategory) {
        const category = JSON.parse(storedCategory);
        categoryId = category.id;
        categoryName = category.name;
        count = category.count || 15;
        setCategoryInfo(category);
      }

      let fetchedQuestions = [];

      // Check if it's a custom category
      if (typeof categoryId === "string") {
        const customQ = getCustomQuestions(categoryId, count);
        if (customQ.length > 0) {
          fetchedQuestions = customQ.map((q) => ({
            ...q,
            shuffledOptions: shuffleArray([
              q.correct_answer,
              ...q.incorrect_answers,
            ]),
          }));
          isCustom = true;
        }
      }

      // If no custom questions, try API
      if (fetchedQuestions.length === 0) {
        try {
          const apiQuestions = await fetchQuestions(
            count,
            categoryId,
            diff,
            "multiple",
          );
          if (apiQuestions && apiQuestions.length > 0) {
            fetchedQuestions = apiQuestions.map((q) => ({
              ...q,
              shuffledOptions: shuffleArray([
                q.correct_answer,
                ...q.incorrect_answers,
              ]),
            }));
          }
        } catch (apiError) {
          console.error("API fetch failed:", apiError);
        }
      }

      // If still no questions, use fallback
      if (fetchedQuestions.length === 0) {
        const fallback = FALLBACK_QUESTIONS.slice(
          0,
          Math.min(count, FALLBACK_QUESTIONS.length),
        );
        fetchedQuestions = fallback.map((q) => ({
          ...q,
          shuffledOptions: shuffleArray([
            q.correct_answer,
            ...q.incorrect_answers,
          ]),
        }));
      }

      // Always have questions
      if (fetchedQuestions.length === 0) {
        fetchedQuestions = [
          {
            question: "What is the capital of knowledge?",
            correct_answer: "Learning",
            incorrect_answers: ["Forgetting", "Sleeping", "Watching"],
            category: "General Knowledge",
            shuffledOptions: ["Learning", "Forgetting", "Sleeping", "Watching"],
          },
        ];
      }

      setQuestions(fetchedQuestions);
      toast.success(`${fetchedQuestions.length} questions loaded!`, {
        icon: "✅",
        position: "top-right",
        autoClose: 1200,
      });
      setTimeLeft(30);
    } catch (error) {
      console.error("Error loading questions:", error);
      const fallback = FALLBACK_QUESTIONS.slice(
        0,
        Math.min(questionCount || 15, FALLBACK_QUESTIONS.length),
      );
      const fallbackQuestions = fallback.map((q) => ({
        ...q,
        shuffledOptions: shuffleArray([
          q.correct_answer,
          ...q.incorrect_answers,
        ]),
      }));
      setQuestions(fallbackQuestions);
      toast.info("Using general knowledge questions", {
        position: "top-right",
        autoClose: 1500,
      });
      setTimeLeft(30);
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (
      loading ||
      quizComplete ||
      questions.length === 0 ||
      showDifficultySelect
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswered) handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    currentIndex,
    loading,
    quizComplete,
    isAnswered,
    questions.length,
    showDifficultySelect,
  ]);

  const handleTimeout = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      toast.warning("⏰ Time's up!", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => handleNext(), 1200);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setAnswers((prev) => ({ ...prev, [currentIndex]: answer }));

    const isCorrect = answer === questions[currentIndex].correct_answer;
    if (isCorrect) {
      toast.success("✅ Correct!", { position: "top-right", autoClose: 800 });
    } else {
      toast.error(`❌ Answer: ${questions[currentIndex].correct_answer}`, {
        position: "top-right",
        autoClose: 1200,
      });
    }

    setTimeout(() => handleNext(), 1200);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    }
  };

  const finishQuiz = async () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) correct++;
    });

    const percentage = Math.round((correct / questions.length) * 100);
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

    console.log(
      `📊 Results: ${correct}/${questions.length} correct = ${percentage}%`,
    );

    toast.success(`🎉 Score: ${percentage}%`, {
      position: "top-right",
      autoClose: 1500,
    });

    if (user) {
      try {
        const quizData = {
          user_id: user.id,
          category: categoryInfo?.name || "General Knowledge",
          score: percentage,
          total_questions: questions.length,
          percentage: parseFloat(percentage.toFixed(2)),
          time_taken: timeTaken,
          answers: answers,
        };

        console.log("📊 Saving quiz data:", quizData);

        const { data: quizResult, error: quizError } = await supabase
          .from("quiz_results")
          .insert(quizData)
          .select();

        if (quizError) {
          console.error("❌ Error saving quiz:", quizError);
          toast.error("Failed to save results: " + quizError.message);
          return;
        }

        console.log("✅ Quiz saved with score:", percentage);
        toast.success("Results saved! 🎉");

        try {
          const username =
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User";

          const { data: existingEntry, error: checkError } = await supabase
            .from("leaderboard")
            .select("score")
            .eq("user_id", user.id)
            .maybeSingle();

          if (existingEntry) {
            if (percentage > existingEntry.score) {
              const { data: updateData, error: updateError } = await supabase
                .from("leaderboard")
                .update({
                  score: percentage,
                  username: username,
                  category: categoryInfo?.name || "General Knowledge",
                })
                .eq("user_id", user.id)
                .select();

              if (updateError) {
                console.error("❌ Leaderboard update error:", updateError);
              } else {
                console.log("✅ Leaderboard updated to:", percentage);
                toast.success("Leaderboard updated! 🏆");
              }
            } else {
              console.log("📊 Keeping best score:", existingEntry.score);
              toast.info("Your best score is already higher! 💪");
            }
          } else {
            const { data: insertData, error: insertError } = await supabase
              .from("leaderboard")
              .insert({
                user_id: user.id,
                username: username,
                score: percentage,
                category: categoryInfo?.name || "General Knowledge",
              })
              .select();

            if (insertError) {
              console.error("❌ Leaderboard insert error:", insertError);
            } else {
              console.log("✅ Leaderboard inserted with score:", percentage);
              toast.success("Leaderboard updated! 🏆");
            }
          }
        } catch (lbError) {
          console.error("❌ Leaderboard error:", lbError);
        }
      } catch (error) {
        console.error("❌ Save error:", error);
        toast.error("Error saving results");
      }
    } else {
      console.log("⚠️ User not logged in, results not saved");
      toast.warning("Please log in to save results");
    }

    const resultData = {
      score: percentage,
      correct,
      total: questions.length,
      answers,
      questions,
      category: categoryInfo?.name || "General Knowledge",
      difficulty: difficulty || "medium",
      timestamp: new Date().toISOString(),
    };

    sessionStorage.setItem("quizResults", JSON.stringify(resultData));
    setQuizComplete(true);

    setTimeout(() => navigate("/results"), 1200);
  };

  const handleGoBack = () => {
    navigate('/categories');
  };

  const handleRetry = () => {
    setShowDifficultySelect(true);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setQuizComplete(false);
    setSelectedDifficulty(null);
  };

  // ============================================
  // DIFFICULTY SELECTION SCREEN - RESPONSIVE
  // ============================================
  if (showDifficultySelect) {
    const difficulties = [
      {
        id: "easy",
        label: "Easy",
        icon: "🌱",
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        desc: "Perfect for beginners",
      },
      {
        id: "medium",
        label: "Medium",
        icon: "⚡",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        desc: "For intermediate learners",
      },
      {
        id: "hard",
        label: "Hard",
        icon: "🔥",
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        desc: "Challenge yourself!",
      },
    ];

    const selectedCount = questionCount || 15;

    return (
      <div className="max-w-md mx-auto px-4 sm:px-0">
        <div className="glass-card p-4 sm:p-8 text-center">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-[#7c3aed]" />
              <span className="text-xs sm:text-sm text-gray-400">Quiz</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {categoryInfo?.name || "General Knowledge"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Choose your difficulty</p>
            <p className="text-xs text-gray-500 mt-1">
              {selectedCount} questions
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {difficulties.map((diff) => (
              <motion.button
                key={diff.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadQuestions(diff.id)}
                disabled={loading}
                className={`w-full p-3 sm:p-4 rounded-xl ${diff.bg} border ${diff.border} hover:border-[#7c3aed]/50 transition-all flex items-center justify-between group ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{diff.icon}</span>
                  <div className="text-left">
                    <div className={`font-semibold text-sm sm:text-base ${diff.color}`}>
                      {diff.label}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500">{diff.desc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] sm:text-xs text-gray-500">
                    {selectedCount} questions
                  </div>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 group-hover:text-[#7c3aed] transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>

          <button
            onClick={handleGoBack}
            className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Back to Categories
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#7c3aed] animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-xs sm:text-sm">
            Loading {difficulty} questions...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // QUIZ ACTIVE - RESPONSIVE
  // ============================================
  if (questions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 max-w-md mx-auto px-4">
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-white">No Questions</h2>
        <p className="text-gray-400 text-sm sm:text-base mt-2">Please try again.</p>
        <button
          onClick={handleRetry}
          className="btn-primary mt-4 sm:mt-6 flex items-center gap-2 mx-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const options = currentQuestion?.shuffledOptions || [];

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4">
      {/* Header - Responsive */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
        <button
          onClick={handleGoBack}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Exit
        </button>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[80px] sm:max-w-none">
            {categoryInfo?.name}
          </span>
          <span
            className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
              difficulty === "easy"
                ? "bg-green-500/20 text-green-400"
                : difficulty === "medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
            }`}
          >
            {difficulty}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500">
            {questions.length} Qs
          </span>
        </div>
      </div>

      {/* Progress Card - Responsive */}
      <div className="glass-card p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-gray-400">
            {currentIndex + 1} / {questions.length}
          </span>
          <motion.div
            className={`flex items-center gap-1 text-xs sm:text-sm ${timeLeft <= 10 ? "text-red-400" : "text-[#00C9A7]"}`}
            animate={timeLeft <= 10 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-sm sm:text-base">{timeLeft}s</span>
          </motion.div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card - Responsive */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card p-4 sm:p-6 mb-4 sm:mb-6"
      >
        <h2 className="text-base sm:text-lg text-white font-medium mb-4 sm:mb-5 leading-relaxed">
          {decodeHTML(currentQuestion?.question)}
        </h2>

        <div className="space-y-2 sm:space-y-2.5">
          {options.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === currentQuestion.correct_answer;
            const showCorrect = isAnswered && isCorrect;
            const showWrong = isAnswered && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => handleAnswerSelect(answer)}
                disabled={isAnswered}
                className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-200 text-xs sm:text-sm
                  ${isAnswered ? "cursor-default" : "hover:bg-white/10 cursor-pointer"}
                  ${isSelected && !isAnswered ? "bg-[#7c3aed]/30 border border-[#7c3aed] text-white" : ""}
                  ${showCorrect ? "bg-[#00C9A7]/30 border border-[#00C9A7] text-white" : ""}
                  ${showWrong ? "bg-red-500/30 border border-red-500 text-white" : ""}
                  ${!isSelected && !isAnswered ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent" : ""}
                `}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm break-words">{decodeHTML(answer)}</span>
                  {isAnswered && (
                    <span className="flex-shrink-0">
                      {isCorrect && (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C9A7]" />
                      )}
                      {isSelected && !isCorrect && (
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      )}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation - Responsive */}
      <div className="flex justify-between gap-3 sm:gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Back
        </button>
        <span className="text-[10px] sm:text-xs text-gray-500 flex items-center">
          {isAnswered ? "✓" : "Select an answer"}
        </span>
      </div>
    </div>
  );
};

export default Quiz;