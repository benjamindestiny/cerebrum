import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  Clock, ChevronLeft, ChevronRight, Check, X, 
  Loader2, AlertCircle, ArrowLeft, RefreshCw,
  Settings, Target, Zap, Brain, Sparkles
} from 'lucide-react';
import { fetchQuestions, shuffleArray, decodeHTML } from '../services/quizApi';
import { getCustomQuestions, hasCustomQuestions } from '../data/customQuestions';
import { supabase } from '../services/supabase';

// Fallback questions - always available
const FALLBACK_QUESTIONS = [
  {
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
    category: "General Knowledge"
  },
  {
    question: "Which planet is known as the Red Planet?",
    correct_answer: "Mars",
    incorrect_answers: ["Venus", "Jupiter", "Saturn"],
    category: "General Knowledge"
  },
  {
    question: "What is the largest ocean on Earth?",
    correct_answer: "Pacific Ocean",
    incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    category: "General Knowledge"
  },
  {
    question: "What is the chemical symbol for water?",
    correct_answer: "H2O",
    incorrect_answers: ["CO2", "NaCl", "HCl"],
    category: "General Knowledge"
  },
  {
    question: "Who painted the Mona Lisa?",
    correct_answer: "Leonardo da Vinci",
    incorrect_answers: ["Michelangelo", "Raphael", "Van Gogh"],
    category: "General Knowledge"
  },
  {
    question: "What is the tallest mountain in the world?",
    correct_answer: "Mount Everest",
    incorrect_answers: ["K2", "Kilimanjaro", "Denali"],
    category: "General Knowledge"
  },
  {
    question: "Which country has the most people?",
    correct_answer: "India",
    incorrect_answers: ["China", "USA", "Indonesia"],
    category: "General Knowledge"
  },
  {
    question: "What is the smallest country in the world?",
    correct_answer: "Vatican City",
    incorrect_answers: ["Monaco", "San Marino", "Liechtenstein"],
    category: "General Knowledge"
  }
];

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [questionCount, setQuestionCount] = useState(15);
  const [user, setUser] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(Date.now());

  useEffect(() => {
    const storedCategory = sessionStorage.getItem('selectedCategory');
    if (storedCategory) {
      const category = JSON.parse(storedCategory);
      setCategoryInfo(category);
      setQuestionCount(category.count || 15);
    } else {
      setCategoryInfo({ id: 9, name: 'General Knowledge' });
    }
    
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const loadQuestions = async (diff) => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setShowDifficultySelect(false);
    setSelectedDifficulty(diff);
    setDifficulty(diff);
    setQuizStartTime(Date.now());
    
    try {
      const storedCategory = sessionStorage.getItem('selectedCategory');
      let categoryId = null;
      let categoryName = 'General Knowledge';
      let count = 15;
      let isCustom = false;
      
      if (storedCategory) {
        const category = JSON.parse(storedCategory);
        categoryId = category.id;
        categoryName = category.name;
        count = category.count || 15;
        setCategoryInfo(category);
      }
      
      let fetchedQuestions = [];
      let isCustomCategory = false;
      
      // Check if it's a custom category (string like 'bible-studies')
      if (typeof categoryId === 'string') {
        const customQ = getCustomQuestions(categoryId, count);
        if (customQ.length > 0) {
          fetchedQuestions = customQ.map(q => ({
            ...q,
            shuffledOptions: shuffleArray([q.correct_answer, ...q.incorrect_answers])
          }));
          isCustomCategory = true;
        }
      }
      
      // If no custom questions, try API
      if (fetchedQuestions.length === 0) {
        try {
          const apiQuestions = await fetchQuestions(count, categoryId, diff, 'multiple');
          if (apiQuestions && apiQuestions.length > 0) {
            fetchedQuestions = apiQuestions.map((q) => ({
              ...q,
              shuffledOptions: shuffleArray([q.correct_answer, ...q.incorrect_answers])
            }));
          }
        } catch (apiError) {
        }
      }
      
      // If still no questions, use fallback
      if (fetchedQuestions.length === 0) {
        const fallback = FALLBACK_QUESTIONS.slice(0, Math.min(count, FALLBACK_QUESTIONS.length));
        fetchedQuestions = fallback.map(q => ({
          ...q,
          shuffledOptions: shuffleArray([q.correct_answer, ...q.incorrect_answers])
        }));
      }
      
      // Always have questions - even if we only have 1
      if (fetchedQuestions.length === 0) {
        // Last resort - create a dummy question
        fetchedQuestions = [{
          question: "What is the capital of knowledge?",
          correct_answer: "Learning",
          incorrect_answers: ["Forgetting", "Sleeping", "Watching"],
          category: "General Knowledge",
          shuffledOptions: ["Learning", "Forgetting", "Sleeping", "Watching"]
        }];
      }
      
      setQuestions(fetchedQuestions);
      toast.success(`${fetchedQuestions.length} questions loaded!`, { 
        icon: '✅',
        position: 'top-right',
        autoClose: 1200
      });
      setTimeLeft(30);
      
    } catch (error) {
      console.error('Error loading questions:', error);
      // Use fallback questions on error
      const fallback = FALLBACK_QUESTIONS.slice(0, Math.min(questionCount || 15, FALLBACK_QUESTIONS.length));
      const fallbackQuestions = fallback.map(q => ({
        ...q,
        shuffledOptions: shuffleArray([q.correct_answer, ...q.incorrect_answers])
      }));
      setQuestions(fallbackQuestions);
      toast.info('Using general knowledge questions', { 
        position: 'top-right',
        autoClose: 1500
      });
      setTimeLeft(30);
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (loading || quizComplete || questions.length === 0 || showDifficultySelect) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswered) handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, loading, quizComplete, isAnswered, questions.length, showDifficultySelect]);

  const handleTimeout = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      toast.warning('⏰ Time\'s up!', { position: 'top-right', autoClose: 1000 });
      setTimeout(() => handleNext(), 1200);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setAnswers(prev => ({ ...prev, [currentIndex]: answer }));
    
    const isCorrect = answer === questions[currentIndex].correct_answer;
    if (isCorrect) {
      toast.success('✅ Correct!', { position: 'top-right', autoClose: 800 });
    } else {
      toast.error(`❌ Answer: ${questions[currentIndex].correct_answer}`, { 
        position: 'top-right', 
        autoClose: 1200 
      });
    }
    
    setTimeout(() => handleNext(), 1200);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    }
  };

  const finishQuiz = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) correct++;
    });
    
    const score = Math.round((correct / questions.length) * 100);
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    
    // Save to Supabase if logged in
    if (user) {
      try {
        supabase
          .from('quiz_results')
          .insert({
            user_id: user.id,
            user_name: user.user_metadata?.name || user.email,
            category: { id: categoryInfo?.id, name: categoryInfo?.name || 'General Knowledge' },
            difficulty: difficulty || 'medium',
            score: score,
            correct_answers: correct,
            total_questions: questions.length,
            time_taken: timeTaken,
            points: Math.floor(score / 10),
            questions: questions.map(q => ({
              question: q.question,
              correct_answer: q.correct_answer,
              incorrect_answers: q.incorrect_answers
            })),
            answers: answers
          })
          .then(({ error }) => {
            if (error) {
              console.error('Error saving quiz:', error);
            } else {
            }
          });
      } catch (error) {
        console.error('Save error:', error);
      }
    }
    
    const resultData = {
      score,
      correct,
      total: questions.length,
      answers,
      questions,
      category: categoryInfo?.name || 'General Knowledge',
      difficulty: difficulty || 'medium',
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('quizResults', JSON.stringify(resultData));
    setQuizComplete(true);
    toast.success(`🎉 Score: ${score}%`, { position: 'top-right', autoClose: 1500 });
    setTimeout(() => navigate('/results'), 1200);
  };

  const handleGoBack = () => {
    navigate('/categories');
  };

  const handleRetry = () => {
    setShowDifficultySelect(true);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setQuizComplete(false);
    setSelectedDifficulty(null);
  };

  // ============================================
  // DIFFICULTY SELECTION SCREEN
  // ============================================
  if (showDifficultySelect) {
    const difficulties = [
      { 
        id: 'easy', 
        label: 'Easy', 
        icon: '🌱', 
        color: 'text-green-400', 
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        desc: 'Perfect for beginners',
      },
      { 
        id: 'medium', 
        label: 'Medium', 
        icon: '⚡', 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        desc: 'For intermediate learners',
      },
      { 
        id: 'hard', 
        label: 'Hard', 
        icon: '🔥', 
        color: 'text-red-400', 
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        desc: 'Challenge yourself!',
      },
    ];

    const selectedCount = questionCount || 15;

    return (
      <div className="max-w-md mx-auto">
        <div className="glass-card p-8 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Brain className="w-8 h-8 text-[#7c3aed]" />
              <span className="text-sm text-gray-400">Quiz</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {categoryInfo?.name || 'General Knowledge'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Choose your difficulty
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {selectedCount} questions
            </p>
          </div>

          <div className="space-y-3">
            {difficulties.map((diff) => (
              <motion.button
                key={diff.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadQuestions(diff.id)}
                disabled={loading}
                className={`w-full p-4 rounded-xl ${diff.bg} border ${diff.border} hover:border-[#7c3aed]/50 transition-all flex items-center justify-between group ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{diff.icon}</span>
                  <div className="text-left">
                    <div className={`font-semibold ${diff.color}`}>{diff.label}</div>
                    <div className="text-xs text-gray-500">{diff.desc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{selectedCount} questions</div>
                  <Sparkles className="w-4 h-4 text-gray-500 group-hover:text-[#7c3aed] transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>

          <button
            onClick={handleGoBack}
            className="mt-6 text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Categories
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading {difficulty} questions...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // QUIZ ACTIVE (Always has questions)
  // ============================================
  if (questions.length === 0) {
    // Should never happen, but just in case
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">No Questions</h2>
        <p className="text-gray-400 mt-2">Please try again.</p>
        <button onClick={handleRetry} className="btn-primary mt-6 flex items-center gap-2 mx-auto">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const options = currentQuestion?.shuffledOptions || [];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handleGoBack} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{categoryInfo?.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
            difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {difficulty}
          </span>
          <span className="text-xs text-gray-500">
            {questions.length} questions
          </span>
        </div>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {questions.length}
          </span>
          <motion.div 
            className={`flex items-center gap-1 text-sm ${timeLeft <= 10 ? 'text-red-400' : 'text-[#00C9A7]'}`}
            animate={timeLeft <= 10 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Clock className="w-4 h-4" />
            <span className="font-bold">{timeLeft}s</span>
          </motion.div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card p-6 mb-6"
      >
        <h2 className="text-lg text-white font-medium mb-5">
          {decodeHTML(currentQuestion?.question)}
        </h2>

        <div className="space-y-2.5">
          {options.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === currentQuestion.correct_answer;
            const showCorrect = isAnswered && isCorrect;
            const showWrong = isAnswered && isSelected && !isCorrect;
            
            return (
              <motion.button
                key={index}
                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => handleAnswerSelect(answer)}
                disabled={isAnswered}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-sm
                  ${isAnswered ? 'cursor-default' : 'hover:bg-white/10 cursor-pointer'}
                  ${isSelected && !isAnswered ? 'bg-[#7c3aed]/30 border border-[#7c3aed] text-white' : ''}
                  ${showCorrect ? 'bg-[#00C9A7]/30 border border-[#00C9A7] text-white' : ''}
                  ${showWrong ? 'bg-red-500/30 border border-red-500 text-white' : ''}
                  ${!isSelected && !isAnswered ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{decodeHTML(answer)}</span>
                  {isAnswered && (
                    <span>
                      {isCorrect && <Check className="w-4 h-4 text-[#00C9A7]" />}
                      {isSelected && !isCorrect && <X className="w-4 h-4 text-red-400" />}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <div className="flex justify-between gap-4">
        <button 
          onClick={handlePrevious} 
          disabled={currentIndex === 0}
          className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-xs text-gray-500 flex items-center">
          {isAnswered ? '✓' : 'Select an answer'}
        </span>
      </div>
    </div>
  );
};

export default Quiz;
