import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Users,
  Target,
  Sparkles,
  Trophy,
  Award,
  BookOpen,
  Zap,
  ArrowLeft,
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Smart Learning",
      desc: "Adaptive questions that match your skill level",
    },
    {
      icon: Users,
      title: "Community Driven",
      desc: "Learn and compete with thousands of users",
    },
    {
      icon: Target,
      title: "Track Progress",
      desc: "Detailed analytics to monitor your growth",
    },
    {
      icon: Sparkles,
      title: "Daily Challenges",
      desc: "New content every day to keep you engaged",
    },
  ];

  const stats = [
    { value: "24+", label: "Categories", color: "text-[#6C2BD9]" },
    { value: "100+", label: "Questions", color: "text-[#00C9A7]" },
    { value: "1K+", label: "Active Users", color: "text-yellow-400" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8 md:space-y-12 pb-12">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <Brain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#6C2BD9]" />
          About Cerebrum
        </h1>
      </div>

      {/* Hero Section */}
      <div className="glass-card p-6 sm:p-8 md:p-12 text-center">
        <Brain className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#6C2BD9] mx-auto mb-3 sm:mb-4 animate-pulse" />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
          Empowering Minds Through Knowledge
        </h2>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Cerebrum is a next-generation quiz platform designed to make learning
          engaging, competitive, and fun. Our mission is to help people expand
          their knowledge through interactive challenges.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="glass-card p-4 sm:p-5 md:p-6 hover:border-[#6C2BD9]/30 transition-all duration-300 group"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-[#6C2BD9]/20 rounded-lg group-hover:bg-[#6C2BD9]/30 transition-all flex-shrink-0">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#6C2BD9]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  {feature.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card p-4 sm:p-5 md:p-6 text-center">
            <div
              className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.color} mb-1`}
            >
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="glass-card p-6 sm:p-8 md:p-10 bg-gradient-to-r from-[#6C2BD9]/10 to-[#8B5CF6]/10 border border-[#6C2BD9]/20 text-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
          Join the Community
        </h3>
        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-4 sm:mb-6">
          Start your learning journey today and become part of a community of
          curious minds.
        </p>
        <button
          onClick={() => navigate("/auth")}
          className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default About;
