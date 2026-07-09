import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  Users, UserPlus, UserMinus, Crown, Trophy,
  Copy, Check, Share2, Play, Settings,
  Timer, Target, Zap, Star, Medal,
  Loader2, ArrowLeft, RefreshCw,
  Wifi, WifiOff, Gamepad2, Speaker, Mic,
  Volume2, VolumeX, Send, MessageCircle
} from 'lucide-react';

const Multiplayer = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, results
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock players for demo
  const mockPlayers = [
    { id: 'host', name: 'You (Host)', isHost: true, score: 0, avatar: '👤', isReady: true },
    { id: 'p1', name: 'Alex', isHost: false, score: 0, avatar: '👨‍💻', isReady: true },
    { id: 'p2', name: 'Maria', isHost: false, score: 0, avatar: '👩‍🎓', isReady: false },
    { id: 'p3', name: 'James', isHost: false, score: 0, avatar: '🧑‍🏫', isReady: true },
  ];

  // Mock questions for multiplayer
  const mockQuestions = [
    { question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Madrid"], correct: 1 },
    { question: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], correct: 2 },
    { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct: 1 },
    { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"], correct: 2 },
    { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum"], correct: 2 },
  ];

  useEffect(() => {
    // Simulate connecting to a room
    generateRoomCode();
    setPlayers(mockPlayers);
    setIsHost(true);
    setIsConnected(true);
    
    // Simulate receiving messages
    const mockMessages = [
      { id: 1, sender: 'Alex', message: 'Ready to play!', time: '12:01' },
      { id: 2, sender: 'Maria', message: 'Let\'s go!', time: '12:02' },
    ];
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomCode(code);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    // toast.'Room code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const startGame = () => {
    setLoading(true);
    setQuestions(mockQuestions);
    setCurrentQuestion(0);
    setGameState('playing');
    setScore(0);
    setTimeLeft(15);
    setLoading(false);
    // toast.'🎮 Game started! Good luck everyone!');
  };

  const handleAnswer = (index) => {
    if (answers[currentQuestion] !== undefined) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: index
    }));
    
    const isCorrect = index === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(prev => prev + 10);
      // toast.'✅ Correct! +10 points');
    } else {
      // toast.`❌ Wrong! The answer was: ${questions[currentQuestion].options[questions[currentQuestion].correct]}`);
    }
    
    // Auto advance after 1.5 seconds
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(15);
      } else {
        finishGame();
      }
    }, 1500);
  };

  const finishGame = () => {
    setGameState('results');
    // toast.'🎉 Game complete!');
  };

  const handleLeaveRoom = () => {
    navigate('/');
  };

  const renderLobby = () => {
    const readyCount = players.filter(p => p.isReady).length;
    const totalPlayers = players.length;

    return (
      <div className="space-y-6">
        {/* Room Info */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#6C2BD9]" />
                Game Lobby
              </h2>
              <p className="text-sm text-gray-400">Waiting for players to join...</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#6C2BD9]/20 rounded-lg">
                <Wifi className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
                <span className="text-xs text-gray-300">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <button
                onClick={handleLeaveRoom}
                className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Leave
              </button>
            </div>
          </div>
        </div>

        {/* Room Code */}
        <div className="glass-card p-6 text-center">
          <p className="text-sm text-gray-400 mb-2">Share this code with friends to join</p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-3xl font-bold tracking-widest text-white bg-[#2D2D5E] px-6 py-3 rounded-lg border border-[#6C2BD9]/30">
              {roomCode}
            </div>
            <button
              onClick={copyRoomCode}
              className="p-3 bg-[#6C2BD9]/20 rounded-lg hover:bg-[#6C2BD9]/30 transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-[#6C2BD9]" />}
            </button>
            <button className="p-3 bg-[#6C2BD9]/20 rounded-lg hover:bg-[#6C2BD9]/30 transition-colors">
              <Share2 className="w-5 h-5 text-[#6C2BD9]" />
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            {isHost ? 'You are the host' : 'You are a player'}
          </div>
        </div>

        {/* Players */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-[#6C2BD9]" />
              Players ({totalPlayers})
              <span className="text-xs text-gray-400">({readyCount} ready)</span>
            </h3>
            {isHost && (
              <button
                onClick={startGame}
                disabled={readyCount < 2}
                className="btn-primary text-sm px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" /> Start Game
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {players.map((player) => (
              <div key={player.id} className={`p-3 rounded-lg text-center ${
                player.isHost ? 'border border-[#6C2BD9]/30 bg-[#6C2BD9]/10' : 'bg-white/5'
              }`}>
                <div className="text-2xl">{player.avatar}</div>
                <div className="text-sm text-white font-medium truncate">{player.name}</div>
                {player.isHost && <span className="text-xs text-[#6C2BD9]">👑 Host</span>}
                {player.isReady && <span className="text-xs text-green-400">✅ Ready</span>}
              </div>
            ))}
          </div>
          {isHost && readyCount < 2 && totalPlayers > 0 && (
            <p className="text-xs text-yellow-400 mt-3 text-center">
              Need at least 2 ready players to start
            </p>
          )}
          {totalPlayers === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No players yet. Share the room code!
            </p>
          )}
        </div>

        {/* Chat */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Chat</span>
          </div>
          <div className="h-24 overflow-y-auto mb-3 space-y-1">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2 text-xs">
                <span className="text-[#6C2BD9] font-medium">{msg.sender}:</span>
                <span className="text-gray-300">{msg.message}</span>
                <span className="text-gray-500 ml-auto">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#6C2BD9] focus:outline-none text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-[#6C2BD9] rounded-lg hover:bg-[#5A1BB8] transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaying = () => {
    if (!questions.length) return null;
    
    const q = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="space-y-6">
        {/* Game Header */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
              <div className="text-xs text-gray-500 mt-1">Score: {score} points</div>
            </div>
            <motion.div 
              className={`flex items-center gap-2 ${timeLeft <= 5 ? 'text-red-400' : 'text-[#00C9A7]'}`}
              animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Timer className="w-4 h-4" />
              <span className="font-bold">{timeLeft}s</span>
            </motion.div>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#6C2BD9] to-[#8B5CF6]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="glass-card p-6">
          <h2 className="text-xl text-white font-medium mb-6">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index;
              const isCorrect = index === q.correct;
              const showCorrect = isSelected && isCorrect;
              const showWrong = isSelected && !isCorrect;
              
              return (
                <motion.button
                  key={index}
                  whileHover={answers[currentQuestion] === undefined ? { scale: 1.02 } : {}}
                  whileTap={answers[currentQuestion] === undefined ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(index)}
                  disabled={answers[currentQuestion] !== undefined}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    answers[currentQuestion] === undefined ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent' :
                    showCorrect ? 'bg-[#00C9A7]/30 border border-[#00C9A7] text-white' :
                    showWrong ? 'bg-red-500/30 border border-red-500 text-white' :
                    'bg-white/5 text-gray-400 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {answers[currentQuestion] !== undefined && (
                      <span>
                        {isCorrect && <Check className="w-5 h-5 text-[#00C9A7]" />}
                        {isSelected && !isCorrect && <X className="w-5 h-5 text-red-400" />}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Players' Scores */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            {players.map((player) => (
              <div key={player.id} className="text-center">
                <div className="text-2xl">{player.avatar}</div>
                <div className="text-xs text-gray-400 truncate max-w-[60px]">{player.name}</div>
                <div className="text-sm font-bold text-white">{player.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    // Sort players by score for results
    const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
    const winner = sortedPlayers[0];

    return (
      <div className="space-y-6">
        <div className="glass-card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">🏆 {winner?.name} Wins!</h2>
          <p className="text-gray-400">Score: {winner?.score} points</p>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Medal className="w-4 h-4 text-yellow-400" />
            Final Scores
          </h3>
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <div key={player.id} className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0 ? 'bg-yellow-400/10 border border-yellow-400/20' :
                index === 1 ? 'bg-gray-400/10 border border-gray-400/20' :
                index === 2 ? 'bg-amber-600/10 border border-amber-600/20' :
                'bg-white/5'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '#' + (index + 1)}</span>
                  <span className="text-2xl">{player.avatar}</span>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{player.score || 0} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              setGameState('lobby');
              setQuestions([]);
              setAnswers({});
              setCurrentQuestion(0);
              setScore(0);
              // Reset player scores
              setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
            }}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Play Again
          </button>
          <button
            onClick={handleLeaveRoom}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Leave Room
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      {gameState === 'lobby' && renderLobby()}
      {gameState === 'playing' && renderPlaying()}
      {gameState === 'results' && renderResults()}
    </div>
  );
};

export default Multiplayer;
