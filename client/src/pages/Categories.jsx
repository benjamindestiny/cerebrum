import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderTree,
  ChevronDown,
  ChevronRight,
  Search,
  Brain,
  Trophy,
  Sparkles,
  TrendingUp,
  Zap,
  ArrowRight,
  Layers,
  Gamepad2,
  Code,
  Cloud,
  Database,
  FlaskConical,
  Atom,
  Dna,
  BookOpen,
  Landmark,
  Building2,
  Shield,
  Users,
  DollarSign,
  Heart,
  Music,
  Palette,
  Settings,
  Sliders,
  CheckCircle,
  Play,
  X,
  Crown,
  Star,
  Lock,
} from "lucide-react";

import categoryHierarchy from "../data/categoryData";

const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState({});
  const [questionCount, setQuestionCount] = useState(15);
  const [showCountSelector, setShowCountSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const questionCounts = [
    { value: 5, label: "5", free: true },
    { value: 10, label: "10", free: true },
    { value: 15, label: "15", free: true },
  ];

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const matchesSearch = (item, term) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    if (item.name.toLowerCase().includes(lowerTerm)) return true;
    if (item.description && item.description.toLowerCase().includes(lowerTerm))
      return true;
    return false;
  };

  const filterTree = (items, term) => {
    if (!term) return items;

    const filtered = [];

    items.forEach((item) => {
      const itemMatches =
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(term.toLowerCase()));

      let filteredChildren = [];
      if (item.children) {
        filteredChildren = filterTree(item.children, term);
      }

      if (itemMatches || filteredChildren.length > 0) {
        filtered.push({
          ...item,
          children:
            filteredChildren.length > 0 ? filteredChildren : item.children,
        });
      }
    });

    return filtered;
  };

  const handleCategoryClick = (category) => {
    let questionId = category.id;
    if (category.source === "api" && category.apiId) {
      questionId = category.apiId;
    } else if (category.customQuestionId) {
      questionId = category.customQuestionId;
    }

    setSelectedCategory({
      ...category,
      questionId: questionId,
    });
    setQuestionCount(15);
    setShowCountSelector(true);
  };

  const startQuiz = () => {
    if (!selectedCategory) {
      return;
    }

    const category = selectedCategory;
    const questionId = category.questionId;
    const count = questionCount;

    sessionStorage.setItem(
      "selectedCategory",
      JSON.stringify({
        id: questionId,
        name: category.name,
        count: count,
        source: category.source || "api",
      }),
    );

    setShowCountSelector(false);
    setSelectedCategory(null);
    navigate("/quiz");
  };

  const getFilteredTree = () => {
    if (!searchTerm) return categoryHierarchy;
    return filterTree(categoryHierarchy, searchTerm);
  };

  const filteredTree = getFilteredTree();

  const countVisibleCategories = (items) => {
    let count = 0;
    items.forEach((item) => {
      count++;
      if (item.children && item.children.length > 0) {
        count += countVisibleCategories(item.children);
      }
    });
    return count;
  };

  const visibleCount = searchTerm ? countVisibleCategories(filteredTree) : 0;

  const renderCategoryTree = (items, depth = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems[item.id] || false;
      const Icon = item.icon;

      return (
        <div key={item.id} className="mb-1 sm:mb-2">
          <motion.div
            whileHover={{ x: hasChildren ? 0 : 4 }}
            className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              isExpanded
                ? "bg-white/5 border-l-4 border-[#6C2BD9]"
                : "hover:bg-white/5"
            } ${!hasChildren ? "hover:border-l-4 hover:border-[#6C2BD9]/50" : ""}`}
            style={{ paddingLeft: `${Math.min(depth * 16 + 12, 60)}px` }}
            onClick={() => {
              if (hasChildren) {
                toggleExpand(item.id);
              } else {
                handleCategoryClick(item);
              }
            }}
          >
            {hasChildren && (
              <button
                className="text-gray-400 hover:text-white transition-transform duration-200 p-1 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-5" />
                ) : (
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-5" />
                )}
              </button>
            )}
            <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0">
              {Icon}
            </span>
            <span
              className={`text-white font-semibold text-xs sm:text-sm md:text-base ${item.color || "text-gray-300"} truncate`}
            >
              {item.name}
            </span>
            {hasChildren && (
              <span className="ml-auto text-[8px] sm:text-[10px] md:text-xs text-gray-500 bg-white/5 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full flex-shrink-0 hidden sm:inline">
                {item.children.length} sub
              </span>
            )}
            {!hasChildren && (
              <span className="ml-auto text-[8px] sm:text-[10px] md:text-xs bg-yellow-400/20 text-yellow-400 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <Trophy className="w-2 h-2 sm:w-3 sm:h-3" /> Quiz
              </span>
            )}
            {searchTerm && matchesSearch(item, searchTerm) && (
              <span className="ml-1 sm:ml-2 text-[8px] sm:text-[10px] md:text-xs text-[#6C2BD9] bg-[#6C2BD9]/20 px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full flex-shrink-0">
                Match
              </span>
            )}
          </motion.div>

          {hasChildren && (
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-3 sm:ml-4 md:ml-6 border-l-2 border-[#6C2BD9]/30 pl-1.5 sm:pl-2 md:pl-4 overflow-hidden"
                >
                  {renderCategoryTree(item.children, depth + 1)}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      );
    });
  };

  const totalCategories = categoryHierarchy.reduce((acc, cat) => {
    let count = 1;
    if (cat.children) {
      count += cat.children.reduce((subAcc, child) => {
        let subCount = 1;
        if (child.children) subCount += child.children.length;
        return subAcc + subCount;
      }, 0);
    }
    return acc + count;
  }, 0);

  const totalSubCategories = categoryHierarchy.reduce((acc, cat) => {
    return acc + (cat.children?.length || 0);
  }, 0);

  const totalTopics = categoryHierarchy.reduce((acc, cat) => {
    let count = 0;
    if (cat.children) {
      cat.children.forEach((child) => {
        if (child.children) count += child.children.length;
      });
    }
    return acc + count;
  }, 0);

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 px-2 sm:px-3 md:px-4 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 md:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <FolderTree className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-8 text-[#6C2BD9]" />
            Category Explorer
          </h1>
          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
            Browse {totalCategories} categories across{" "}
            {categoryHierarchy.length} main topics
          </p>
        </div>
        <div className="glass-card px-2.5 sm:px-3 md:px-5 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2">
          <Layers className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#6C2BD9]" />
          <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-300">
            {totalSubCategories} sub • {totalTopics} topics
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value) {
              const expandAll = (items) => {
                items.forEach((item) => {
                  if (item.children && item.children.length > 0) {
                    setExpandedItems((prev) => ({ ...prev, [item.id]: true }));
                    expandAll(item.children);
                  }
                });
              };
              expandAll(categoryHierarchy);
            } else {
              setExpandedItems({});
            }
          }}
          className="w-full pl-8 sm:pl-10 md:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 md:py-4 bg-[#2D2D5E] rounded-xl border border-white/10 text-white placeholder-gray-500 focus:border-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#6C2BD9]/20 transition-all text-xs sm:text-sm md:text-base"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setExpandedItems({});
            }}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        )}
      </div>

      {searchTerm && (
        <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">
          Found <span className="text-white font-bold">{visibleCount}</span>{" "}
          categories matching "{searchTerm}"
        </div>
      )}

      <div className="glass-card p-2.5 sm:p-3 md:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
            <FolderTree className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#6C2BD9]" />
            {searchTerm ? "Search Results" : "All Categories"}
          </h2>
          <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">
            {searchTerm ? `${visibleCount} categories` : "Tap ▶ to expand"}
          </span>
        </div>
        <div className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] lg:max-h-[700px] overflow-y-auto custom-scrollbar pr-0.5 sm:pr-1 md:pr-2">
          {renderCategoryTree(filteredTree)}
        </div>
      </div>

      {/* Question Count Selector Modal */}
      <AnimatePresence>
        {showCountSelector && selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4"
            onClick={() => {
              setShowCountSelector(false);
              setSelectedCategory(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card p-5 sm:p-6 md:p-8 max-w-md w-full relative mx-2 sm:mx-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowCountSelector(false);
                  setSelectedCategory(null);
                }}
                className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="text-center mb-3 sm:mb-4 md:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#6C2BD9]/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#6C2BD9]" />
                </div>
                <h2 className="text-base sm:text-lg md:text-2xl font-bold text-white">
                  {selectedCategory.name}
                </h2>
                <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1">
                  How many questions do you want to answer?
                </p>
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 mt-1">
                  Selected:{" "}
                  <span className="text-white font-bold">{questionCount}</span>{" "}
                  questions
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-6 max-w-xs mx-auto">
                {questionCounts.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setQuestionCount(item.value)}
                    className={`p-2 sm:p-2.5 md:p-3 rounded-lg transition-all text-xs sm:text-sm md:text-base ${
                      questionCount === item.value
                        ? "bg-[#6C2BD9] text-white border border-[#6C2BD9] shadow-lg shadow-[#6C2BD9]/20"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {item.value}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowCountSelector(false);
                    setSelectedCategory(null);
                  }}
                  className="flex-1 btn-secondary py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={startQuiz}
                  className="flex-1 btn-primary py-2 sm:py-2.5 md:py-3 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base"
                >
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  Start {questionCount} Qs
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <div className="glass-card p-2.5 sm:p-3 md:p-4 lg:p-5 text-center">
          <div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-[#6C2BD9]">
            {categoryHierarchy.length}
          </div>
          <div className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400">
            Main Categories
          </div>
        </div>
        <div className="glass-card p-2.5 sm:p-3 md:p-4 lg:p-5 text-center">
          <div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-blue-400">
            {totalSubCategories}
          </div>
          <div className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400">
            Sub-Categories
          </div>
        </div>
        <div className="glass-card p-2.5 sm:p-3 md:p-4 lg:p-5 text-center">
          <div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-yellow-400">
            {totalTopics}
          </div>
          <div className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400">
            Topics
          </div>
        </div>
        <div className="glass-card p-2.5 sm:p-3 md:p-4 lg:p-5 text-center">
          <div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-[#00C9A7]">
            3
          </div>
          <div className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400">
            Difficulties
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-3 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-r from-[#6C2BD9]/10 to-[#8B5CF6]/10 border border-[#6C2BD9]/20"
      >
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-8 text-[#6C2BD9]" />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg">
              Ready to Test Your Knowledge?
            </h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">
              Tap any sub-category to start a quiz! 🚀
            </p>
          </div>
          <button
            onClick={() => {
              const allSubs = [];
              categoryHierarchy.forEach((cat) => {
                if (cat.children) {
                  cat.children.forEach((child) => {
                    if (child.children) {
                      child.children.forEach((sub) => {
                        allSubs.push(sub);
                      });
                    } else {
                      allSubs.push(child);
                    }
                  });
                }
              });
              const random =
                allSubs[Math.floor(Math.random() * allSubs.length)];
              if (random) handleCategoryClick(random);
            }}
            className="btn-secondary flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-3 w-full sm:w-auto justify-center"
          >
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /> Random
            Quiz
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Categories;
