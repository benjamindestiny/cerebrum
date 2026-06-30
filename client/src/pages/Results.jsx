import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Share2, CheckCircle, XCircle } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResults');
    if (stored) {
      setResults(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6C2BD9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  const { score, correct, total } = results;
  const grade = score >= 90 ? { label: 'Outstanding! 🏆', color: 'text-yellow-400' } : score >= 70 ? { label: 'Great Job! 🌟', color: 'text-[#00C9A7]' } : score >= 50 ? { label: 'Good Effort! 💪', color: 'text-[#6C2BD9]' } : { label: 'Keep Learning! 📚', color: 'text-gray-400' };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 text-center">
        <div className="relative inline-block mb-6">
          <div className="w-40 h-40 rounded-full border-8 border-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-white">{score}%</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
          </div>
        </div>
        <h2 className={`text-2xl font-bold ${grade.color}`}>{grade.label}</h2>
        <p className="text-gray-400 mt-1">You got {correct} out of {total} questions correct</p>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 rounded-lg p-4"><div className="text-2xl font-bold text-[#00C9A7]">{correct}</div><div className="text-xs text-gray-400">Correct</div></div>
          <div className="bg-white/5 rounded-lg p-4"><div className="text-2xl font-bold text-red-400">{total - correct}</div><div className="text-xs text-gray-400">Incorrect</div></div>
          <div className="bg-white/5 rounded-lg p-4"><div className="text-2xl font-bold text-white">{total}</div><div className="text-xs text-gray-400">Total</div></div>
        </div>
        <div className="flex gap-4 mt-8 justify-center flex-wrap">
          <button onClick={() => navigate('/')} className="btn-primary flex items-center gap-2"><RotateCcw className="w-4 h-4" /> New Quiz</button>
          <button className="btn-secondary flex items-center gap-2"><Share2 className="w-4 h-4" /> Share Results</button>
        </div>
      </div>
    </div>
  );
};

export default Results;
