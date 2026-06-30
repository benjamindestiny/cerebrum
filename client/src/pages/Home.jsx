import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Sparkles, Trophy, Users, 
  Zap, TrendingUp, Award, Clock,
  ArrowRight, Target, FolderTree,
  Puzzle, BarChart3
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Brain, value: '100+', label: 'Questions', color: 'text-[#6C2BD9]' },
    { icon: Users, value: '1K+', label: 'Players', color: 'text-blue-400' },
    { icon: Trophy, value: '24', label: 'Categories', color: 'text-yellow-400' },
    { icon: Zap, value: '3', label: 'Difficulties', color: 'text-[#00C9A7]' },
  ];

  const features = [
    { icon: FolderTree, title: 'Category Tree', desc: 'Browse categories like a file explorer' },
    { icon: TrendingUp, title: 'Smart Learning', desc: 'Track your progress across categories' },
    { icon: Target, title: 'Difficulty Levels', desc: 'Choose from Easy, Medium, or Hard' },
    { icon: Award, title: 'Achievements', desc: 'Earn badges and build your streak' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C2BD9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00C9A7]/10 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <Brain className="w-16 h-16 text-[#6C2BD9] mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-[#6C2BD9] to-[#8B5CF6] bg-clip-text text-transparent">
              Cerebrum
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Master any subject with our interactive quiz platform. 
            Explore categories, track your progress, and compete with others!
          </p>
          <div className="flex gap-4 justify-center mt-6 flex-wrap">
            <button 
              onClick={() => navigate('/categories')}
              className="btn-primary flex items-center gap-2"
            >
              <FolderTree className="w-4 h-4" />
              Explore Categories
            </button>
            <button 
              onClick={() => navigate('/quiz')}
              className="btn-secondary flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Quick Quiz
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="glass-card p-6 hover:border-[#6C2BD9]/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#6C2BD9]/20 rounded-lg">
                <feature.icon className="w-6 h-6 text-[#6C2BD9]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start */}
      <div className="glass-card p-6 bg-gradient-to-r from-[#6C2BD9]/10 to-[#8B5CF6]/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#6C2BD9]/20 rounded-full">
              <Clock className="w-6 h-6 text-[#6C2BD9]" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Ready to Challenge Yourself?</h3>
              <p className="text-sm text-gray-400">Start a random quiz and test your knowledge</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/quiz')}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
