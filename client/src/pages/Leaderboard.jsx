import React from 'react';
import { Trophy, Crown, Medal, Users } from 'lucide-react';

const Leaderboard = () => {
  const players = [
    { rank: 1, name: 'Alex Johnson', score: 95, games: 12 },
    { rank: 2, name: 'Maria Garcia', score: 88, games: 10 },
    { rank: 3, name: 'James Smith', score: 82, games: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-gray-400 mt-1">Top performers this month</p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#6C2BD9]" />
          <span className="text-sm text-gray-300">1,234 players</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player.rank} className={`glass-card p-6 text-center ${player.rank === 1 ? 'border-yellow-400/30 bg-yellow-400/5' : player.rank === 2 ? 'border-gray-400/30 bg-gray-400/5' : 'border-amber-600/30 bg-amber-600/5'}`}>
            <div className="text-4xl mb-2">{player.rank === 1 ? <Crown className="w-8 h-8 text-yellow-400 mx-auto" /> : <Medal className="w-8 h-8 text-gray-400 mx-auto" />}</div>
            <div className="text-xl font-bold text-white">{player.name}</div>
            <div className="text-2xl font-bold text-[#6C2BD9] mt-1">{player.score}%</div>
            <div className="text-sm text-gray-400">{player.games} games</div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4">All Players</h3>
        <div className="space-y-2">
          {players.map((player) => (
            <div key={player.rank} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-8">#{player.rank}</span>
                <span className="text-white font-medium">{player.name}</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{player.score}%</div>
                <div className="text-xs text-gray-400">{player.games} games</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
