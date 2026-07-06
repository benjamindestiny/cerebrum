import React from 'react';
import { 
  Brain, Users, Target, Sparkles, 
  Trophy, Award, BookOpen, Zap 
} from 'lucide-react';

const About = () => {
  const features = [
    { icon: Brain, title: 'Smart Learning', desc: 'Adaptive questions that match your skill level' },
    { icon: Users, title: 'Community Driven', desc: 'Learn and compete with thousands of users' },
    { icon: Target, title: 'Track Progress', desc: 'Detailed analytics to monitor your growth' },
    { icon: Sparkles, title: 'Daily Challenges', desc: 'New content every day to keep you engaged' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <Brain className="w-20 h-20 text-[#6C2BD9] mx-auto mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold text-white">About Cerebrum</h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Cerebrum is a next-generation quiz platform designed to make learning engaging, 
          competitive, and fun. Our mission is to help people expand their knowledge 
          through interactive challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="glass-card p-6 hover:border-[#6C2BD9]/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#6C2BD9]/20 rounded-lg">
                <feature.icon className="w-6 h-6 text-[#6C2BD9]" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{feature.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-[#6C2BD9] mb-1">24+</div>
          <div className="text-sm text-gray-400">Categories</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-[#00C9A7] mb-1">100+</div>
          <div className="text-sm text-gray-400">Questions</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">1K+</div>
          <div className="text-sm text-gray-400">Active Users</div>
        </div>
      </div>

      <div className="glass-card p-8 bg-gradient-to-r from-[#6C2BD9]/10 to-[#8B5CF6]/10 border border-[#6C2BD9]/20 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Join the Community</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Start your learning journey today and become part of a community of curious minds.
        </p>
        <button className="btn-primary mt-4">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default About;
