import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  ArrowLeft,
  Loader2,
  ChevronRight,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';
import personalityService from '../services/personalityService';

const PersonalityQuiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
    loadQuestions();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const personalityQuestions = [
        {
          id: 1,
          question: "You're planning a weekend trip. What's your ideal destination?",
          options: [
            { value: 'adventurer', label: '🏔️ A mountain adventure with hiking' },
            { value: 'thinker', label: '📚 A quiet cabin with books and nature' },
            { value: 'socializer', label: '🌆 A vibrant city with nightlife and culture' },
            { value: 'creator', label: '🎨 An art retreat with workshops' },
          ]
        },
        {
          id: 2,
          question: "How do you prefer to solve problems?",
          options: [
            { value: 'thinker', label: '🤔 Analyze all options carefully' },
            { value: 'adventurer', label: '⚡ Take action and learn from results' },
            { value: 'socializer', label: '👥 Brainstorm with others' },
            { value: 'creator', label: '💡 Find creative, out-of-the-box solutions' },
          ]
        },
        {
          id: 3,
          question: "What's your ideal learning environment?",
          options: [
            { value: 'thinker', label: '📖 Self-paced study with resources' },
            { value: 'socializer', label: '👥 Group discussions and collaboration' },
            { value: 'creator', label: '🎯 Hands-on projects and experiments' },
            { value: 'adventurer', label: '🌍 Real-world experiences and travel' },
          ]
        },
        {
          id: 4,
          question: "When faced with a challenge, you usually...",
          options: [
            { value: 'adventurer', label: '🔥 Jump right in and figure it out' },
            { value: 'thinker', label: '📊 Create a detailed plan first' },
            { value: 'socializer', label: '💬 Ask others for advice' },
            { value: 'creator', label: '🎨 Try a completely new approach' },
          ]
        },
        {
          id: 5,
          question: "What energizes you the most?",
          options: [
            { value: 'socializer', label: '👥 Spending time with friends' },
            { value: 'thinker', label: '🧠 Learning something new' },
            { value: 'creator', label: '🎨 Expressing yourself creatively' },
            { value: 'adventurer', label: '🏃‍♂️ Exploring new places' },
          ]
        }
      ];

      setQuestions(personalityQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error('Failed to load personality quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentIndex]: value });
    
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 400);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    setSubmitting(true);
    try {
      const counts = {};
      Object.values(answers).forEach(val => {
        counts[val] = (counts[val] || 0) + 1;
      });

      let maxCount = 0;
      let resultType = 'thinker';
      Object.entries(counts).forEach(([key, count]) => {
        if (count > maxCount) {
          maxCount = count;
          resultType = key;
        }
      });

      const resultData = {
        type: resultType,
        scores: counts,
        total: questions.length,
      };

      setResult(resultData);

      if (user) {
        await personalityService.savePersonalityResult(
          user.id,
          resultType,
          answers,
          counts
        );
        toast.success('🎉 Personality saved successfully!');
      }

    } catch (error) {
      console.error('Error calculating result:', error);
      toast.error('Failed to save result');
    } finally {
      setSubmitting(false);
    }
  };

  const getResultDetails = (type) => {
    const details = {
      thinker: {
        title: '🧠 The Thinker',
        description: 'You\'re a deep thinker who loves to analyze and understand the world around you. You excel at problem-solving and strategic planning.',
        emoji: '🧠',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        traits: ['Analytical', 'Curious', 'Strategic', 'Observant'],
        recommendation: 'Try history, science, and logic quizzes!',
      },
      adventurer: {
        title: '⚡ The Adventurer',
        description: 'You\'re bold, spontaneous, and always ready for the next challenge. You learn best by doing and love exploring new possibilities.',
        emoji: '⚡',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        traits: ['Bold', 'Spontaneous', 'Courageous', 'Explorer'],
        recommendation: 'Try geography, travel, and world culture quizzes!',
      },
      socializer: {
        title: '👥 The Socializer',
        description: 'You thrive in social settings and love connecting with others. You\'re a natural collaborator who brings people together.',
        emoji: '👥',
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/30',
        traits: ['Friendly', 'Collaborative', 'Charismatic', 'Empathetic'],
        recommendation: 'Try history, literature, and social studies quizzes!',
      },
      creator: {
        title: '🎨 The Creator',
        description: 'You\'re imaginative and innovative. You see the world differently and love expressing yourself through creative endeavors.',
        emoji: '🎨',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        traits: ['Creative', 'Innovative', 'Imaginative', 'Expressive'],
        recommendation: 'Try art, music, and creative writing quizzes!',
      },
    };
    return details[type] || details.thinker;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (result) {
    const details = getResultDetails(result.type);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto glass-card p-6 sm:p-8 text-center"
      >
        <div className={`text-6xl mb-4 ${details.color}`}>{details.emoji}</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{details.title}</h2>
        <p className="text-gray-400 text-sm sm:text-base mb-6">{details.description}</p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {details.traits.map((trait) => (
            <span key={trait} className={`px-3 py-1 rounded-full text-xs ${details.bg} ${details.color} border ${details.border}`}>
              {trait}
            </span>
          ))}
        </div>

        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h4 className="text-sm text-gray-400 mb-3">Your Scores</h4>
          <div className="space-y-2">
            {Object.entries(result.scores).map(([key, count]) => {
              const typeDetails = getResultDetails(key);
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20 text-left">{typeDetails.emoji}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / result.total) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${typeDetails.color.replace('text', 'bg')}`}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 mb-6">
          <p className="text-sm text-gray-300">
            💡 <span className="text-blue-400">Recommended:</span> {details.recommendation}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setResult(null);
              setAnswers({});
              setCurrentIndex(0);
            }}
            className="flex-1 btn-secondary"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      <button
        onClick={() => navigate('/dashboard')}
        className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Find Your Learning Style</h1>
            <p className="text-gray-400 text-sm">Take this quick quiz to discover your best fit</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-medium text-white mb-4">
            {currentQuestion?.question}
          </h2>
          <div className="space-y-3">
            {currentQuestion?.options.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.value)}
                disabled={submitting}
                className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white border border-transparent hover:border-blue-500/30"
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex gap-1.5 justify-center">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-blue-500 scale-125'
                  : answers[i] !== undefined
                  ? 'bg-green-500'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuiz;
