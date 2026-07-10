import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import { generateQuestionsWithGroq } from "../services/groqService";

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

// Time options per question
const TIME_OPTIONS = [
  { value: 10, label: "10s", color: "text-red-400" },
  { value: 20, label: "20s", color: "text-orange-400" },
  { value: 30, label: "30s", color: "text-yellow-400" },
  { value: 45, label: "45s", color: "text-blue-400" },
  { value: 60, label: "60s", color: "text-green-400" },
  { value: 90, label: "90s", color: "text-purple-400" },
  { value: 120, label: "2 min", color: "text-indigo-400" },
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
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [questionCount, setQuestionCount] = useState(15);
  const [user, setUser] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [isFinishing, setIsFinishing] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
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
    setShowTimeSelect(true);
    setSelectedDifficulty(diff);
    setDifficulty(diff);
    setQuizStartTime(Date.now());
    setTimerStarted(false);

    try {
      const storedCategory = sessionStorage.getItem("selectedCategory");
      let categoryName = "General Knowledge";
      let count = 15;
      let categoryId = null;
      let isCustom = false;

      if (storedCategory) {
        const category = JSON.parse(storedCategory);
        categoryId = category.id;
        categoryName = category.name;
        count = category.count || 15;
        setCategoryInfo(category);
      }

      let fetchedQuestions = [];

      // Try Groq AI Generation
      try {
        console.log(
          `🎯 Generating ${count} questions about "${categoryName}" with Groq...`,
        );
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
          console.log(
            `✅ Generated ${fetchedQuestions.length} questions with Groq`,
          );
        }
      } catch (groqError) {
        console.warn("Groq generation failed:", groqError.message);
      }

      // Try Custom Questions
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
            isCustom = true;
            console.log(
              `✅ Loaded ${fetchedQuestions.length} custom questions`,
            );
          }
        } catch (customError) {
          console.warn("Custom questions failed:", customError.message);
        }
      }

      // Try Open Trivia DB API
      if (fetchedQuestions.length === 0) {
        try {
          console.log(`🔄 Fetching from Open Trivia DB...`);
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
            console.log(
              `✅ Loaded ${fetchedQuestions.length} questions from Trivia DB`,
            );
          }
        } catch (apiError) {
          console.warn("Trivia DB API failed:", apiError.message);
        }
      }

      // Fallback questions
      if (fetchedQuestions.length === 0) {
        console.log("📚 Using local fallback questions");
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

      // Ultimate fallback
      if (fetchedQuestions.length === 0) {
        fetchedQuestions = [
          {
            question: `What is the capital of knowledge?`,
            correct_answer: "Learning",
            incorrect_answers: ["Forgetting", "Sleeping", "Watching"],
            category: categoryName,
            shuffledOptions: ["Learning", "Forgetting", "Sleeping", "Watching"],
          },
        ];
      }

      setQuestions(fetchedQuestions);
      console.log(
        `✅ Final: ${fetchedQuestions.length} questions loaded for "${categoryName}"`,
      );
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
      console.log("⏰ Time's up! Question failed.");
      // Mark as failed (null answer)
      const updatedAnswers = { ...answers, [currentIndex]: null };
      setAnswers(updatedAnswers);
      // Check if it's the last question
      if (currentIndex === questions.length - 1) {
        setIsFinishing(true);
        setTimeout(() => {
          finishQuiz(updatedAnswers);
        }, 800);
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
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered || isFinishing) return;

    const updatedAnswers = { ...answers, [currentIndex]: answer };
    setAnswers(updatedAnswers);
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === questions[currentIndex].correct_answer;
    console.log(
      `${isCorrect ? "✅" : "❌"} Question ${currentIndex + 1}: ${isCorrect ? "Correct!" : "Wrong"}`,
    );

    if (currentIndex === questions.length - 1) {
      console.log("🏁 Last question answered! Finishing quiz...");
      setIsFinishing(true);
      setTimeout(() => {
        finishQuiz(updatedAnswers);
      }, 1200);
    } else {
      setTimeout(() => handleNext(updatedAnswers), 1200);
    }
  };

  const handleNext = (currentAnswers) => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer(answers[nextIndex] || null); // Highlight previous answer if exists
      setIsAnswered(answers[nextIndex] !== undefined);
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
      setSelectedAnswer(answers[prevIndex] || null); // Highlight previous answer
      setIsAnswered(answers[prevIndex] !== undefined);
      setTimeLeft(selectedTimePerQuestion);
    }
  };

  const handleGoBack = () => {
    navigate("/categories");
  };

  const handleRetry = () => {
    setShowDifficultySelect(true);
    setShowTimeSelect(false);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setQuizComplete(false);
    setSelectedDifficulty(null);
    setIsFinishing(false);
    setTimerStarted(false);
  };

  const finishQuiz = async (finalAnswers) => {
    if (quizComplete) {
      console.log("⚠️ Quiz already complete, skipping...");
      return;
    }

    const currentAnswers = finalAnswers || answers;
    const completedAnswers = { ...currentAnswers };
    for (let i = 0; i < questions.length; i++) {
      if (completedAnswers[i] === undefined) {
        completedAnswers[i] = null;
        console.log(`⚠️ Question ${i + 1} was not answered, marking as null`);
      }
    }

    console.log("📝 ALL ANSWERS:", completedAnswers);

    let correct = 0;
    questions.forEach((q, i) => {
      const userAnswer = completedAnswers[i];
      const isCorrect = userAnswer === q.correct_answer;
      console.log(
        `Q${i + 1}: User="${userAnswer}", Correct="${q.correct_answer}", Result=${isCorrect}`,
      );
      if (isCorrect) correct++;
    });

    const percentage = Math.round((correct / questions.length) * 100);
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

    console.log(
      `📊 Results: ${correct}/${questions.length} correct = ${percentage}%`,
    );

    // Save to session storage
    const resultData = {
      score: percentage,
      correct,
      total: questions.length,
      answers: completedAnswers,
      questions: questions,
      category: categoryInfo?.name || "General Knowledge",
      difficulty: difficulty || "medium",
      timestamp: new Date().toISOString(),
    };
    sessionStorage.setItem("quizResults", JSON.stringify(resultData));

    if (user) {
      try {
        const quizData = {
          user_id: user.id,
          category: categoryInfo?.name || "General Knowledge",
          score: correct,
          total_questions: questions.length,
          correct_answers: correct,
          percentage: parseFloat(percentage.toFixed(2)),
          time_taken: timeTaken,
          points: Math.floor(percentage / 10),
          answers: completedAnswers,
        };

        console.log("📊 Saving quiz data:", quizData);

        const { error: quizError } = await supabase
          .from("quiz_results")
          .insert(quizData);

        if (quizError) {
          console.error("❌ Error saving quiz:", quizError);
        } else {
          console.log("✅ Quiz saved with score:", percentage);
        }

        // Update user stats (same as before)
        // ... (keep the existing stats update code)
      } catch (error) {
        console.error("❌ Save error:", error);
      }
    }

    setQuizComplete(true);
    setIsFinishing(false);
    setTimeout(() => navigate("/results"), 1200);
  };

  // ============================================
  // DIFFICULTY SELECTION SCREEN
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
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Choose your difficulty
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {questionCount} questions
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
                    <div
                      className={`font-semibold text-sm sm:text-base ${diff.color}`}
                    >
                      {diff.label}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500">
                      {diff.desc}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] sm:text-xs text-gray-500">
                    {questionCount} questions
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
  // TIME SELECTION SCREEN
  // ============================================
  if (showTimeSelect) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-0">
        <div className="glass-card p-4 sm:p-8 text-center">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-[#7c3aed]" />
              <span className="text-xs sm:text-sm text-gray-400">
                Time per Question
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Set Your Pace
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              How much time per question?
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Time runs out = question failed
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {TIME_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTimePerQuestion(option.value)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedTimePerQuestion === option.value
                    ? "border-[#7c3aed] bg-[#7c3aed]/20 text-white"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
                }`}
              >
                <div
                  className={`text-lg font-bold ${selectedTimePerQuestion === option.value ? "text-[#7c3aed]" : option.color}`}
                >
                  {option.label}
                </div>
                <div className="text-[10px] text-gray-500">per question</div>
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowDifficultySelect(true);
                setShowTimeSelect(false);
              }}
              className="flex-1 btn-secondary py-2.5 sm:py-3 text-sm sm:text-base"
            >
              Back
            </button>
            <button
              onClick={startQuiz}
              className="flex-1 btn-primary py-2.5 sm:py-3 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Start Quiz
            </button>
          </div>
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
  // QUIZ ACTIVE
  // ============================================
  if (questions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 max-w-md mx-auto px-4">
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          No Questions
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mt-2">
          Please try again.
        </p>
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
          <span className="text-[10px] sm:text-xs text-gray-500">
            ⏱ {selectedTimePerQuestion}s
          </span>
        </div>
      </div>

      <div className="glass-card p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-gray-400">
            {currentIndex + 1} / {questions.length}
          </span>
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
            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

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
            const wasAnswered =
              answers[currentIndex] !== undefined &&
              answers[currentIndex] === answer;

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
                  ${!isSelected && !isAnswered && wasAnswered ? "bg-blue-500/20 border border-blue-500/30 text-white" : ""}
                  ${!isSelected && !isAnswered && !wasAnswered ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent" : ""}
                `}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm break-words">
                    {decodeHTML(answer)}
                    {!isAnswered && wasAnswered && (
                      <span className="ml-2 text-[10px] text-blue-400">
                        (Previous answer)
                      </span>
                    )}
                  </span>
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
                  {!isAnswered && wasAnswered && (
                    <span className="flex-shrink-0 text-blue-400 text-xs">
                      ✓
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <div className="flex justify-between gap-3 sm:gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Back
        </button>
        <span className="text-[10px] sm:text-xs text-gray-500 flex items-center">
          {isAnswered ? "✓ Answered" : "Select an answer"}
          {answers[currentIndex] !== undefined && !isAnswered && (
            <span className="ml-2 text-blue-400">(Previously answered)</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default Quiz;
