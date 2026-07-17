import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  Clock,
  Zap,
  Trophy,
  Brain,
  Loader2,
  ArrowLeft,
  Flame,
  Sparkles,
  Target,
  Gamepad2,
  RefreshCw,
  Check,
  X,
  Timer,
} from 'lucide-react';
import { supabase } from '../services/supabase';

const GAMES = {
  SPEED: 'speed',
  MEMORY: 'memory',
  TRIVIA: 'trivia',
};

const LunchBreak = () => {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [stats, setStats] = useState({
    correct: 0,
    wrong: 0,
    total: 0,
  });

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStats, setGameStats] = useState({ correct: 0, wrong: 0 });

  const [currentNumber, setCurrentNumber] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [questionTimer, setQuestionTimer] = useState(20);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  // Start Speed Game
  const startSpeedGame = () => {
    setGameMode(GAMES.SPEED);
    setGameActive(true);
    setTimeLeft(60);
    setScore(0);
    setGameStats({ correct: 0, wrong: 0 });
    setCombo(0);
    setMaxCombo(0);
    setTimePerQuestion(20);
    setQuestionTimer(20);
    generateNewProblem();
    startTimer();
  };

  const generateNewProblem = () => {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let answer;
    let display;
    switch (op) {
      case '+':
        answer = num1 + num2;
        display = `${num1} + ${num2}`;
        break;
      case '-':
        answer = num1 - num2;
        display = `${num1} - ${num2}`;
        break;
      case '×':
        answer = num1 * num2;
        display = `${num1} × ${num2}`;
        break;
    }
    
    // Generate 4 options with the correct answer
    let options = [answer];
    while (options.length < 4) {
      let randomOffset = Math.floor(Math.random() * 10) + 1;
      let newOption = answer + (Math.random() > 0.5 ? randomOffset : -randomOffset);
      if (!options.includes(newOption) && newOption > 0) {
        options.push(newOption);
      }
    }
    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);
    
    setCurrentNumber({ display, answer });
    setOptions(options);
    setQuestionTimer(20);
  };

  const handleSpeedAnswer = (selected) => {
    if (!currentNumber || gameComplete) return;
    const isCorrect = selected === currentNumber.answer;

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(Math.max(maxCombo, newCombo));
      setScore(prev => prev + 10 + (newCombo > 1 ? newCombo * 2 : 0));
      setGameStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setCombo(0);
      setGameStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    // Generate next question immediately
    generateNewProblem();
  };

  // Start Memory Game
  const startMemoryGame = () => {
    setGameMode(GAMES.MEMORY);
    setGameActive(true);
    setMoves(0);
    setMatchedPairs(0);
    setFlippedCards([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(60);
    generateMemoryCards();
    startTimer();
  };

  const generateMemoryCards = () => {
    const emojis = ['🚀', '🌟', '🎯', '🔥', '💎', '⭐', '🌈', '🎨'];
    const pairs = [...emojis, ...emojis];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false,
    })));
  };

  const handleCardClick = (cardId) => {
    if (gameComplete) return;
    if (flippedCards.length === 2) return;

    const card = cards.find(c => c.id === cardId);
    if (card.flipped || card.matched) return;

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, flipped: true } : c
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);

    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      const firstCard = cards.find(c => c.id === flippedCards[0]);
      if (firstCard.emoji === card.emoji) {
        setMatchedPairs(prev => prev + 1);
        const matchedCards = newCards.map(c =>
          c.id === cardId || c.id === flippedCards[0]
            ? { ...c, matched: true }
            : c
        );
        setCards(matchedCards);
        setFlippedCards([]);
        setScore(prev => prev + 10);
        setCombo(prev => prev + 1);
        setMaxCombo(Math.max(maxCombo, combo + 1));

        if (matchedPairs + 1 === 8) {
          setGameComplete(true);
          setGameActive(false);
        }
      } else {
        setTimeout(() => {
          const resetCards = cards.map(c =>
            c.id === cardId || c.id === flippedCards[0]
              ? { ...c, flipped: false }
              : c
          );
          setCards(resetCards);
          setFlippedCards([]);
          setCombo(0);
        }, 800);
      }
    }
  };

  // Start Trivia Game
  const startTriviaGame = () => {
    setGameMode(GAMES.TRIVIA);
    setGameActive(true);
    setTimeLeft(60);
    setScore(0);
    setGameStats({ correct: 0, wrong: 0 });
    setCombo(0);
    setMaxCombo(0);
    setCurrentQuestion(null);
    setTimePerQuestion(20);
    setQuestionTimer(20);
    generateTriviaQuestion();
    startTimer();
  };

  const triviaQuestions = [
    { question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Madrid"], answer: 1 },
    { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
    { question: "What is 7 × 8?", options: ["54", "56", "48", "58"], answer: 1 },
    { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Da Vinci", "Picasso", "Monet"], answer: 1 },
    { question: "What is the largest ocean?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], answer: 1 },
    { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
    { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"], answer: 0 },
    { question: "Which gas do plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: 1 },
    { question: "What is the hardest natural substance?", options: ["Gold", "Diamond", "Iron", "Platinum"], answer: 1 },
    { question: "How many bones are in the adult human body?", options: ["198", "206", "210", "220"], answer: 1 },
  ];

  const generateTriviaQuestion = () => {
    const available = triviaQuestions.filter((_, i) => i !== currentQuestion?.index);
    if (available.length === 0) {
      setGameComplete(true);
      setGameActive(false);
      return;
    }
    const randomIndex = Math.floor(Math.random() * available.length);
    const question = available[randomIndex];
    setCurrentQuestion({ ...question, index: triviaQuestions.indexOf(question) });
    setQuestionTimer(20);
  };

  const handleTriviaAnswer = (selected) => {
    if (!currentQuestion || gameComplete) return;
    const isCorrect = selected === currentQuestion.answer;

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(Math.max(maxCombo, newCombo));
      setScore(prev => prev + 15 + (newCombo > 1 ? newCombo * 3 : 0));
      setGameStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setCombo(0);
      setGameStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    generateTriviaQuestion();
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameActive(false);
          setGameComplete(true);
          return 0;
        }
        return prev - 1;
      });
      
      // Question timer for speed and trivia
      if (gameMode === GAMES.SPEED || gameMode === GAMES.TRIVIA) {
        setQuestionTimer(prev => {
          if (prev <= 1) {
            // Time's up for this question - move to next
            if (gameMode === GAMES.SPEED) {
              setCombo(0);
              generateNewProblem();
            } else if (gameMode === GAMES.TRIVIA) {
              setCombo(0);
              generateTriviaQuestion();
            }
            return 20;
          }
          return prev - 1;
        });
      }
    }, 1000);
  };

  // Game Selection Screen
  if (!gameMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4"
      >
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-orange-500/20 rounded-2xl mb-4">
            <Coffee className="w-12 h-12 text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">☕ Brain Break</h1>
          <p className="text-gray-400 mt-2">Quick fun games to refresh your mind</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: GAMES.SPEED,
              icon: Zap,
              title: "Speed Math",
              desc: "Quick math challenges (20s per question)",
              color: "text-yellow-400",
              bg: "bg-yellow-500/10",
              border: "border-yellow-500/30",
              time: "60s",
            },
            {
              id: GAMES.MEMORY,
              icon: Brain,
              title: "Memory Match",
              desc: "Find matching pairs",
              color: "text-purple-400",
              bg: "bg-purple-500/10",
              border: "border-purple-500/30",
              time: "60s",
            },
            {
              id: GAMES.TRIVIA,
              icon: Target,
              title: "Quick Trivia",
              desc: "Test your knowledge (20s per question)",
              color: "text-green-400",
              bg: "bg-green-500/10",
              border: "border-green-500/30",
              time: "60s",
            },
          ].map((game) => (
            <button
              key={game.id}
              onClick={() => {
                if (game.id === GAMES.SPEED) startSpeedGame();
                else if (game.id === GAMES.MEMORY) startMemoryGame();
                else if (game.id === GAMES.TRIVIA) startTriviaGame();
              }}
              className={`glass-card p-6 text-center ${game.bg} border ${game.border} hover:border-blue-500/30 transition-all`}
            >
              <div className={`w-12 h-12 rounded-full ${game.bg} flex items-center justify-center mx-auto mb-3`}>
                <game.icon className={`w-6 h-6 ${game.color}`} />
              </div>
              <h3 className="text-white font-bold text-lg">{game.title}</h3>
              <p className="text-gray-400 text-sm">{game.desc}</p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Timer className="w-3 h-3" />
                {game.time}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  // Game Play
  if (gameActive || gameComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto px-4"
      >
        <button
          onClick={() => {
            setGameMode(null);
            setGameActive(false);
            setGameComplete(false);
          }}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Games
        </button>

        <div className="glass-card p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Gamepad2 className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {gameMode === GAMES.SPEED && "⚡ Speed Math"}
                  {gameMode === GAMES.MEMORY && "🧠 Memory Match"}
                  {gameMode === GAMES.TRIVIA && "🎯 Quick Trivia"}
                </h2>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {timeLeft}s
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    {score} pts
                  </span>
                  {gameActive && (gameMode === GAMES.SPEED || gameMode === GAMES.TRIVIA) && (
                    <span className="flex items-center gap-1 text-blue-400">
                      <Clock className="w-3 h-3" />
                      {questionTimer}s
                    </span>
                  )}
                </div>
              </div>
            </div>
            {gameComplete && (
              <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                Complete!
              </div>
            )}
          </div>

          {/* Combo Display */}
          {combo > 1 && gameActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-orange-400 text-sm mb-3"
            >
              <Flame className="w-4 h-4" />
              <span>{combo}x Combo! 🔥</span>
            </motion.div>
          )}

          {/* Speed Game */}
          {gameMode === GAMES.SPEED && (
            <div className="text-center py-4">
              {gameActive && currentNumber && options.length > 0 && (
                <>
                  <div className="text-3xl font-bold text-white mb-2">
                    {currentNumber.display} = ?
                  </div>
                  <div className="text-xs text-gray-400 mb-4">
                    Choose the correct answer ({questionTimer}s remaining)
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                    {options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleSpeedAnswer(option)}
                        className="p-4 bg-white/5 hover:bg-white/15 rounded-lg transition-colors text-xl font-bold text-white border border-white/10 hover:border-blue-500/30"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <span className="text-green-400">Correct: {gameStats.correct}</span>
                    {' | '}
                    <span className="text-red-400">Wrong: {gameStats.wrong}</span>
                  </div>
                </>
              )}
              {gameComplete && (
                <div className="py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white">Time's Up!</h3>
                  <p className="text-gray-400 mt-2">You scored <span className="text-yellow-400 font-bold">{score}</span> points</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Correct: {gameStats.correct} | Wrong: {gameStats.wrong}
                  </p>
                  {maxCombo > 1 && <p className="text-orange-400 text-sm mt-1">🔥 Best Combo: {maxCombo}x</p>}
                  <button
                    onClick={startSpeedGame}
                    className="btn-primary mt-6 flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" /> Play Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Memory Game */}
          {gameMode === GAMES.MEMORY && (
            <div className="py-2">
              {gameActive && (
                <>
                  <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                    <span>Moves: {moves}</span>
                    <span>Pairs: {matchedPairs}/8</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                    {cards.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        disabled={card.flipped || card.matched || !gameActive}
                        className={`aspect-square rounded-xl text-2xl transition-all
                          ${card.flipped || card.matched
                            ? 'bg-blue-500/20 border border-blue-500/30'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                          }
                          ${card.matched ? 'bg-green-500/20 border-green-500/30' : ''}
                          flex items-center justify-center
                        `}
                      >
                        {card.flipped || card.matched ? card.emoji : '❓'}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {gameComplete && (
                <div className="py-8 text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-white">
                    {matchedPairs === 8 ? 'Perfect Memory!' : 'Game Over!'}
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Completed in <span className="text-yellow-400 font-bold">{moves}</span> moves
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Score: {score} points</p>
                  <button
                    onClick={startMemoryGame}
                    className="btn-primary mt-6 flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" /> Play Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Trivia Game */}
          {gameMode === GAMES.TRIVIA && (
            <div className="py-2">
              {gameActive && currentQuestion && (
                <div>
                  <div className="text-xs text-gray-400 mb-2 text-center">
                    {questionTimer}s remaining
                  </div>
                  <p className="text-white font-medium mb-4 text-lg text-center">
                    {currentQuestion.question}
                  </p>
                  <div className="space-y-2 max-w-md mx-auto">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleTriviaAnswer(index)}
                        className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/15 rounded-lg transition-colors text-white border border-white/10 hover:border-blue-500/30"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    <span className="text-green-400">Correct: {gameStats.correct}</span>
                    {' | '}
                    <span className="text-red-400">Wrong: {gameStats.wrong}</span>
                  </div>
                </div>
              )}
              {gameComplete && (
                <div className="py-8 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white">Quiz Complete!</h3>
                  <p className="text-gray-400 mt-2">
                    Score: <span className="text-yellow-400 font-bold">{score}</span> points
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Correct: {gameStats.correct} | Wrong: {gameStats.wrong}
                  </p>
                  {maxCombo > 1 && <p className="text-orange-400 text-sm mt-1">🔥 Best Combo: {maxCombo}x</p>}
                  <button
                    onClick={startTriviaGame}
                    className="btn-primary mt-6 flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" /> Play Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return null;
};

export default LunchBreak;
