import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Brain,
  Sparkles,
  Trophy,
  Users,
  Zap,
  TrendingUp,
  FolderTree,
  Clock,
  ChevronRight,
  Award,
  Target,
  BookOpen,
  Gamepad2,
  Globe,
  Star,
  Flame,
  PartyPopper,
  Rocket,
  Coffee,
  MessageCircle,
  Eye,
  UserPlus,
  ArrowRight,
  CheckCircle,
  Play,
  Shield,
  Gift,
  BarChart3,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const stats = [
    { icon: Brain, value: "1000+", label: "Questions" },
    { icon: Users, value: "5,000+", label: "Active Learners" },
    { icon: Trophy, value: "50+", label: "Categories" },
    { icon: Zap, value: "24/7", label: "Available" },
  ];

  const features = [
    {
      icon: FolderTree,
      title: "Smart Categories",
      desc: "Browse 50+ topics with a powerful category explorer",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Gamepad2,
      title: "Multiplayer Battles",
      desc: "Challenge friends in real-time quiz competitions",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: BookOpen,
      title: "Read & Test",
      desc: "Learn with articles and test your comprehension",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Sparkles,
      title: "Riddle Challenge",
      desc: "Solve brain teasers and earn points",
      color: "from-orange-500 to-red-500",
    },
  ];

  const howItWorks = [
    {
      icon: Brain,
      title: "Choose Your Topic",
      desc: "Select from 50+ categories across multiple subjects",
      step: "01",
    },
    {
      icon: Target,
      title: "Learn & Practice",
      desc: "Read articles, take quizzes, and test your knowledge",
      step: "02",
    },
    {
      icon: Trophy,
      title: "Track Progress",
      desc: "Earn points, climb leaderboards, and master topics",
      step: "03",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 pb-12">
      {/* ============================================
      HERO SECTION
      ============================================ */}
      <section className="relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6C2BD9]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00C9A7]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6C2BD9]/5 rounded-full blur-3xl -z-10"></div>

        <div className="app-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto px-2 sm:px-0"
          >
            {/* Logo Animation */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6C2BD9] to-[#8B5CF6] flex items-center justify-center shadow-2xl shadow-[#6C2BD9]/30">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Master Any Subject with{" "}
              <span className="bg-gradient-to-r from-[#6C2BD9] via-[#8B5CF6] to-[#00C9A7] bg-clip-text text-transparent">
                Cerebrum
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8">
              The interactive learning platform where you can read, test,
              compete, and master any subject. Join thousands of learners
              worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                className="btn-primary flex items-center gap-2 text-lg px-8 py-4 shadow-lg shadow-[#6C2BD9]/30"
              >
                <UserPlus className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/categories")}
                className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
              >
                <Eye className="w-5 h-5" />
                Explore Categories
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-2 text-gray-400">5,000+ learners</span>
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#6C2BD9]" />
                <span className="text-gray-400">Join for free</span>
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-[#00C9A7]" />
                <span className="text-gray-400">Start instantly</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
      STATS SECTION
      ============================================ */}
      <section className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-[#6C2BD9] mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================================
      FEATURES SECTION
      ============================================ */}
      <section className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-[#6C2BD9] to-[#8B5CF6] bg-clip-text text-transparent">
                Cerebrum
              </span>
              <span className="text-white">?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to learn, test, and master any subject
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="glass-card p-6 border border-white/5 hover:border-[#6C2BD9]/30 transition-all duration-300 group"
              >
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-20 inline-block mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============================================
      HOW IT WORKS
      ============================================ */}
      <section className="container mx-auto px-4 max-w-7xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerChildren}
          className="glass-card p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-br from-[#6C2BD9]/10 to-[#8B5CF6]/10 border border-[#6C2BD9]/20"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three simple steps to start your learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center relative"
              >
                <div className="text-5xl font-bold text-[#6C2BD9]/20 mb-4">
                  {item.step}
                </div>
                <div className="p-4 bg-[#6C2BD9]/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-[#6C2BD9]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="text-center mt-10">
            <button
              onClick={() => navigate("/auth")}
              className="btn-primary flex items-center gap-2 mx-auto px-8 py-3"
            >
              <Play className="w-5 h-5" />
              Start Learning Now
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
      CTA SECTION
      ============================================ */}
      <section className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-r from-[#6C2BD9]/30 to-[#00C9A7]/30 border border-white/10 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-6"
            >
              <PartyPopper className="w-16 h-16 text-yellow-400" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of learners and start mastering new topics today.
              It's completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                className="btn-primary flex items-center gap-2 px-8 py-4 shadow-lg shadow-[#6C2BD9]/30 text-lg"
              >
                <UserPlus className="w-5 h-5" />
                Sign Up Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/categories")}
                className="btn-secondary flex items-center gap-2 px-8 py-4 text-lg"
              >
                <Eye className="w-5 h-5" />
                Browse Categories
              </motion.button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Coffee className="w-4 h-4" /> No credit card required
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" /> Privacy protected
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-1">
                <Gift className="w-4 h-4" /> 100% free to start
              </span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
