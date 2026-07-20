import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FolderTree,
  Search,
  ChevronRight,
  Gamepad2,
  Cpu,
  FlaskConical,
  Calculator,
  BookOpen,
  Music,
  Globe,
  Landmark,
  Palette,
  Atom,
  Brain,
} from "lucide-react";
import { supabase } from "../services/supabase";

const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryIcons = {
    "Video Games": Gamepad2,
    "Technology": Cpu,
    "Science": FlaskConical,
    "Mathematics": Calculator,
    "Books": BookOpen,
    "Music": Music,
    "Geography": Globe,
    "History": Landmark,
    "Art": Palette,
    "Physics": Atom,
    "General Knowledge": Brain,
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quiz_results")
        .select("category")
        .not("category", "is", null);

      if (error) throw error;

      const categoryCounts = {};
      data.forEach((item) => {
        const cat = item.category;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      const sortedCategories = Object.keys(categoryCounts)
        .sort()
        .map((name) => ({
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name: name,
          count: categoryCounts[name],
          icon: categoryIcons[name] || FolderTree,
        }));

      if (sortedCategories.length === 0) {
        setCategories([
          { id: "general-knowledge", name: "General Knowledge", count: 24, icon: Brain },
          { id: "science", name: "Science", count: 18, icon: FlaskConical },
          { id: "history", name: "History", count: 15, icon: Landmark },
          { id: "geography", name: "Geography", count: 12, icon: Globe },
          { id: "technology", name: "Technology", count: 10, icon: Cpu },
          { id: "mathematics", name: "Mathematics", count: 8, icon: Calculator },
        ]);
      } else {
        setCategories(sortedCategories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    sessionStorage.setItem(
      "selectedCategory",
      JSON.stringify({ id: category.name, name: category.name, count: category.count })
    );
    navigate("/quiz");
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-3 sm:px-4 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <FolderTree className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-400" />
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Categories</h1>
            <p className="text-xs sm:text-sm text-gray-400">
              {categories.length} categories • {categories.reduce((sum, c) => sum + c.count, 0)} topics
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-[#1E1E3A] border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredCategories.map((category) => {
          const Icon = category.icon || FolderTree;
          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-3 sm:p-4 cursor-pointer hover:border-blue-500/50 transition-all"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base text-white font-medium truncate">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500">{category.count} topics</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No categories found.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Categories;
