import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Trophy, Award, Clock, 
  TrendingUp, Target, BookOpen, Zap,
  User, Calendar, CheckCircle, BarChart3,
  ArrowRight, Sparkles, Flame, Loader2,
  Brain, Puzzle
} from 'lucide-react';
import { supabase } from '../services/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    bestScore: 0,
    averageScore: 0,
    totalTime: 0,
    streak: 0,
    riddlesSolved: 0,
    totalPoints: 0
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      setUser(user);
      
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
      }
      
      if (profileData) {
        setProfile(profileData);
        const statsData = profileData.stats || {};
        setStats({
          totalQuizzes: statsData.total_quizzes || 0,
          bestScore: statsData.best_score || 0,
          averageScore: statsData.average_score || 0,
          totalTime: statsData.total_time || 0,
          streak: statsData.streak || 0,
          riddlesSolved: statsData.riddles_solved || 0,
          totalPoints: statsData.total_points || 0
        });
      }
      
      // Get recent quiz results
      const { data: quizResults, error: quizError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (quizError) {
        console.error('Quiz results error:', quizError);
      }
      
      if (quizResults) {
        setRecentQuizzes(quizResults);
      }
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#7c3aed] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      icon: Trophy, 
      value: stats.bestScore || 0, 
      label: 'Best Score',
      suffix: '%',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10'
    },
    { 
      icon: BarChart3, 
      value: stats.averageScore || 0, 
      label: 'Average Score',
      suffix: '%',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    { 
      icon: CheckCircle, 
      value: stats.totalQuizzes || 0, 
      label: 'Quizzes Taken',
      suffix: '',
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    { 
      icon: Flame, 
      value: stats.streak || 0, 
      label: 'Day Streak',
      suffix: '🔥',
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#a78bfa]" />
            Welcome back!
          </h1>
          <p className="text-gray-400 mt-1">
            <span className="text-white font-medium">{profile?.name || user?.email?.split('@')[0]}</span>
            , ready to learn something new today?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/categories')}
            className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
          >
            <Target className="w-4 h-4" />
            Start Quiz
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card p-6 cursor-pointer hover:border-[#7c3aed]/50 transition-all"
          onClick={() => navigate('/categories')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#7c3aed]/20 rounded-lg">
              <Target className="w-6 h-6 text-[#a78bfa]" />
            </div>
            <div>
              <h3 className="text-white font-medium">Take a Quiz</h3>
              <p className="text-gray-400 text-sm">Test your knowledge</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 ml-auto" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card p-6 cursor-pointer hover:border-[#7c3aed]/50 transition-all"
          onClick={() => navigate('/riddles')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/20 rounded-lg">
              <Puzzle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Solve Riddles</h3>
              <p className="text-gray-400 text-sm">Earn bonus points</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 ml-auto" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card p-6 cursor-pointer hover:border-[#7c3aed]/50 transition-all"
          onClick={() => navigate('/read-and-test')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-400/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Read & Test</h3>
              <p className="text-gray-400 text-sm">Learn and test</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 ml-auto" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#a78bfa]" />
          Recent Activity
        </h2>
        {stats.totalQuizzes === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-gray-400">No activity yet. Start your first quiz!</p>
            <button
              onClick={() => navigate('/categories')}
              className="btn-primary mt-4 text-sm px-6 py-2"
            >
              Start Learning
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentQuizzes.map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{quiz.category?.name || 'Quiz'}</div>
                  <div className="text-xs text-gray-400">
                    {quiz.difficulty} • {quiz.total_questions} questions
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    quiz.score >= 80 ? 'text-green-400' : 
                    quiz.score >= 50 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {quiz.score}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(quiz.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Link */}
      <div className="text-center">
        <button
          onClick={() => navigate('/profile')}
          className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
        >
          <User className="w-4 h-4" />
          View Profile
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
