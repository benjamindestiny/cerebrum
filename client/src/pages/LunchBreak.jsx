import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Coffee,
  Clock,
  Zap,
  Trophy,
  Target,
  Brain,
  Loader2,
  Check,
  X,
  ArrowLeft,
  Flame,
  Sparkles,
} from 'lucide-react';
import { fetchQuestions, shuffleArray, decodeHTML } from '../services/quizApi';
import { supabase } from '../services/supabase';

const LunchBreak = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [user, setUser] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  useEffect(() => {
    loadQuestions();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const fetched = await fetchQuestions(10, 9, 'easy', 'multiple');
      if (fetched && fetched.length > 0) {
        const formatted = fetched.map((q) => ({
          ...q,
          shuffledOptions: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
        }));
        setQuestions(formatted);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || quizComplete || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, quizComplete, questions]);

  const handleAnswerSelect = (answer) => {
    if (isAnswered || quizComplete) return;

    const updatedAnswers = { ...answers, [currentIndex]: answer };
    setAnswers(updatedAnswers);
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === questions[currentIndex]?.correct_answer;
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(Math.max(maxCombo, newCombo));
      setCorrectCount(prev => prev + 1);
    } else {
      setCombo(0);
    }

    if (currentIndex === questions.length - 1) {
      setTimeout(() => finishQuiz(), 800);
    } else {
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }, 600);
    }
  };

  const finishQuiz = () => {
    setQuizComplete(true);
    const correct = Object.keys(answers).filter(
      (i) => answers[i] === questions[parseInt(i)]?.correct_answer
    ).length;
    setScore(Math.round((correct / questions.length) * 100));
    setShowResults(true);
    setCombo(0);
  };

  const handleRetry = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(60);
    setQuizComplete(false);
    setScore(0);
    setCorrectCount(0);
    setShowResults(false);
    setCombo(0);
    setMaxCombo(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    loadQuestions();
  };

  const getTimeColor = () => {
    if (timeLeft <= 10) return 'text-red-500';
    if (timeLeft <= 20) return 'text-orange-400';
    return 'text-blue-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (showResults) {
    const grade = score >= 80 ? '🔥 Outstanding!' : score >= 60 ? '⭐ Great Job!' : score >= 40 ? '💪 Keep Going!' : '📚 Practice More!';
    const gradeColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-blue-400' : score >= 40 ? 'text-yellow-400' : 'text-gray-400';

    return (
      <div className="max-w-lg mx-auto glass-card p-8 text-center">
        <div className="text-5xl mb-4">{score >= 80 ? '🏆' : score >= 60 ? '🌟' : score >= 40 ? '💪' : '📚'}</div>
        <h2 className={`text-3xl font-bold ${gradeColor}`}>{grade}</h2>
        <p className="text-gray-400 text-sm mt-2">
          You got <span className="text-white font-bold">{correctCount}</span> out of {questions.length} correct
        </p>
        <div className="text-6xl font-bold text-white my-4">{score}%</div>
        {maxCombo > 1 && (
          <p className="text-orange-400 text-sm">🔥 Best Combo: {maxCombo}x</p>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleRetry}
            className="flex-1 btn-primary py-3"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" /> Try Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 btn-secondary py-3"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <button
        onClick={() => navigate('/dashboard')}
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-4 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="glass-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Coffee className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Lunch Break Challenge ☕</h2>
              <p className="text-xs text-gray-400">10 questions in 60 seconds</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 font-bold text-lg ${getTimeColor()}`}>
            <Clock className="w-5 h-5" />
            {timeLeft}s
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Question {currentIndex + 1}/{questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Combo Display */}
        {combo >= 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 text-orange-400 text-sm mb-3"
          >
            <Flame className="w-4 h-4" />
            <span>{combo}x Combo! 🔥</span>
          </motion.div>
        )}

        {/* Question */}
        <div className="mb-6">
          <p className="text-white text-lg font-medium leading-relaxed">
            {decodeHTML(currentQuestion?.question)}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQuestion?.shuffledOptions.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correct_answer;
            const showCorrect = isAnswered && isCorrect;
            const showWrong = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !isAnswered && handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm
                  ${isAnswered ? 'cursor-default' : 'hover:bg-white/10 cursor-pointer'}
                  ${isSelected && !isAnswered ? 'bg-blue-500/30 border border-blue-500' : ''}
                  ${showCorrect ? 'bg-green-500/30 border border-green-500' : ''}
                  ${showWrong ? 'bg-red-500/30 border border-red-500' : ''}
                  ${!isSelected && !isAnswered ? 'bg-white/5 hover:bg-white/10 border border-transparent' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{decodeHTML(option)}</span>
                  {isAnswered && isSelected && (
                    <span>
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LunchBreak;
