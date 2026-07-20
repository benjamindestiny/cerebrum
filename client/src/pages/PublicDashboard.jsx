import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Rocket,
  Trophy,
  Users,
  Zap,
  ArrowRight,
  UserPlus,
  Eye,
  Star,
  BookOpen,
  Sparkles,
  Puzzle,
  Gamepad2,
  Coffee,
  Shield,
  Gift,
  FolderTree,
  Target,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { supabase } from "../services/supabase";

const PublicDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadRealStats = async () => {
    setLoading(true);
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      // Get total quiz results
      const { count: quizCount } = await supabase
        .from("quiz_results")
        .select("*", { count: "exact", head: true });

      // Get total questions from quiz_results
      const { data: quizData } = await supabase
        .from("quiz_results")
        .select("total_questions");

      let totalQuestions = 0;
      if (quizData) {
        totalQuestions = quizData.reduce(
          (sum, q) => sum + (q.total_questions || 0),
          0
        );
      }

      // Get unique categories
      const { data: categories } = await supabase
        .from("quiz_results")
        .select("category")
        .not("category", "is", null);

      const uniqueCategories = new Set(categories?.map(c => c.category) || []);
      const totalCategories = uniqueCategories.size || 12;

      setStats({
        totalUsers: userCount || 0,
        totalQuizzes: quizCount || 0,
        totalQuestions: totalQuestions || 0,
        totalCategories: Math.max(totalCategories, 12),
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      // Fallback to cached or default values
      setStats(prev => ({
        totalUsers: prev.totalUsers || 24,
        totalQuizzes: prev.totalQuizzes || 0,
        totalQuestions: prev.totalQuestions || 0,
        totalCategories: prev.totalCategories || 12,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Load stats on mount and refresh every 30 seconds
  useEffect(() => {
    loadRealStats();
    
    // Refresh stats every 30 seconds (for live updates)
    const interval = setInterval(() => {
      loadRealStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: FolderTree,
      title: "Smart Categories",
      desc: "Browse 50+ topics with a powerful category explorer",
    },
    {
      icon: Gamepad2,
      title: "Multiplayer Battles",
      desc: "Challenge friends in real-time quiz competitions",
    },
    {
      icon: BookOpen,
      title: "Read & Test",
      desc: "Learn with articles and test your comprehension",
    },
    {
      icon: Puzzle,
      title: "Riddle Challenge",
      desc: "Solve brain teasers and earn points",
    },
  ];

  const statsData = [
    { icon: Trophy, value: stats.totalQuizzes, label: "Quizzes Taken" },
    { icon: Users, value: stats.totalUsers, label: "Active Learners" },
    { icon: Brain, value: stats.totalCategories, label: "Categories" },
    { icon: Zap, value: stats.totalQuestions, label: "Questions" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#2A1535] animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-12 pb-12 px-4"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Master Any Subject with{" "}
              <span className="text-[#2A1535]">Cerebrum</span>
            </h1>

            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              The interactive learning platform where you can read, test,
              compete, and master any subject. Join learners worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/auth")}
                className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <UserPlus className="w-5 h-5" /> Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-lg font-semibold border border-white/10"
              >
                <Eye className="w-5 h-5" /> Explore Categories
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                {stats.totalUsers} learners
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-[#2A1535]" />
                Start instantly
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-teal-400 fill-teal-400" />
                100% free
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-blue-500/30 transition-all"
            >
              <stat.icon className="w-6 h-6 text-[#2A1535] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {stat.value > 1000
                  ? `${(stat.value / 1000).toFixed(1)}K+`
                  : stat.value || 0}
              </div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Why Choose <span className="text-[#2A1535]">Cerebrum</span>?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Everything you need to learn, test, and master any subject
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/30 transition-all"
            >
              <div className="p-3 bg-blue-500/10 rounded-lg inline-block mb-3">
                <feature.icon className="w-6 h-6 text-[#2A1535]" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-7xl">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-8 sm:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-300 mb-6">
              Join {stats.totalUsers} learners and start mastering new topics
              today. It's completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/auth")}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 font-semibold"
              >
                <UserPlus className="w-5 h-5" /> Sign Up Free
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="px-8 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <Eye className="w-5 h-5" /> Browse Categories
              </button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Coffee className="w-4 h-4" /> No credit card required
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" /> Privacy protected
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1">
                <Gift className="w-4 h-4" /> 100% free to start
              </span>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default PublicDashboard;
