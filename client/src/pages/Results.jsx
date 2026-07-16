import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Check,
  X,
  BookOpen,
  Share,
  RefreshCw,
  Loader2,
  Award,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Copy,
  CheckCircle,
  Twitter,
  Target,
} from "lucide-react";
import { decodeHTML } from "../services/quizApi";

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResults");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResults(parsed);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing results:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

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
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400 mx-auto mb-3 sm:mb-4" />
          </motion.div>
          <p className="text-gray-400 text-sm sm:text-base">Loading your results...</p>
        </div>
      </motion.div>
    );
  }

  if (!results) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 sm:py-12 max-w-md mx-auto px-4"
      >
        <Trophy className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-white">No Results Found</h2>
        <p className="text-gray-400 text-sm sm:text-base mt-2">
          Complete a quiz first to see your results here.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          className="btn-primary mt-4 sm:mt-6 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
        >
          Go to Dashboard
        </motion.button>
      </motion.div>
    );
  }

  const { score, correct, total, questions, answers, category, difficulty } = results;

  const getGrade = () => {
    if (score >= 90) return { label: "Outstanding! 🏆", color: "text-teal-400", emoji: "🏆" };
    if (score >= 70) return { label: "Great Job! 🌟", color: "text-[#00C9A7]", emoji: "🌟" };
    if (score >= 50) return { label: "Good Effort! 💪", color: "text-blue-400", emoji: "💪" };
    return { label: "Keep Learning! 📚", color: "text-gray-400", emoji: "📚" };
  };

  const grade = getGrade();

  const shareResults = async () => {
    const shareText = `🧠 I scored ${score}% on "${category || "Quiz"}"! ${correct}/${total} correct. Challenge me on Cerebrum! 🎯`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "My Quiz Results", text: shareText });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 3000);
      } catch {}
    }
  };

  const shareOnTwitter = () => {
    const text = `🧠 I scored ${score}% on "${category || "Quiz"}"! ${correct}/${total} correct. Try it on Cerebrum!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const getDifficultyColor = () => {
    if (difficulty === "easy") return "text-green-400 bg-green-500/20";
    if (difficulty === "medium") return "text-teal-400 bg-teal-500/20";
    return "text-red-400 bg-red-500/20";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12"
    >
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard")}
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
      >
        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Dashboard
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4, type: "spring" }}
        className="glass-card p-4 sm:p-5 md:p-6 lg:p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${grade.color} mb-2`}
        >
          {grade.emoji}
        </motion.div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5, type: "spring" }}
          className="relative inline-block mb-3 sm:mb-4"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-white/10 flex items-center justify-center mx-auto">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white"
              >
                {score}%
              </motion.div>
              <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-400">Score</div>
            </div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-xl sm:text-2xl md:text-3xl font-bold ${grade.color}`}
        >
          {grade.label}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-gray-400 text-xs sm:text-sm md:text-base mt-1"
        >
          You got <span className="text-white font-bold">{correct}</span> out of{" "}
          <span className="text-white font-bold">{total}</span> questions correct
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 sm:gap-3 mt-3 text-[10px] sm:text-xs text-gray-500 flex-wrap"
        >
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {category || "General"}
          </span>
          <span className="w-px h-3 bg-gray-700"></span>
          <span className={`px-1.5 sm:px-2 py-0.5 rounded-full ${getDifficultyColor()}`}>
            {difficulty || "Medium"}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6"
        >
          {[
            { label: 'Correct', value: correct, color: 'text-[#00C9A7]' },
            { label: 'Incorrect', value: total - correct, color: 'text-red-400' },
            { label: 'Total', value: total, color: 'text-white' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.08 }}
              className="bg-white/5 rounded-lg p-2 sm:p-3"
            >
              <div className={`text-lg sm:text-xl md:text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
              <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-400">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 justify-center"
        >
          {[
            { icon: RefreshCw, label: 'New Quiz', onClick: () => navigate("/categories") },
            { icon: BookOpen, label: showReview ? 'Hide' : 'Review', onClick: () => setShowReview(!showReview) },
            { icon: shareCopied ? CheckCircle : Share, label: shareCopied ? 'Copied!' : 'Share', onClick: shareResults, iconColor: shareCopied ? 'text-[#00C9A7]' : '' },
            { icon: Twitter, label: 'Tweet', onClick: shareOnTwitter, iconColor: 'text-[#1DA1F2]' },
          ].map((btn, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.06 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={btn.onClick}
              className="btn-secondary text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2"
            >
              <btn.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${btn.iconColor || ''}`} />
              {btn.label}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-3 sm:p-4 border border-teal-400/20 bg-teal-400/5"
      >
        <div className="flex items-start gap-2 sm:gap-3">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs sm:text-sm text-gray-300">
              <span className="text-teal-400 font-medium">Pro Tip:</span>{" "}
              Upgrade to Pro to get detailed explanations for every question!
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showReview && questions && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-4 sm:p-5 md:p-6 overflow-hidden"
          >
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              Answer Review
            </h3>
            <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
              {questions.map((q, i) => {
                const userAnswer = answers?.[i];
                const isCorrect = userAnswer === q.correct_answer;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`p-3 sm:p-4 rounded-lg border ${
                      isCorrect
                        ? "border-[#00C9A7]/30 bg-[#00C9A7]/5"
                        : "border-red-400/30 bg-red-400/5"
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="mt-0.5">
                        {isCorrect ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C9A7]" />
                        ) : (
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs sm:text-sm md:text-base font-medium break-words">
                          {decodeHTML(q.question)}
                        </p>
                        <div className="mt-1 text-[10px] sm:text-xs md:text-sm">
                          <span className="text-gray-400">Your answer: </span>
                          <span className={isCorrect ? "text-[#00C9A7]" : "text-red-400"}>
                            {userAnswer || "Not answered"}
                          </span>
                          {!isCorrect && (
                            <span className="text-gray-400 ml-1 sm:ml-2">
                              ✓ <span className="text-[#00C9A7]">{decodeHTML(q.correct_answer)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Results;
