import React from 'react';
import { Puzzle, Lightbulb, Brain, Sparkles } from 'lucide-react';

const Riddles = () => {
  const riddles = [
    { id: 1, question: "What has keys but can't open locks?", hint: "Think about what you type on", difficulty: "Easy" },
    { id: 2, question: "I speak without a mouth and hear without ears. What am I?", hint: "It comes from your device", difficulty: "Medium" },
    { id: 3, question: "The more you take, the more you leave behind. What am I?", hint: "Think about walking", difficulty: "Hard" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Puzzle className="w-8 h-8 text-[#6C2BD9]" />
            Riddle Challenge
          </h1>
          <p className="text-gray-400 mt-1">Test your lateral thinking skills</p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-gray-300">Daily Riddle</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riddles.map((riddle) => (
          <div key={riddle.id} className="glass-card p-6 hover:border-[#6C2BD9]/30 transition-all duration-300">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-[#6C2BD9] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium">{riddle.question}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button className="text-sm text-[#6C2BD9] hover:text-[#8B5CF6] transition-colors flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" />
                    Hint
                  </button>
                  <span className={`text-xs px-2 py-1 rounded-full ${riddle.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : riddle.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    {riddle.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Riddles;
