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
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-[#6C2BD9] animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-400 text-sm sm:text-base">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-8 sm:py-12 max-w-md mx-auto px-4">
        <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-white">No Results Found</h2>
        <p className="text-gray-400 text-sm sm:text-base mt-2">Complete a quiz first to see your results here.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4 sm:mt-6 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const { score, correct, total, questions, answers, category, difficulty } = results;
  
  const getGrade = () => {
    if (score >= 90) return { label: 'Outstanding! 🏆', color: 'text-yellow-400', emoji: '🏆' };
    if (score >= 70) return { label: 'Great Job! 🌟', color: 'text-[#00C9A7]', emoji: '🌟' };
    if (score >= 50) return { label: 'Good Effort! 💪', color: 'text-[#6C2BD9]', emoji: '💪' };
    return { label: 'Keep Learning! 📚', color: 'text-gray-400', emoji: '📚' };
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
        // toast.'Results copied!', { position: 'top-right', autoClose: 1500 });
        setTimeout(() => setShareCopied(false), 3000);
      } catch {
        // toast.'Failed to copy.', { position: 'top-right' });
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
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4">
      {/* Back Button - Goes to Dashboard */}
      <button 
        onClick={() => navigate('/dashboard')} 
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs sm:text-sm"
      >
        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Dashboard
      </button>

      {/* Main Results Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-4 sm:p-6 md:p-8 text-center"
      >
        <div className={`text-3xl sm:text-4xl md:text-5xl ${grade.color} mb-2`}>
          {grade.emoji}
        </div>

        <div className="relative inline-block mb-3 sm:mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full border-4 border-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                {score}%
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400">Score</div>
            </div>
          </div>
        </div>
        
        <h2 className={`text-2xl sm:text-3xl font-bold ${grade.color}`}>
          {grade.label}
        </h2>
        
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          You got <span className="text-white font-bold">{correct}</span> out of <span className="text-white font-bold">{total}</span> questions correct
        </p>

        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 text-[10px] sm:text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {category || 'General'}
          </span>
          <span className="w-px h-3 bg-gray-700"></span>
          <span className={`px-1.5 sm:px-2 py-0.5 rounded-full ${getDifficultyColor()}`}>
            {difficulty || 'Medium'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
          <div className="bg-white/5 rounded-lg p-2 sm:p-3">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#00C9A7]">{correct}</div>
            <div className="text-[10px] sm:text-xs text-gray-400">Correct</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 sm:p-3">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-400">{total - correct}</div>
            <div className="text-[10px] sm:text-xs text-gray-400">Incorrect</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 sm:p-3">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{total}</div>
            <div className="text-[10px] sm:text-xs text-gray-400">Total</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 sm:mt-6 justify-center">
          <button 
            onClick={() => navigate('/categories')} 
            className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2.5 flex items-center gap-1 sm:gap-2"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" /> New Quiz
          </button>
          
          <button 
            onClick={() => setShowReview(!showReview)} 
            className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2.5 flex items-center gap-1 sm:gap-2"
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" /> {showReview ? 'Hide' : 'Review'}
          </button>

          <button 
            onClick={shareResults}
            className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2.5 flex items-center gap-1 sm:gap-2"
          >
            {shareCopied ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#00C9A7]" /> : <Share className="w-3 h-3 sm:w-4 sm:h-4" />}
            {shareCopied ? 'Copied!' : 'Share'}
          </button>
          
          <button 
            onClick={shareOnTwitter}
            className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2.5 flex items-center gap-1 sm:gap-2"
          >
            <Twitter className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" /> Tweet
          </button>
        </div>
      </motion.div>

      <div className="glass-card p-3 sm:p-4 border border-yellow-400/20 bg-yellow-400/5">
        <div className="flex items-start gap-2 sm:gap-3">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs sm:text-sm text-gray-300">
              <span className="text-yellow-400 font-medium">Pro Tip:</span> Upgrade to Pro to get detailed explanations for every question!
            </p>
          </div>
        </div>
      </div>

      {showReview && questions && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#6C2BD9]" />
            Answer Review
          </h3>
          <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
            {questions.map((q, i) => {
              const userAnswer = answers?.[i];
              const isCorrect = userAnswer === q.correct_answer;
              return (
                <div 
                  key={i} 
                  className={`p-3 sm:p-4 rounded-lg border ${
                    isCorrect ? 'border-[#00C9A7]/30 bg-[#00C9A7]/5' : 'border-red-400/30 bg-red-400/5'
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C9A7]" />
                      ) : (
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs sm:text-sm font-medium break-words">{decodeHTML(q.question)}</p>
                      <div className="mt-1 text-xs sm:text-sm">
                        <span className="text-gray-400">Your answer: </span>
                        <span className={isCorrect ? 'text-[#00C9A7]' : 'text-red-400'}>
                          {userAnswer || 'Not answered'}
                        </span>
                        {!isCorrect && (
                          <span className="text-gray-400 ml-1 sm:ml-2">
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