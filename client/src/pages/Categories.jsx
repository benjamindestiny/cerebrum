import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderTree, ChevronDown, ChevronRight, Search,
  Brain, Trophy, Sparkles, TrendingUp, 
  Zap, ArrowRight, Layers, 
  Gamepad2, Code, Cloud, Database, 
  FlaskConical, Atom, Dna, BookOpen,
  Landmark, Building2, Shield, Users,
  DollarSign, Heart, Music, Palette,
  Settings, Sliders, CheckCircle, Play, X,
  Crown, Star, Lock
} from 'lucide-react';
import { toast } from 'react-toastify';
import categoryHierarchy from '../data/categoryData';

const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [questionCount, setQuestionCount] = useState(10);
  const [showCountSelector, setShowCountSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const questionCounts = [
    { value: 5, label: '5', free: true },
    { value: 10, label: '10', free: true },
    { value: 15, label: '15', free: true },
  ];

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const matchesSearch = (item, term) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    if (item.name.toLowerCase().includes(lowerTerm)) return true;
    if (item.description && item.description.toLowerCase().includes(lowerTerm)) return true;
    return false;
  };

  const filterTree = (items, term) => {
    if (!term) return items;
    const filtered = [];
    items.forEach(item => {
      const itemMatches = item.name.toLowerCase().includes(term.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(term.toLowerCase()));
      let filteredChildren = [];
      if (item.children) {
        filteredChildren = filterTree(item.children, term);
      }
      if (itemMatches || filteredChildren.length > 0) {
        filtered.push({
          ...item,
          children: filteredChildren.length > 0 ? filteredChildren : item.children
        });
      }
    });
    return filtered;
  };

  const handleCategoryClick = (category) => {
    let questionId = category.id;
    if (category.source === 'api' && category.apiId) {
      questionId = category.apiId;
    } else if (category.customQuestionId) {
      questionId = category.customQuestionId;
    }
    setSelectedCategory({
      ...category,
      questionId: questionId
    });
    setQuestionCount(10);
    setShowCountSelector(true);
  };

  const startQuiz = () => {
    if (!selectedCategory) {
      toast.error('No category selected');
      return;
    }
    const category = selectedCategory;
    const questionId = category.questionId;
    const count = questionCount;
    
    sessionStorage.setItem('selectedCategory', JSON.stringify({
      id: questionId,
      name: category.name,
      count: count,
      source: category.source || 'api'
    }));
    
    setShowCountSelector(false);
    setSelectedCategory(null);
    navigate('/quiz');
  };

  const getFilteredTree = () => {
    if (!searchTerm) return categoryHierarchy;
    return filterTree(categoryHierarchy, searchTerm);
  };

  const filteredTree = getFilteredTree();

  const countVisibleCategories = (items) => {
    let count = 0;
    items.forEach(item => {
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
        <div key={item.id} className="mb-2">
          <motion.div 
            whileHover={{ x: hasChildren ? 0 : 5 }}
            className={`flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              isExpanded ? 'bg-white/5 border-l-4 border-blue-500' : 'hover:bg-white/5'
            } ${!hasChildren ? 'hover:border-l-4 hover:border-blue-500/50' : ''}`}
            style={{ paddingLeft: `${depth * 20 + 12}px` }}
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
                onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            )}
            <span className="text-xl sm:text-2xl flex-shrink-0">{Icon}</span>
            <span className={`text-white font-semibold text-sm sm:text-base ${item.color || 'text-gray-300'} truncate min-w-0`}>
              {item.name}
            </span>
            {hasChildren && (
              <span className="ml-auto text-[10px] sm:text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full flex-shrink-0">
                {item.children.length} sub-categories
              </span>
            )}
            {!hasChildren && (
              <span className="ml-auto text-[10px] sm:text-xs bg-blue-500/20 text-[#3B82F6] px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0">
                <Trophy className="w-3 h-3" /> Quiz
              </span>
            )}
            {searchTerm && matchesSearch(item, searchTerm) && (
              <span className="ml-2 text-[10px] sm:text-xs text-[#3B82F6] bg-blue-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                Match
              </span>
            )}
          </motion.div>
          
          {hasChildren && (
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 sm:ml-6 border-l-2 border-blue-500/30 pl-3 sm:pl-4 overflow-hidden"
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
      cat.children.forEach(child => {
        if (child.children) count += child.children.length;
      });
    }
    return acc + count;
  }, 0);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto px-3 sm:px-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <FolderTree className="w-7 h-7 sm:w-8 sm:h-9 text-[#3B82F6]" />
            Category Explorer
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Browse {totalCategories} categories across {categoryHierarchy.length} main topics
          </p>
        </div>
        <div className="glass-card px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2">
          <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B82F6]" />
          <span className="text-xs sm:text-sm text-gray-300">
            {totalSubCategories} sub • {totalTopics} topics
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value) {
              const expandAll = (items) => {
                items.forEach(item => {
                  if (item.children && item.children.length > 0) {
                    setExpandedItems(prev => ({ ...prev, [item.id]: true }));
                    expandAll(item.children);
                  }
                });
              };
              expandAll(categoryHierarchy);
            } else {
              setExpandedItems({});
            }
          }}
          className="w-full pl-9 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#1E1E3A] rounded-xl border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setExpandedItems({});
            }}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {/* Search Results Count */}
      {searchTerm && (
        <div className="text-sm text-gray-400">
          Found <span className="text-white font-bold">{visibleCount}</span> categories matching "{searchTerm}"
        </div>
      )}

      {/* Category Tree */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <FolderTree className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B82F6]" />
            {searchTerm ? 'Search Results' : 'All Categories'}
          </h2>
          <span className="text-xs text-gray-500">
            {searchTerm ? `${visibleCount} categories` : 'Click ▶ to expand'}
          </span>
        </div>
        <div className="max-h-[700px] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => {
              setShowCountSelector(false);
              setSelectedCategory(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card p-6 sm:p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowCountSelector(false);
                  setSelectedCategory(null);
                }}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 sm:w-7 sm:h-8 text-[#3B82F6]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedCategory.name}</h2>
                <p className="text-gray-400 text-sm mt-1">How many questions?</p>
                <p className="text-xs text-gray-500 mt-1">Selected: <span className="text-white font-bold">{questionCount}</span></p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 max-w-xs mx-auto">
                {questionCounts.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setQuestionCount(item.value)}
                    className={`p-3 rounded-lg transition-all ${
                      questionCount === item.value
                        ? 'bg-blue-500 text-white border border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {item.value}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCountSelector(false);
                    setSelectedCategory(null);
                  }}
                  className="flex-1 btn-secondary py-3"
                >
                  Cancel
                </button>
                <button
                  onClick={startQuiz}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start {questionCount} Questions
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 text-center">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3B82F6]">{categoryHierarchy.length}</div>
          <div className="text-xs sm:text-sm text-gray-400">Main Categories</div>
        </div>
        <div className="glass-card p-4 sm:p-5 text-center">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3B82F6]">{totalSubCategories}</div>
          <div className="text-xs sm:text-sm text-gray-400">Sub-Categories</div>
        </div>
        <div className="glass-card p-4 sm:p-5 text-center">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-400">{totalTopics}</div>
          <div className="text-xs sm:text-sm text-gray-400">Topics</div>
        </div>
        <div className="glass-card p-4 sm:p-5 text-center">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-400">3</div>
          <div className="text-xs sm:text-sm text-gray-400">Difficulties</div>
        </div>
      </div>

      {/* Quick Start */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5 sm:p-6 bg-blue-500/5 border border-blue-500/20"
      >
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#3B82F6]" />
          <div className="flex-1">
            <h3 className="text-white font-semibold text-base sm:text-lg">Ready to Test Your Knowledge?</h3>
            <p className="text-sm text-gray-400">Click any sub-category to start a quiz! 🚀</p>
          </div>
          <button 
            onClick={() => {
              const allSubs = [];
              categoryHierarchy.forEach(cat => {
                if (cat.children) {
                  cat.children.forEach(child => {
                    if (child.children) {
                      child.children.forEach(sub => {
                        allSubs.push(sub);
                      });
                    } else {
                      allSubs.push(child);
                    }
                  });
                }
              });
              const random = allSubs[Math.floor(Math.random() * allSubs.length)];
              if (random) handleCategoryClick(random);
            }}
            className="btn-secondary flex items-center gap-2 text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-3"
          >
            <Zap className="w-4 h-4" /> Random Quiz
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Categories;
