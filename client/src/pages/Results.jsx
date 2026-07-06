import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, Check, X, BookOpen, Share, RefreshCw,
  Loader2, Award, ArrowLeft, Sparkles,
  TrendingUp, Clock, Star, Copy, CheckCircle,
  Twitter, Target
} from 'lucide-react';
import { decodeHTML } from '../services/quizApi';
import { toast } from 'react-toastify';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get results from sessionStorage
    const stored = sessionStorage.getItem('quizResults');
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResults(parsed);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error parsing results:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#6C2BD9] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">No Results Found</h2>
        <p className="text-gray-400 mt-2">Complete a quiz first to see your results here.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-6">
          Go Home
        </button>
      </div>
    );
  }

  const { score, correct, total, questions, answers, category, difficulty } = results;
  
  const getGrade = () => {
    if (score >= 90) return { label: 'Outstanding!', icon: '🏆', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    if (score >= 70) return { label: 'Great Job!', icon: '🌟', color: 'text-[#00C9A7]', bg: 'bg-[#00C9A7]/10' };
    if (score >= 50) return { label: 'Good Effort!', icon: '💪', color: 'text-[#6C2BD9]', bg: 'bg-[#6C2BD9]/10' };
    return { label: 'Keep Learning!', icon: '📚', color: 'text-gray-400', bg: 'bg-gray-400/10' };
  };

  const grade = getGrade();

  const shareResults = async () => {
    const shareText = `🧠 I scored ${score}% on "${category || 'Quiz'}"! ${correct}/${total} correct. Challenge me on Cerebrum! 🎯`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Quiz Results',
          text: shareText,
        });
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShareCopied(true);
        toast.success('Results copied!', { position: 'top-right', autoClose: 1500 });
        setTimeout(() => setShareCopied(false), 3000);
      } catch {
        toast.error('Failed to copy.', { position: 'top-right' });
      }
    }
  };

  const shareOnTwitter = () => {
    const text = `🧠 I scored ${score}% on "${category || 'Quiz'}"! ${correct}/${total} correct. Try it on Cerebrum!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getDifficultyColor = () => {
    if (difficulty === 'easy') return 'text-green-400 bg-green-500/20';
    if (difficulty === 'medium') return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </button>

      {/* Main Results Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`glass-card p-8 text-center ${grade.bg}`}
      >
        {/* Grade Icon */}
        <div className={`text-5xl ${grade.color} mb-2`}>
          {grade.icon}
        </div>

        {/* Score Circle */}
        <div className="relative inline-block mb-4">
          <div className="w-36 h-36 rounded-full border-4 border-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-white">
                {score}%
              </div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
          </div>
        </div>
        
        <h2 className={`text-3xl font-bold ${grade.color}`}>
          {grade.label}
        </h2>
        
        <p className="text-gray-400 text-sm mt-1">
          You got <span className="text-white font-bold">{correct}</span> out of <span className="text-white font-bold">{total}</span> questions correct
        </p>

        {/* Quiz Info */}
        <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {category || 'General'}
          </span>
          <span className="w-px h-3 bg-gray-700"></span>
          <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor()}`}>
            {difficulty || 'Medium'}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-[#00C9A7]">{correct}</div>
            <div className="text-xs text-gray-400">Correct</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-400">{total - correct}</div>
            <div className="text-xs text-gray-400">Incorrect</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          <button 
            onClick={() => navigate('/categories')} 
            className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> New Quiz
          </button>
          
          <button 
            onClick={() => setShowReview(!showReview)} 
            className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> {showReview ? 'Hide' : 'Review'}
          </button>

          <button 
            onClick={shareResults}
            className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2"
          >
            {shareCopied ? <CheckCircle className="w-4 h-4 text-[#00C9A7]" /> : <Share className="w-4 h-4" />}
            {shareCopied ? 'Copied!' : 'Share'}
          </button>
          
          <button 
            onClick={shareOnTwitter}
            className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2"
          >
            <Twitter className="w-4 h-4 text-blue-400" /> Tweet
          </button>
        </div>
      </motion.div>

      {/* Pro Plan Note */}
      <div className="glass-card p-4 border border-yellow-400/20 bg-yellow-400/5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-300">
              <span className="text-yellow-400 font-medium">Pro Tip:</span> Upgrade to Pro to get detailed explanations for every question!
            </p>
          </div>
        </div>
      </div>

      {/* Answer Review Section */}
      {showReview && questions && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#6C2BD9]" />
            Answer Review
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {questions.map((q, i) => {
              const userAnswer = answers?.[i];
              const isCorrect = userAnswer === q.correct_answer;
              return (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border ${
                    isCorrect ? 'border-[#00C9A7]/30 bg-[#00C9A7]/5' : 'border-red-400/30 bg-red-400/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-[#00C9A7]" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{decodeHTML(q.question)}</p>
                      <div className="mt-1 text-sm">
                        <span className="text-gray-400">Your answer: </span>
                        <span className={isCorrect ? 'text-[#00C9A7]' : 'text-red-400'}>
                          {userAnswer || 'Not answered'}
                        </span>
                        {!isCorrect && (
                          <span className="text-gray-400 ml-2">
                            ✓ <span className="text-[#00C9A7]">{decodeHTML(q.correct_answer)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Results;
