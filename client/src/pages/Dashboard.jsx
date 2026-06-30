import React from 'react';
import { LayoutDashboard, Trophy, Award, Clock, TrendingUp, Target } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: Trophy, value: '0', label: 'Quizzes Taken', color: 'text-yellow-400' },
    { icon: Award, value: '0%', label: 'Best Score', color: 'text-[#00C9A7]' },
    { icon: Clock, value: '0', label: 'Total Time', color: 'text-[#6C2BD9]' },
    { icon: TrendingUp, value: '0', label: 'Streak', color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-8 h-8 text-[#6C2BD9]" />
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm">Track your progress and performance</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#6C2BD9]" />
          Recent Activity
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-400">No activity yet. Start your first quiz!</p>
          <button className="mt-4 btn-primary text-sm">Start Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
