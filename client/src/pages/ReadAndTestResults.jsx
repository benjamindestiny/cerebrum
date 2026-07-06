import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, Check, X, BookOpen, Share, RefreshCw,
  Loader2, Award, ArrowLeft, Brain, Sparkles,
  TrendingUp, Target, Clock, Star, Medal,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';

const ReadAndTestResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadResults();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadResults = () => {
    const storedResults = sessionStorage.getItem('readTestResults');
    
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        setResults(parsed);
      } catch (err) {
        console.error('Error parsing results:', err);
        setError('Failed to parse results data');
      }
    } else if (location.state) {
      setResults(location.state);
    } else {
      setError('No results found. Please complete a quiz first.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#7c3aed] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">No Results Found</h2>
        <p className="text-gray-400 mt-2">
          {error || 'Complete a Read & Test quiz first to see your results here.'}
        </p>
        <button onClick={() => navigate('/read-and-test')} className="btn-primary mt-6 flex items-center gap-2 mx-auto">
          <BookOpen className="w-4 h-4" /> Browse Articles
        </button>
      </div>
    );
  }

  const { 
    score, 
    correct, 
    total, 
    questions, 
    answers, 
    title,
    category,
    subcategory,
    timeSpent,
    date,
    icon,
    articleId
  } = results;

  const getGrade = () => {
    if (score >= 90) return { label: 'Outstanding! 🏆', color: 'text-yellow-400', emoji: '🏆' };
    if (score >= 70) return { label: 'Great Job! 🌟', color: 'text-[#00C9A7]', emoji: '🌟' };
    if (score >= 50) return { label: 'Good Effort! 💪', color: 'text-[#7c3aed]', emoji: '💪' };
    return { label: 'Keep Learning! 📚', color: 'text-gray-400', emoji: '📚' };
  };

  const grade = getGrade();

  const handleShare = () => {
    const shareText = `I scored ${score}% on "${title}" in the Read & Test section on Cerebrum! 🧠 Can you beat my score?`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Read & Test Results',
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success('Results copied to clipboard!');
      }).catch(() => {});
    }
  };

  const handleRetry = () => {
    sessionStorage.removeItem('readTestResults');
    navigate('/read-and-test');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/read-and-test')} 
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">{icon || '📚'}</span>
          <span className="text-sm text-[#7c3aed]">{category}</span>
          <span className="text-xs text-gray-500">• {subcategory}</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>

        <div className="relative inline-block mb-6">
          <motion.div 
            className="w-40 h-40 rounded-full border-8 border-white/10 flex items-center justify-center"
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div 
                className="text-5xl font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {score}%
              </motion.div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
          </motion.div>
        </div>
        
        <h2 className={`text-3xl font-bold ${grade.color}`}>
          {grade.label}
        </h2>
        <p className="text-gray-400 mt-1">
          You got <span className="text-white font-bold">{correct}</span> out of <span className="text-white font-bold">{total}</span> questions correct
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-[#00C9A7]">{correct}</div>
            <div className="text-xs text-gray-400">Correct</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{total - correct}</div>
            <div className="text-xs text-gray-400">Incorrect</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeSpent || 0} minutes
          </span>
          <span>•</span>
          <span>{date || new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex gap-4 mt-8 justify-center flex-wrap">
          <button 
            onClick={() => {
              sessionStorage.removeItem('readTestResults');
              navigate('/read-and-test');
            }} 
            className="btn-primary flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> More Articles
          </button>
          <button 
            onClick={handleRetry} 
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry Quiz
          </button>
          <button 
            onClick={handleShare} 
            className="btn-secondary flex items-center gap-2"
          >
            <Share className="w-4 h-4" /> Share
          </button>
        </div>
      </motion.div>

      {questions && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7c3aed]" />
            Answer Review
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((q, index) => {
              const userAnswer = answers?.[index];
              const isCorrect = userAnswer === q.correct;
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${
                  isCorrect ? 'border-[#00C9A7]/30 bg-[#00C9A7]/5' : 'border-red-400/30 bg-red-400/5'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-[#00C9A7]" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{q.question}</p>
                      <div className="mt-1 text-sm">
                        <span className="text-gray-400">Your answer: </span>
                        <span className={isCorrect ? 'text-[#00C9A7]' : 'text-red-400'}>
                          {userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="text-sm mt-1">
                          <span className="text-gray-400">Correct answer: </span>
                          <span className="text-[#00C9A7]">{q.options[q.correct]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 bg-gradient-to-r from-[#7c3aed]/10 to-[#a78bfa]/10 border border-[#7c3aed]/20"
      >
        <div className="flex items-start gap-4">
          <Brain className="w-6 h-6 text-[#7c3aed] mt-1" />
          <div>
            <h3 className="text-white font-semibold">Recommended for You</h3>
            <p className="text-sm text-gray-400 mt-1">
              {score >= 70 
                ? 'Great job! Try a more challenging article next time.' 
                : 'Keep practicing! Try reading the article again or choose a similar topic.'}
            </p>
            <button 
              onClick={() => navigate('/read-and-test')} 
              className="mt-3 text-sm text-[#7c3aed] hover:text-[#a78bfa] transition-colors flex items-center gap-1"
            >
              Browse more articles <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReadAndTestResults;
