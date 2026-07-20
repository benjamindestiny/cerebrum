import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Brain,
  Clock,
  Award,
  ArrowLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import readingMaterials from "../data/readingMaterials";
import { supabase } from "../services/supabase";

const ReadAndTest = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [currentView, setCurrentView] = useState("browse");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMaterials(readingMaterials);
    setFilteredMaterials(readingMaterials);
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const saveArticleToHistory = async (articleId) => {
    if (!user) return;
    try {
      const { data: existing } = await supabase
        .from("article_history")
        .select("id")
        .eq("user_id", user.id)
        .eq("article_id", articleId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("article_history")
          .update({ read_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase.from("article_history").insert({
          user_id: user.id,
          article_id: articleId,
          read_at: new Date().toISOString(),
        });
      }

      await updateUserArticleStats();
      console.log("✅ Article saved to history:", articleId);
    } catch (error) {
      console.error("Error saving article history:", error);
    }
  };

  const updateUserArticleStats = async () => {
    if (!user) return;
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("stats")
        .eq("id", user.id)
        .single();

      const currentStats = userData?.stats || {};
      const { data: articles } = await supabase
        .from("article_history")
        .select("id")
        .eq("user_id", user.id);

      const readArticles = articles?.length || 0;
      const updatedStats = { ...currentStats, read_articles: readArticles };

      await supabase
        .from("users")
        .update({ stats: updatedStats })
        .eq("id", user.id);
    } catch (error) {
      console.error("Error updating article stats:", error);
    }
  };

  const categories = ["all", ...new Set(materials.map((m) => m.category))];
  const getSubcategories = () => {
    if (selectedCategory === "all") {
      return ["all", ...new Set(materials.map((m) => m.subcategory))];
    }
    const filtered = materials.filter((m) => m.category === selectedCategory);
    return ["all", ...new Set(filtered.map((m) => m.subcategory))];
  };
  const subcategories = getSubcategories();

  useEffect(() => {
    let filtered = materials;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((m) => m.category === selectedCategory);
    }

    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((m) => m.subcategory === selectedSubcategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMaterials(filtered);
  }, [selectedCategory, selectedSubcategory, searchTerm, materials]);

  const startReading = (material) => {
    setSelectedMaterial(material);
    setCurrentView("reading");
    setStartTime(Date.now());
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setIsSubmitting(false);
    saveArticleToHistory(material.id);
  };

  const startQuiz = () => {
    setCurrentView("quiz");
    setCurrentQuestion(0);
    setAnswers({});
    setIsSubmitting(false);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const updatedAnswers = { ...answers, [questionIndex]: answerIndex };
    setAnswers(updatedAnswers);

    const questions = selectedMaterial.questions;
    const totalQuestions = questions.length;

    if (questionIndex === totalQuestions - 1) {
      setIsSubmitting(true);
      setTimeout(() => {
        submitQuiz(updatedAnswers);
      }, 800);
    } else {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, 500);
    }
  };

  const submitQuiz = (finalAnswers) => {
    const currentAnswers = finalAnswers || answers;
    const questions = selectedMaterial.questions;
    let correct = 0;

    questions.forEach((q, index) => {
      if (currentAnswers[index] === q.correct) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    const timeTaken = Math.floor((Date.now() - startTime) / 60);
    setTimeSpent(timeTaken);

    const resultsData = {
      score: finalScore,
      correct,
      total: questions.length,
      questions: questions,
      answers: currentAnswers,
      title: selectedMaterial.title,
      category: selectedMaterial.category,
      subcategory: selectedMaterial.subcategory,
      icon: selectedMaterial.icon,
      articleId: selectedMaterial.id,
      timeSpent: timeTaken,
      date: new Date().toLocaleDateString(),
    };

    sessionStorage.setItem("readTestResults", JSON.stringify(resultsData));

    setTimeout(() => {
      navigate("/read-and-test-results");
    }, 1000);
  };

  const handleGoBack = () => {
    if (currentView === "reading") {
      setCurrentView("browse");
      setSelectedMaterial(null);
    } else if (currentView === "quiz") {
      setCurrentView("reading");
    } else {
      navigate("/");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const renderBrowseView = () => {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#2A1535]" />
              Read & Test
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
              Read educational content and test your comprehension
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2"
          >
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A1535]" />
            <span className="text-xs sm:text-sm text-gray-300">
              {materials.length} Articles
            </span>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-1.5 sm:gap-2">
          {["all", ...categories.filter(c => c !== "all")].map((category) => {
            const count = category === "all" ? materials.length : materials.filter((m) => m.category === category).length;
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {category === "all" ? "All" : category} ({count})
              </motion.button>
            );
          })}
        </motion.div>

        {selectedCategory !== "all" && (
          <motion.div variants={itemVariants} className="flex flex-wrap gap-1.5 sm:gap-2">
            {["all", ...subcategories.filter(s => s !== "all")].map((sub) => (
              <motion.button
                key={sub}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-2 py-0.5 sm:py-1 rounded-lg text-[8px] sm:text-[10px] md:text-xs transition-all ${
                  selectedSubcategory === sub
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {sub === "all" ? "All Subcategories" : sub}
              </motion.button>
            ))}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 sm:pl-9 md:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm md:text-base"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, borderColor: 'rgba(59,130,246,0.3)' }}
              className="glass-card p-4 sm:p-5 md:p-6 hover:border-blue-500/30 transition-all cursor-pointer"
              onClick={() => startReading(material)}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xl sm:text-2xl">{material.icon}</span>
                  <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-500/20 text-[#2A1535] rounded-full">
                    {material.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">
                    {material.subcategory}
                  </span>
                  <span className={`text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                    material.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-400"
                      : material.difficulty === "Medium"
                        ? "bg-teal-500/20 text-teal-400"
                        : "bg-red-500/20 text-red-400"
                  }`}>
                    {material.difficulty}
                  </span>
                </div>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2">
                {material.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                {material.content.replace(/<[^>]*>/g, "").slice(0, 120)}...
              </p>
              <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 md:mt-4 text-[10px] sm:text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {material.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {material.questions.length} questions
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 sm:mt-4 w-full btn-secondary text-[10px] sm:text-xs md:text-sm flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2"
              >
                Start Reading <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  };

  const renderReadingView = () => {
    if (!selectedMaterial) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Back to Articles
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-4 sm:p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <span className="text-xl sm:text-2xl">{selectedMaterial.icon}</span>
                <span className="text-[10px] sm:text-xs md:text-sm text-[#2A1535]">
                  {selectedMaterial.category}
                </span>
                <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">
                  • {selectedMaterial.subcategory}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {selectedMaterial.title}
              </h2>
            </div>
            <span className={`text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
              selectedMaterial.difficulty === "Easy"
                ? "bg-green-500/20 text-green-400"
                : selectedMaterial.difficulty === "Medium"
                  ? "bg-teal-500/20 text-teal-400"
                  : "bg-red-500/20 text-red-400"
            }`}>
              {selectedMaterial.difficulty}
            </span>
          </div>
          <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-3 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {selectedMaterial.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {selectedMaterial.questions.length} questions
            </span>
          </div>
          <div
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: selectedMaterial.content }}
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startQuiz}
          className="w-full btn-primary flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg py-3 sm:py-4"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          Start Comprehension Quiz
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </motion.div>
    );
  };

  const renderQuizView = () => {
    if (!selectedMaterial) return null;

    const questions = selectedMaterial.questions;
    const totalQuestions = questions.length;
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Back to Reading
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-4 sm:p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs md:text-sm text-gray-400">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden mb-4 sm:mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <h3 className="text-base sm:text-lg md:text-xl text-white font-medium mb-4 sm:mb-6">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-2 sm:space-y-3">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index;
              const isCorrect = index === questions[currentQuestion].correct;
              const showCorrect = answers[currentQuestion] !== undefined && isCorrect;
              const showWrong = answers[currentQuestion] !== undefined && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={answers[currentQuestion] === undefined ? { scale: 1.02 } : {}}
                  whileTap={answers[currentQuestion] === undefined ? { scale: 0.98 } : {}}
                  onClick={() => {
                    if (answers[currentQuestion] === undefined && !isSubmitting) {
                      handleAnswerSelect(currentQuestion, index);
                    }
                  }}
                  disabled={answers[currentQuestion] !== undefined || isSubmitting}
                  className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all duration-200 text-xs sm:text-sm md:text-base ${
                    answers[currentQuestion] === undefined
                      ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent"
                      : isSelected && !isCorrect
                        ? "bg-red-500/30 border border-red-500 text-white"
                        : isCorrect
                          ? "bg-[#00C9A7]/30 border border-[#00C9A7] text-white"
                          : "bg-white/5 text-gray-400 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="break-words">{option}</span>
                    {answers[currentQuestion] !== undefined && (
                      <span className="flex-shrink-0">
                        {isCorrect && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C9A7]" />}
                        {isSelected && !isCorrect && <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <span className="text-[10px] sm:text-xs text-gray-500 text-center sm:text-left">
            Based on: {selectedMaterial.title}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500">
            {currentQuestion + 1}/{totalQuestions}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {currentView === "browse" && renderBrowseView()}
      {currentView === "reading" && renderReadingView()}
      {currentView === "quiz" && renderQuizView()}
    </div>
  );
};

export default ReadAndTest;
