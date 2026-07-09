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

  useEffect(() => {
    setMaterials(readingMaterials);
    setFilteredMaterials(readingMaterials);
  }, []);

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
          m.subcategory.toLowerCase().includes(searchTerm.toLowerCase()),
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
    // toast.`📖 Reading: ${material.title}`);
  };

  const startQuiz = () => {
    setCurrentView("quiz");
    setCurrentQuestion(0);
    setAnswers({});
    // toast."📝 Starting comprehension quiz!");
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const submitQuiz = () => {
    let correct = 0;
    const questions = selectedMaterial.questions;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
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
      answers: answers,
      title: selectedMaterial.title,
      category: selectedMaterial.category,
      subcategory: selectedMaterial.subcategory,
      icon: selectedMaterial.icon,
      articleId: selectedMaterial.id,
      timeSpent: timeTaken,
      date: new Date().toLocaleDateString(),
    };

    sessionStorage.setItem("readTestResults", JSON.stringify(resultsData));

    // toast.`🎉 Quiz Complete! Score: ${finalScore}%`);

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

  const renderBrowseView = () => {
    const categoryCounts = {};
    materials.forEach((m) => {
      categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-[#6C2BD9]" />
              Read & Test
            </h1>
            <p className="text-gray-400 mt-1">
              Read educational content and test your comprehension
            </p>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#6C2BD9]" />
            <span className="text-sm text-gray-300">
              {materials.length} Articles
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              selectedCategory === "all"
                ? "bg-[#6C2BD9] text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            All ({materials.length})
          </button>
          {categories
            .filter((c) => c !== "all")
            .map((category) => {
              const count = materials.filter(
                (m) => m.category === category,
              ).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedCategory === category
                      ? "bg-[#6C2BD9] text-white"
                      : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
        </div>

        {selectedCategory !== "all" && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubcategory("all")}
              className={`px-2 py-1 rounded-lg text-xs transition-all ${
                selectedSubcategory === "all"
                  ? "bg-[#6C2BD9] text-white"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              All Subcategories
            </button>
            {subcategories
              .filter((s) => s !== "all")
              .map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-2 py-1 rounded-lg text-xs transition-all ${
                    selectedSubcategory === sub
                      ? "bg-[#6C2BD9] text-white"
                      : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {sub}
                </button>
              ))}
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#6C2BD9]/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((material) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 hover:border-[#6C2BD9]/30 transition-all cursor-pointer"
              onClick={() => startReading(material)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{material.icon}</span>
                  <span className="text-sm px-2 py-1 bg-[#6C2BD9]/20 text-[#6C2BD9] rounded-full">
                    {material.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {material.subcategory}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      material.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-400"
                        : material.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {material.difficulty}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {material.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {material.content.replace(/<[^>]*>/g, "").slice(0, 150)}...
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {material.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {material.questions.length} questions
                </span>
              </div>
              <button className="mt-4 w-full btn-secondary text-sm flex items-center justify-center gap-2">
                Start Reading <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderReadingView = () => {
    if (!selectedMaterial) return null;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={handleGoBack}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </button>

        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{selectedMaterial.icon}</span>
                <span className="text-sm text-[#6C2BD9]">
                  {selectedMaterial.category}
                </span>
                <span className="text-xs text-gray-500">
                  • {selectedMaterial.subcategory}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {selectedMaterial.title}
              </h2>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                selectedMaterial.difficulty === "Easy"
                  ? "bg-green-500/20 text-green-400"
                  : selectedMaterial.difficulty === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {selectedMaterial.difficulty}
            </span>
          </div>
          <div className="text-sm text-gray-400 mb-4 flex items-center gap-4">
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
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedMaterial.content }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startQuiz}
          className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
        >
          <Sparkles className="w-5 h-5" />
          Start Comprehension Quiz
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    );
  };

  const renderQuizView = () => {
    if (!selectedMaterial) return null;

    const questions = selectedMaterial.questions;
    const totalQuestions = questions.length;
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={handleGoBack}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Reading
        </button>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-[#6C2BD9] to-[#8B5CF6] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h3 className="text-xl text-white font-medium mb-6">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index;
              const isCorrect = index === questions[currentQuestion].correct;
              const showCorrect =
                answers[currentQuestion] !== undefined && isCorrect;
              const showWrong =
                answers[currentQuestion] !== undefined &&
                isSelected &&
                !isCorrect;

              return (
                <motion.button
                  key={index}
                  whileHover={
                    answers[currentQuestion] === undefined
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    answers[currentQuestion] === undefined
                      ? { scale: 0.98 }
                      : {}
                  }
                  onClick={() => {
                    if (answers[currentQuestion] === undefined) {
                      handleAnswer(currentQuestion, index);
                      setTimeout(() => {
                        if (currentQuestion < totalQuestions - 1) {
                          setCurrentQuestion((prev) => prev + 1);
                        } else {
                          submitQuiz();
                        }
                      }, 1000);
                    }
                  }}
                  disabled={answers[currentQuestion] !== undefined}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    answers[currentQuestion] === undefined
                      ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent"
                      : isSelected && !isCorrect
                        ? "bg-red-500/30 border border-red-500 text-white"
                        : isCorrect
                          ? "bg-[#00C9A7]/30 border border-[#00C9A7] text-white"
                          : "bg-white/5 text-gray-400 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {answers[currentQuestion] !== undefined && (
                      <span>
                        {isCorrect && (
                          <Check className="w-5 h-5 text-[#00C9A7]" />
                        )}
                        {isSelected && !isCorrect && (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Based on: {selectedMaterial.title}
          </span>
          <span className="text-xs text-gray-500">
            {currentQuestion + 1}/{totalQuestions}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {currentView === "browse" && renderBrowseView()}
      {currentView === "reading" && renderReadingView()}
      {currentView === "quiz" && renderQuizView()}
    </div>
  );
};

export default ReadAndTest;
