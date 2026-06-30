import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleQuestions = [
      { question: "What is the capital of France?", correct_answer: "Paris", incorrect_answers: ["London", "Berlin", "Madrid"] },
      { question: "Which planet is known as the Red Planet?", correct_answer: "Mars", incorrect_answers: ["Venus", "Jupiter", "Saturn"] },
      { question: "What is the largest ocean on Earth?", correct_answer: "Pacific Ocean", incorrect_answers: ["Atlantic", "Indian", "Arctic"] }
    ];
    setQuestions(sampleQuestions);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (questions.length === 0 || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNext();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, questions, loading]);

  const handleAnswer = (answer) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(30);
    } else {
      let correct = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.correct_answer) correct++;
      });
      const score = Math.round((correct / questions.length) * 100);
      sessionStorage.setItem('quizResults', JSON.stringify({ score, correct, total: questions.length, answers, questions }));
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setTimeLeft(30);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6C2BD9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const allAnswers = currentQuestion ? [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers].sort(() => Math.random() - 0.5) : [];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Question {currentIndex + 1} of {questions.length}</span>
          <div className={`flex items-center gap-2 ${timeLeft <= 10 ? 'text-red-400' : 'text-[#00C9A7]'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#6C2BD9] to-[#8B5CF6] transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl text-white font-medium mb-6">{currentQuestion?.question}</h2>
        <div className="space-y-3">
          {allAnswers.map((answer, index) => (
            <button key={index} onClick={() => handleAnswer(answer)} className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${answers[currentIndex] === answer ? 'bg-[#6C2BD9]/30 border border-[#6C2BD9] text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent'}`}>
              <span>{answer}</span>
              {answers[currentIndex] === answer && <Check className="w-4 h-4 float-right mt-1 text-[#00C9A7]" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button onClick={handlePrevious} disabled={currentIndex === 0} className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={handleNext} className="btn-primary flex items-center gap-2">
          {currentIndex === questions.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Quiz;
