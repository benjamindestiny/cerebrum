import React from "react";
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
} from "lucide-react";

const PublicDashboard = () => {
  const navigate = useNavigate();

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
      icon: Puzzle,
      title: "Riddle Challenge",
      desc: "Solve brain teasers and earn points",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { icon: Brain, value: "1000+", label: "Questions" },
    { icon: Users, value: "5,000+", label: "Active Learners" },
    { icon: Trophy, value: "50+", label: "Categories" },
    { icon: Zap, value: "24/7", label: "Available" },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12 pb-12 px-3 sm:px-4">
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-[#6C2BD9]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-[#00C9A7]/10 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-2 sm:px-4 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-4 sm:mb-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#6C2BD9] to-[#8B5CF6] flex items-center justify-center shadow-2xl shadow-[#6C2BD9]/30">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Master Any Subject with{" "}
              <span className="bg-gradient-to-r from-[#6C2BD9] via-[#8B5CF6] to-[#00C9A7] bg-clip-text text-transparent">
                Cerebrum
              </span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              The interactive learning platform where you can read, test,
              compete, and master any subject. Join thousands of learners
              worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate("/auth")}
                className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center gap-2 text-sm sm:text-base md:text-lg shadow-lg shadow-[#7c3aed]/30"
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Get Started Free{" "}
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-sm sm:text-base md:text-lg"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> Explore Categories
              </button>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <span className="flex items-center gap-1 sm:gap-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 sm:ml-2 text-gray-400">
                  5,000+ learners
                </span>
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-1 sm:gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#6C2BD9]" />
                <span className="text-gray-400">Join for free</span>
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-1 sm:gap-2">
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-[#00C9A7]" />
                <span className="text-gray-400">Start instantly</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-2 sm:px-4 max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card p-3 sm:p-4 md:p-6 text-center"
            >
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#6C2BD9] mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-2 sm:px-4 max-w-7xl">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#6C2BD9] to-[#8B5CF6] bg-clip-text text-transparent">
              Cerebrum
            </span>
            <span className="text-white">?</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to learn, test, and master any subject
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-4 sm:p-5 md:p-6 border border-white/5 hover:border-[#6C2BD9]/30 transition-all duration-300 group"
            >
              <div
                className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-20 inline-block mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-2 sm:px-4 max-w-7xl">
        <div className="glass-card p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-r from-[#6C2BD9]/30 to-[#00C9A7]/30 border border-white/10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block mb-4 sm:mb-6">
              <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-yellow-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
              Join thousands of learners and start mastering new topics today.
              It's completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate("/auth")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm sm:text-base md:text-lg shadow-lg shadow-[#6C2BD9]/30 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Sign Up Free
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm sm:text-base md:text-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> Browse Categories
              </button>
            </div>
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Coffee className="w-3 h-3 sm:w-4 sm:h-4" /> No credit card
                required
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" /> Privacy protected
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-1">
                <Gift className="w-3 h-3 sm:w-4 sm:h-4" /> 100% free to start
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicDashboard;
