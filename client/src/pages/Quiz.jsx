import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
  X,
  Loader2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Brain,
  Sparkles,
  SkipForward,
  Flame,
  Award,
} from "lucide-react";
import { fetchQuestions, shuffleArray, decodeHTML } from "../services/quizApi";
import { getCustomQuestions } from "../data/customQuestions";
import { supabase } from "../services/supabase";
import { generateQuestionsWithGroq } from "../services/groqService";
import { sendEmail, emailTemplates } from "../services/emailService";

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

const TIME_OPTIONS = [
  { value: 10, label: "10s" },
  { value: 20, label: "20s" },
  { value: 30, label: "30s" },
  { value: 45, label: "45s" },
  { value: 60, label: "60s" },
  { value: 90, label: "90s" },
  { value: 120, label: "2min" },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedTimePerQuestion, setSelectedTimePerQuestion] = useState(30);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [showTimeSelect, setShowTimeSelect] = useState(false);
  const [questionCount, setQuestionCount] = useState(15);
  const [user, setUser] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [isFinishing, setIsFinishing] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Combo System
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [comboBonus, setComboBonus] = useState(0);
  const [showComboCelebration, setShowComboCelebration] = useState(false);
  const [comboCelebrationText, setComboCelebrationText] = useState("");
  const [comboFadeTimer, setComboFadeTimer] = useState(null);

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
      console.log("✅ User loaded:", data.user?.id);
    });
  }, []);

  // Auto-fade combo after 30 seconds
  useEffect(() => {
    if (combo >= 2) {
      // Clear any existing timer
      if (comboFadeTimer) {
        clearTimeout(comboFadeTimer);
      }
      // Set new timer to fade after 30 seconds
      const timer = setTimeout(() => {
        setShowComboCelebration(false);
      }, 30000);
      setComboFadeTimer(timer);
    }
    return () => {
      if (comboFadeTimer) {
        clearTimeout(comboFadeTimer);
      }
    };
  }, [combo, showComboCelebration]);

  const loadQuestions = async (diff) => {
    setLoading(true);
    setQuestions([]);
    setShowDifficultySelect(false);
    setShowTimeSelect(true);
    setDifficulty(diff);
    setQuizStartTime(Date.now());
    setTimerStarted(false);
    setCombo(0);
    setMaxCombo(0);
    setComboMultiplier(1);
    setComboBonus(0);
    setShowComboCelebration(false);

    try {
      const storedCategory = sessionStorage.getItem("selectedCategory");
      let categoryName = "General Knowledge";
      let count = 15;
      let categoryId = null;

      if (storedCategory) {
        const category = JSON.parse(storedCategory);
        categoryId = category.id;
        categoryName = category.name;
        count = category.count || 15;
        setCategoryInfo(category);
      }

      let fetchedQuestions = [];

      try {
        const groqQuestions = await generateQuestionsWithGroq(
          categoryName,
          count,
          diff,
        );
        if (groqQuestions && groqQuestions.length > 0) {
          fetchedQuestions = groqQuestions.map((q) => ({
            question: q.question,
            correct_answer: q.correct_answer,
            incorrect_answers: q.options
              ? q.options.filter((opt) => opt !== q.correct_answer)
              : [],
            category: categoryName,
            shuffledOptions: q.options
              ? shuffleArray(q.options)
              : shuffleArray([q.correct_answer, ...q.incorrect_answers]),
            explanation: q.explanation || "",
          }));
        }
      } catch (e) {
        console.warn("Groq failed:", e);
      }

      if (fetchedQuestions.length === 0 && typeof categoryId === "string") {
        try {
          const customQ = getCustomQuestions(categoryId, count);
          if (customQ && customQ.length > 0) {
            fetchedQuestions = customQ.map((q) => ({
              ...q,
              shuffledOptions: shuffleArray([
                q.correct_answer,
                ...q.incorrect_answers,
              ]),
            }));
          }
        } catch (e) {
          console.warn("Custom questions failed:", e);
        }
      }

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
        } catch (e) {
          console.warn("Trivia DB failed:", e);
        }
      }

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

      setQuestions(fetchedQuestions);
      setAnswers({});
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      loading ||
      quizComplete ||
      questions.length === 0 ||
      showDifficultySelect ||
      showTimeSelect ||
      isFinishing ||
      !timerStarted
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
    showTimeSelect,
    isFinishing,
    timerStarted,
  ]);

  const handleTimeout = () => {
    if (!isAnswered && !isFinishing) {
      setIsAnswered(true);
      const updatedAnswers = { ...answers, [currentIndex]: null };
      setAnswers(updatedAnswers);
      setCombo(0);
      setComboMultiplier(1);
      setShowComboCelebration(false);
      if (currentIndex === questions.length - 1) {
        setIsFinishing(true);
        setTimeout(() => finishQuiz(updatedAnswers), 800);
      } else {
        setTimeout(() => handleNext(updatedAnswers), 1000);
      }
    }
  };

  const startQuiz = () => {
    setShowTimeSelect(false);
    setTimerStarted(true);
    setTimeLeft(selectedTimePerQuestion);
    setQuizStartTime(Date.now());
    setCombo(0);
    setMaxCombo(0);
    setComboMultiplier(1);
    setComboBonus(0);
    setShowComboCelebration(false);
  };

  const updateCombo = (isCorrect) => {
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(Math.max(maxCombo, newCombo));

      let multiplier = 1;
      let celebrationText = "";

      // Start combo at 2 correct answers
      if (newCombo >= 10) {
        multiplier = 2.0;
        celebrationText = "🔥 LEGENDARY! 10x COMBO!";
      } else if (newCombo >= 8) {
        multiplier = 1.8;
        celebrationText = "⭐ AMAZING! 8x COMBO!";
      } else if (newCombo >= 5) {
        multiplier = 1.5;
        celebrationText = "🔥 ON FIRE! 5x COMBO!";
      } else if (newCombo >= 2) {
        multiplier = 1.2;
        celebrationText = "✨ COMBO! 2x!";
      }

      setComboMultiplier(multiplier);

      if (multiplier > 1) {
        const bonus = Math.floor(10 * multiplier);
        setComboBonus((prev) => prev + bonus);
      }

      // Show celebration at 2, 5, 8, 10
      if (newCombo === 2 || newCombo === 5 || newCombo === 8 || newCombo === 10) {
        setComboCelebrationText(celebrationText);
        setShowComboCelebration(true);
        // Clear existing timer
        if (comboFadeTimer) {
          clearTimeout(comboFadeTimer);
        }
      }

      return multiplier;
    } else {
      setCombo(0);
      setComboMultiplier(1);
      setShowComboCelebration(false);
      if (comboFadeTimer) {
        clearTimeout(comboFadeTimer);
      }
      return 1;
    }
  };

  const handleAnswerSelect = (answer) => {
    if (isFinishing) return;

    const updatedAnswers = { ...answers, [currentIndex]: answer };
    setAnswers(updatedAnswers);
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === questions[currentIndex]?.correct_answer;
    const multiplier = updateCombo(isCorrect);

    if (currentIndex === questions.length - 1) {
      setIsFinishing(true);
      setTimeout(() => finishQuiz(updatedAnswers), 1200);
    } else {
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        const nextAnswer = updatedAnswers[nextIndex];
        setSelectedAnswer(nextAnswer !== undefined ? nextAnswer : null);
        setIsAnswered(nextAnswer !== undefined);
        setTimeLeft(selectedTimePerQuestion);
      }, 800);
    }
  };

  const handleNext = (currentAnswers) => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      const existingAnswer = answers[nextIndex];
      setSelectedAnswer(existingAnswer !== undefined ? existingAnswer : null);
      setIsAnswered(existingAnswer !== undefined);
      setTimeLeft(selectedTimePerQuestion);
    } else {
      if (!isFinishing) {
        setIsFinishing(true);
        finishQuiz(currentAnswers || answers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      const existingAnswer = answers[prevIndex];
      setSelectedAnswer(existingAnswer !== undefined ? existingAnswer : null);
      setIsAnswered(existingAnswer !== undefined);
      setTimeLeft(selectedTimePerQuestion);
    }
  };

  const goToCurrent = () => {
    let firstUnanswered = -1;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === undefined) {
        firstUnanswered = i;
        break;
      }
    }
    if (firstUnanswered === -1) firstUnanswered = questions.length - 1;

    setCurrentIndex(firstUnanswered);
    const existingAnswer = answers[firstUnanswered];
    setSelectedAnswer(existingAnswer !== undefined ? existingAnswer : null);
    setIsAnswered(existingAnswer !== undefined);
    setTimeLeft(selectedTimePerQuestion);
  };

  const handleGoBack = () => navigate("/categories");
  
  const handleRetry = () => {
    setShowDifficultySelect(true);
    setShowTimeSelect(false);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setQuizComplete(false);
    setIsFinishing(false);
    setTimerStarted(false);
    setSaveError(null);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCombo(0);
    setMaxCombo(0);
    setComboMultiplier(1);
    setComboBonus(0);
    setShowComboCelebration(false);
    if (comboFadeTimer) {
      clearTimeout(comboFadeTimer);
    }
  };

  const finishQuiz = async (finalAnswers) => {
    if (quizComplete) return;

    const currentAnswers = finalAnswers || answers;
    const completedAnswers = { ...currentAnswers };
    for (let i = 0; i < questions.length; i++) {
      if (completedAnswers[i] === undefined) completedAnswers[i] = null;
    }

    let correct = 0;
    questions.forEach((q, i) => {
      if (completedAnswers[i] === q.correct_answer) correct++;
    });

    const percentage = Math.round((correct / questions.length) * 100);
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

    const basePoints = Math.floor(percentage / 10);
    const totalPoints = basePoints + comboBonus;

    const resultData = {
      score: percentage,
      correct,
      total: questions.length,
      answers: completedAnswers,
      questions: questions,
      category: categoryInfo?.name || "General Knowledge",
      difficulty: difficulty || "medium",
      timestamp: new Date().toISOString(),
      combo: {
        maxCombo: maxCombo,
        bonusPoints: comboBonus,
      },
    };
    sessionStorage.setItem("quizResults", JSON.stringify(resultData));

    if (user) {
      try {
        const quizData = {
          user_id: user.id,
          category: categoryInfo?.name || "General Knowledge",
          score: correct,
          total_questions: questions.length,
          percentage: parseFloat(percentage.toFixed(2)),
          time_taken: timeTaken,
          points: totalPoints,
          answers: completedAnswers,
          combo_bonus: comboBonus,
          max_combo: maxCombo,
        };

        const { data, error } = await supabase
          .from("quiz_results")
          .insert(quizData)
          .select();

        if (error) {
          console.error("❌ Error saving quiz:", error);
          setSaveError(error.message);
          return;
        }

        try {
          await sendEmail({
            to: user.email,
            subject: `📊 Your ${categoryInfo?.name || "Quiz"} Results`,
            html: emailTemplates.quizResults(
              user.user_metadata?.name || "User",
              categoryInfo?.name || "Quiz",
              percentage,
              totalPoints,
            ).html,
          });
          console.log("✅ Quiz result email sent");
        } catch (emailError) {
          console.error("❌ Quiz result email failed:", emailError);
        }

        try {
          const { data: userData } = await supabase
            .from("users")
            .select("stats")
            .eq("id", user.id)
            .single();

          const currentStats = userData?.stats || {};
          const totalQuizzes = (currentStats.total_quizzes || 0) + 1;
          const totalScore = (currentStats.total_score || 0) + percentage;
          const bestScore = Math.max(currentStats.best_score || 0, percentage);
          const averageScore = Math.round(totalScore / totalQuizzes);
          const totalPointsSum = (currentStats.total_points || 0) + totalPoints;
          const perfectScores = (currentStats.perfect_scores || 0) + (percentage === 100 ? 1 : 0);

          let streak = currentStats.streak || 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const lastQuizDate = currentStats.last_quiz_date
            ? new Date(currentStats.last_quiz_date)
            : null;
          if (lastQuizDate) {
            const lastDate = new Date(lastQuizDate);
            lastDate.setHours(0, 0, 0, 0);
            if (lastDate.getTime() === yesterday.getTime()) {
              streak = streak + 1;
            } else if (lastDate.getTime() === today.getTime()) {
              // Keep streak
            } else {
              streak = 1;
            }
          } else {
            streak = 1;
          }

          await supabase
            .from("users")
            .update({
              stats: {
                total_quizzes: totalQuizzes,
                total_score: totalScore,
                best_score: bestScore,
                average_score: averageScore,
                total_points: totalPointsSum,
                streak: streak,
                perfect_scores: perfectScores,
                last_quiz_date: new Date().toISOString(),
              },
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          console.log("✅ User stats updated");
        } catch (statsError) {
          console.error("❌ Error updating stats:", statsError);
        }
      } catch (error) {
        console.error("❌ Save error:", error);
        setSaveError(error.message);
      }
    } else {
      console.warn("⚠️ No user logged in, results not saved");
    }

    setQuizComplete(true);
    setIsFinishing(false);
    setTimeout(() => navigate("/results"), 1200);
  };

  // Difficulty Selection Screen
  if (showDifficultySelect) {
    const difficulties = [
      { id: "easy", label: "Easy", icon: "🌱", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", desc: "Perfect for beginners" },
      { id: "medium", label: "Medium", icon: "⚡", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", desc: "For intermediate learners" },
      { id: "hard", label: "Hard", icon: "🔥", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", desc: "Challenge yourself!" },
    ];

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto px-4 sm:px-0"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="glass-card p-4 sm:p-8 text-center"
        >
          <div className="mb-4 sm:mb-6">
            <motion.div 
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="flex items-center justify-center gap-2 mb-2"
            >
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-[#3B82F6]" />
              <span className="text-xs sm:text-sm text-gray-400">Quiz</span>
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {categoryInfo?.name || "General Knowledge"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Choose your difficulty</p>
            <p className="text-xs text-gray-500 mt-1">{questionCount} questions</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {difficulties.map((diff, index) => (
              <motion.button
                key={diff.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadQuestions(diff.id)}
                disabled={loading}
                className={`w-full p-3 sm:p-4 rounded-xl ${diff.bg} border ${diff.border} hover:border-blue-500/50 transition-all flex items-center justify-between group ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{diff.icon}</span>
                  <div className="text-left">
                    <div className={`font-semibold text-sm sm:text-base ${diff.color}`}>{diff.label}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">{diff.desc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] sm:text-xs text-gray-500">{questionCount} questions</div>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 group-hover:text-[#3B82F6] transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Back to Categories
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Time Selection Screen
  if (showTimeSelect) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto px-4 sm:px-0"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="glass-card p-4 sm:p-8 text-center"
        >
          <div className="mb-4 sm:mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="flex items-center justify-center gap-2 mb-2"
            >
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-[#3B82F6]" />
              <span className="text-xs sm:text-sm text-gray-400">Time per Question</span>
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Set Your Pace</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">How much time per question?</p>
            <p className="text-xs text-gray-500 mt-1">Time runs out = question failed</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {TIME_OPTIONS.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTimePerQuestion(option.value)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedTimePerQuestion === option.value
                    ? "border-blue-500 bg-blue-500/20 text-white"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
                }`}
              >
                <div className={`text-lg font-bold ${selectedTimePerQuestion === option.value ? "text-[#3B82F6]" : "text-gray-400"}`}>
                  {option.label}
                </div>
                <div className="text-[10px] text-gray-500">per question</div>
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowDifficultySelect(true); setShowTimeSelect(false); }}
              className="flex-1 btn-secondary py-2.5 sm:py-3 text-sm sm:text-base"
            >
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startQuiz}
              className="flex-1 btn-primary py-2.5 sm:py-3 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Start Quiz
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-4"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#3B82F6] mx-auto mb-3" />
          </motion.div>
          <p className="text-gray-400 text-xs sm:text-sm">Loading {difficulty} questions...</p>
        </div>
      </motion.div>
    );
  }

  // No Questions
  if (questions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 sm:py-12 max-w-md mx-auto px-4"
      >
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-teal-400 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-white">No Questions</h2>
        <p className="text-gray-400 text-sm sm:text-base mt-2">Please try again.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRetry}
          className="btn-primary mt-4 sm:mt-6 flex items-center gap-2 mx-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </motion.button>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const options = currentQuestion?.shuffledOptions || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-3 sm:px-4 relative"
    >
      {/* Combo Celebration - Floating on the Right */}
      <AnimatePresence>
        {showComboCelebration && combo >= 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-40"
          >
            <div className="glass-card p-4 border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm min-w-[120px] text-center">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-3xl mb-1"
              >
                🔥
              </motion.div>
              <div className="text-sm font-bold text-orange-400">{combo}x Combo</div>
              <div className="text-xs text-gray-400">{comboMultiplier.toFixed(1)}x multiplier</div>
              <div className="text-xs text-green-400 mt-1">+{Math.floor(10 * comboMultiplier)} pts</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Exit
        </motion.button>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[80px] sm:max-w-none">
            {categoryInfo?.name}
          </span>
          <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${difficulty === "easy" ? "bg-green-500/20 text-green-400" : difficulty === "medium" ? "bg-teal-500/20 text-teal-400" : "bg-red-500/20 text-red-400"}`}>
            {difficulty}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500">{questions.length} Qs</span>
          <span className="text-[10px] sm:text-xs text-gray-500">⏱ {selectedTimePerQuestion}s</span>
          <span className="text-[10px] sm:text-xs text-gray-500">{Object.keys(answers).length}/{questions.length} answered</span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-3 sm:p-4 mb-4 sm:mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-gray-400">{currentIndex + 1} / {questions.length}</span>
          <motion.div
            className={`flex items-center gap-1 text-xs sm:text-sm ${timeLeft <= 5 ? "text-red-400" : timeLeft <= 10 ? "text-orange-400" : "text-[#00C9A7]"}`}
            animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-sm sm:text-base">{timeLeft}s</span>
          </motion.div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-teal-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex gap-1 mt-2 justify-center flex-wrap">
          {questions.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-blue-500 scale-125"
                  : answers[i] !== undefined
                  ? "bg-green-500"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Question */}
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
            const showCorrect = isAnswered && isCorrect && isSelected;
            const showWrong = isAnswered && isSelected && !isCorrect;
            const hasAnswer = answers[currentIndex] !== undefined;
            const wasAnswered = hasAnswer && answers[currentIndex] === answer;

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={!isAnswered && !isFinishing ? { scale: 1.02 } : {}}
                whileTap={!isAnswered && !isFinishing ? { scale: 0.98 } : {}}
                onClick={() => {
                  if (!isFinishing) {
                    handleAnswerSelect(answer);
                  }
                }}
                disabled={isFinishing}
                className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-200 text-xs sm:text-sm
                  ${isFinishing ? "cursor-default" : "hover:bg-white/15 cursor-pointer"}
                  ${isSelected && !isAnswered ? "bg-blue-500/30 border border-blue-500 text-white" : ""}
                  ${showCorrect ? "bg-[#00C9A7]/30 border border-[#00C9A7] text-white" : ""}
                  ${showWrong ? "bg-red-500/30 border border-red-500 text-white" : ""}
                  ${wasAnswered && !isSelected && hasAnswer && !isAnswered ? "bg-blue-500/20 border border-blue-500/30 text-white" : ""}
                  ${!isSelected && !wasAnswered && !hasAnswer ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent" : ""}
                  ${!isSelected && wasAnswered && isAnswered ? "bg-white/5 border border-white/10 text-gray-400" : ""}
                `}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm break-words">
                    {decodeHTML(answer)}
                  </span>
                  {isAnswered && isSelected && (
                    <span className="flex-shrink-0">
                      {isCorrect ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C9A7]" />
                      ) : (
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      )}
                    </span>
                  )}
                  {!isAnswered && wasAnswered && hasAnswer && (
                    <span className="flex-shrink-0 text-[#3B82F6] text-xs">✓</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between gap-3 sm:gap-4 flex-wrap"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToCurrent}
          className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors bg-blue-500/20 text-[#3B82F6] hover:bg-blue-500/30 border border-blue-500/30"
        >
          <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" /> Go to Current
        </motion.button>

        <span className="text-[10px] sm:text-xs text-gray-500 flex items-center">
          {isAnswered && answers[currentIndex] !== undefined
            ? "✓ Answered"
            : answers[currentIndex] !== undefined
            ? "📝 Answer saved"
            : "Select an answer"}
        </span>
      </motion.div>

      {saveError && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs"
        >
          ⚠️ Error saving results: {saveError}. Please try again.
        </motion.div>
      )}
    </motion.div>
  );
};

export default Quiz;
