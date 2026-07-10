import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Home,
  ArrowLeft,
  Search,
  HelpCircle,
  Sparkles,
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Animated Brain Logo */}
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
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#6C2BD9] to-[#8B5CF6] flex items-center justify-center shadow-2xl shadow-[#6C2BD9]/30">
              <Brain className="w-14 h-14 sm:w-16 sm:h-16 text-white" />
            </div>
          </motion.div>
        </motion.div>

        <h1 className="text-6xl sm:text-8xl font-bold text-white mb-2">404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off into the
          depths of the internet. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#7c3aed]/30"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={() => navigate("/categories")}
            className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Browse Quizzes
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-8 p-4 glass-card border border-white/5">
          <p className="text-sm text-gray-400 mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            You might be looking for:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Categories", path: "/categories" },
              { label: "Leaderboard", path: "/leaderboard" },
              { label: "Riddles", path: "/riddles" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-300 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-6 text-xs text-gray-500">
          <HelpCircle className="w-3 h-3 inline mr-1" />
          Did you know? The human brain can process information up to 120 meters
          per second!
        </div>
      </div>
    </div>
  );
};

export default NotFound;
