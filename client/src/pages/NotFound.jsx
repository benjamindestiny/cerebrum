import React from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-[80vh] flex items-center justify-center px-4  text-white border-[#2A2A4A]">
      <div className="text-center max-w-2xl mx-auto  text-white border-[#2A2A4A]">
        <div
          
          
          
          className="relative  text-white border-[#2A2A4A]"
        >
          {/* Animated Brain Logo */}
          <div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block mb-6  text-white border-[#2A2A4A]"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl r   flex items-center justify-center shadow-2xl shadow-blue-500/30  text-white border-[#2A2A4A]">
              <Brain className="w-14 h-14 sm:w-16 sm:h-16 text-white  text-white border-[#2A2A4A]" />
            </div>
          </div>
        </div>

        <h1 className="text-6xl sm:text-8xl font-bold text-white mb-2  text-white border-[#2A2A4A]">404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4  text-white border-[#2A2A4A]">
          Page Not Found
        </h2>

        <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto  text-white border-[#2A2A4A]">
          Oops! The page you're looking for seems to have wandered off into the
          depths of the internet. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center  text-white border-[#2A2A4A]">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white/10 text-white rounded-lg /20 transition-all flex items-center justify-center gap-2  text-white border-[#2A2A4A]"
          >
            <ArrowLeft className="w-5 h-5  text-white border-[#2A2A4A]" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg  transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30  text-white border-[#2A2A4A]"
          >
            <Home className="w-5 h-5  text-white border-[#2A2A4A]" />
            Home
          </button>
          <button
            onClick={() => navigate("/categories")}
            className="px-6 py-3 bg-white/10 text-white rounded-lg /20 transition-all flex items-center justify-center gap-2  text-white border-[#2A2A4A]"
          >
            <Search className="w-5 h-5  text-white border-[#2A2A4A]" />
            Browse Quizzes
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-8 p-4 glass-card border border-white/5  text-white border-[#2A2A4A]">
          <p className="text-sm text-gray-400 mb-3 flex items-center justify-center gap-2  text-white border-[#2A2A4A]">
            <Sparkles className="w-4 h-4 text-teal-400  text-white border-[#2A2A4A]" />
            You might be looking for:
          </p>
          <div className="flex flex-wrap gap-2 justify-center  text-white border-[#2A2A4A]">
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Categories", path: "/categories" },
              { label: "Leaderboard", path: "/leaderboard" },
              { label: "Riddles", path: "/riddles" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="px-3 py-1.5 bg-white/5 /15 rounded-full text-xs text-gray-300 transition-all  text-white border-[#2A2A4A]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-6 text-xs text-gray-500  text-white border-[#2A2A4A]">
          <HelpCircle className="w-3 h-3 inline mr-1  text-white border-[#2A2A4A]" />
          Did you know? The human brain can process information up to 120 meters
          per second!
        </div>
      </div>
    </div>
  );
};

export default NotFound;
