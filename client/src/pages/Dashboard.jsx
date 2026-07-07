import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Trophy, Award, Clock, 
  TrendingUp, Target, BookOpen, Zap,
  User, CheckCircle, BarChart3,
  ArrowRight, Sparkles, Flame, Loader2,
  Brain, Puzzle, RefreshCw
} from 'lucide-react';
import { supabase } from '../services/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      setUser(user);
      
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
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
      
      const { data: quizResults, error: quizError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (quizError) {
        console.error('Error fetching quiz results:', quizError);
      }
      
      if (quizResults && quizResults.length > 0) {
        setRecentQuizzes(quizResults);
        
        let totalScore = 0;
        let bestScore = 0;
        let totalPoints = 0;
        let totalTime = 0;
        let quizCount = quizResults.length;
        
        quizResults.forEach(q => {
          totalScore += q.score || 0;
          bestScore = Math.max(bestScore, q.score || 0);
          totalPoints += q.points || 0;
          totalTime += q.time_taken || 0;
        });
        
        const avgScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;
        
        setStats(prev => ({
          ...prev,
          totalQuizzes: quizCount,
          bestScore: bestScore,
          averageScore: avgScore,
          totalTime: totalTime,
          totalPoints: totalPoints
        }));
      } else {
        setRecentQuizzes([]);
      }
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-[#7c3aed] animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-400 text-sm sm:text-base">Loading dashboard...</p>
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
    <div className="space-y-4 sm:space-y-6 md:space-y-8 px-3 sm:px-4 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#a78bfa]" />
            Welcome back!
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            <span className="text-white font-medium">{profile?.name || user?.email?.split('@')[0]}</span>
            , ready to learn something new today?
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/categories')}
            className="btn-primary flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
          >
            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Start Quiz</span>
            <span className="sm:hidden">Quiz</span>
          </button>
          <button
            onClick={handleSignOut}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-xs sm:text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-3 sm:p-4 md:p-6 text-center"
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stat.color}`} />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card p-4 sm:p-5 md:p-6 cursor-pointer hover:border-[#7c3aed]/50 transition-all"
          onClick={() => navigate('/categories')}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-[#7c3aed]/20 rounded-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#a78bfa]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium text-sm sm:text-base">Take a Quiz</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Test your knowledge</p>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card p-4 sm:p-5 md:p-6 cursor-pointer hover:border-[#7c3aed]/50 transition-all"
          onClick={() => navigate('/riddles')}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-yellow-400/20 rounded-lg">
              <Puzzle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium text-sm sm:text-base">Solve Riddles</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Earn bonus points</p>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-card p-4 sm:p-5 md:p-6 cursor-pointer hover:border-[#7c3aed]/50 transition-all"
          onClick={() => navigate('/read-and-test')}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-green-400/20 rounded-lg">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium text-sm sm:text-base">Read & Test</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Learn and test</p>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity - Responsive */}
      <div className="glass-card p-4 sm:p-5 md:p-6">
        <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#a78bfa]" />
          Recent Activity
        </h2>
        {stats.totalQuizzes === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🚀</div>
            <p className="text-gray-400 text-sm sm:text-base">No activity yet. Start your first quiz!</p>
            <button
              onClick={() => navigate('/categories')}
              className="btn-primary mt-3 sm:mt-4 text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2"
            >
              Start Learning
            </button>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {recentQuizzes.map((quiz, index) => {
              const categoryName = typeof quiz.category === 'object' 
                ? quiz.category?.name || 'Quiz' 
                : quiz.category || 'Quiz';
              const difficulty = quiz.difficulty || 'medium';
              const score = quiz.score || 0;
              
              return (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors gap-2 sm:gap-0">
                  <div>
                    <div className="text-white font-medium text-sm sm:text-base">{categoryName}</div>
                    <div className="text-[10px] sm:text-xs text-gray-400">
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} • {quiz.total_questions || 0} questions
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto flex sm:block justify-between items-center sm:items-end">
                    <div className={`text-base sm:text-lg font-bold ${
                      score >= 80 ? 'text-green-400' : 
                      score >= 50 ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {score}%
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-400">
                      {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : 'Today'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Link */}
      <div className="text-center">
        <button
          onClick={() => navigate('/profile')}
          className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-2 mx-auto"
        >
          <User className="w-3 h-3 sm:w-4 sm:h-4" />
          View Profile
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;