import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Brain, Home, LayoutDashboard, Trophy, Puzzle, User, LogIn,
  FolderTree, Sparkles, Clock, ArrowRight, Users, Zap,
  Mail, Lock, ChevronLeft, ChevronRight, Check,
  Crown, Medal, Award, Lightbulb
} from 'lucide-react';

// ============================================
// LAYOUT COMPONENT
// ============================================
const Layout = ({ children }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  const navLinks = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/categories', icon: FolderTree, label: 'Categories' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/riddles', icon: Puzzle, label: 'Riddles' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-[#1A1A3E]/95 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <Brain className="w-8 h-8 text-[#6C2BD9] group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#6C2BD9] to-[#8B5CF6] bg-clip-text text-transparent">
                Cerebrum
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link key={path} to={path} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive(path) ? 'bg-[#6C2BD9]/20 text-[#8B5CF6]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </nav>
            <Link to="/auth" className="px-4 py-2 bg-[#6C2BD9] text-white rounded-lg hover:bg-[#5A1BB8] transition-colors text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" /> Sign In
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <footer className="border-t border-white/10 bg-[#1A1A3E]/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl text-center text-gray-400 text-sm">
          <Brain className="w-4 h-4 text-[#6C2BD9] inline mr-2" />
          Cerebrum &copy; 2025 | Built with ❤️ for knowledge
        </div>
      </footer>
    </div>
  );
};

// ============================================
// HOME PAGE
// ============================================
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div className="glass-card p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C2BD9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00C9A7]/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <Brain className="w-16 h-16 text-[#6C2BD9] mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-[#6C2BD9] to-[#8B5CF6] bg-clip-text text-transparent">
              Cerebrum
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Master any subject with our interactive quiz platform.</p>
          <div className="flex gap-4 justify-center mt-6 flex-wrap">
            <button onClick={() => navigate('/categories')} className="btn-primary flex items-center gap-2">
              <FolderTree className="w-4 h-4" /> Explore Categories
            </button>
            <button onClick={() => navigate('/quiz')} className="btn-secondary flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Quick Quiz <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Brain, value: '100+', label: 'Questions', color: 'text-[#6C2BD9]' },
          { icon: Users, value: '1K+', label: 'Players', color: 'text-blue-400' },
          { icon: Trophy, value: '24', label: 'Categories', color: 'text-yellow-400' },
          { icon: Zap, value: '3', label: 'Difficulties', color: 'text-[#00C9A7]' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6 bg-gradient-to-r from-[#6C2BD9]/10 to-[#8B5CF6]/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#6C2BD9]/20 rounded-full"><Clock className="w-6 h-6 text-[#6C2BD9]" /></div>
            <div><h3 className="text-white font-semibold">Ready to Challenge Yourself?</h3><p className="text-sm text-gray-400">Start a random quiz and test your knowledge</p></div>
          </div>
          <button onClick={() => navigate('/quiz')} className="btn-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Start Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// AUTH PAGE
// ============================================
const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/'); }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A1A] p-4">
      <div className="glass-card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Brain className="w-16 h-16 text-[#6C2BD9] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Cerebrum</h1>
          <p className="text-gray-400 text-sm">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input type="text" placeholder="Full Name" className="w-full pl-10 pr-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#6C2BD9] focus:outline-none" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input type="email" placeholder="Email Address" className="w-full pl-10 pr-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#6C2BD9] focus:outline-none" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#6C2BD9] focus:outline-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <><LogIn className="w-4 h-4" /> {isLogin ? 'Sign In' : 'Create Account'}</>}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-400 hover:text-white transition-colors">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// QUIZ PAGE
// ============================================
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
        <div className="text-center"><div className="w-12 h-12 border-4 border-[#6C2BD9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-400">Loading questions...</p></div>
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
            <Clock className="w-4 h-4" /><span className="font-bold">{timeLeft}s</span>
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

// ============================================
// RESULTS PAGE
// ============================================
const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResults');
    if (stored) { setResults(JSON.parse(stored)); } else { navigate('/'); }
  }, [navigate]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center"><div className="w-12 h-12 border-4 border-[#6C2BD9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-400">Loading results...</p></div>
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
            <div className="text-center"><div className="text-5xl font-bold text-white">{score}%</div><div className="text-sm text-gray-400">Score</div></div>
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
          <button onClick={() => navigate('/')} className="btn-primary flex items-center gap-2"><ArrowRight className="w-4 h-4" /> New Quiz</button>
          <button className="btn-secondary flex items-center gap-2"><Share className="w-4 h-4" /> Share Results</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD PAGE
// ============================================
const Dashboard = () => {
  const stats = [
    { icon: Trophy, value: '0', label: 'Quizzes Taken', color: 'text-yellow-400' },
    { icon: Award, value: '0%', label: 'Best Score', color: 'text-[#00C9A7]' },
    { icon: Clock, value: '0', label: 'Total Time', color: 'text-[#6C2BD9]' },
    { icon: Zap, value: '0', label: 'Streak', color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><LayoutDashboard className="w-8 h-8 text-[#6C2BD9]" /><div><h1 className="text-3xl font-bold text-white">Dashboard</h1><p className="text-gray-400 text-sm">Track your progress and performance</p></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6"><h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2><p className="text-gray-400 text-center py-8">No activity yet. Start your first quiz!</p></div>
    </div>
  );
};

// ============================================
// LEADERBOARD PAGE
// ============================================
const Leaderboard = () => {
  const players = [
    { rank: 1, name: 'Alex Johnson', score: 95, games: 12 },
    { rank: 2, name: 'Maria Garcia', score: 88, games: 10 },
    { rank: 3, name: 'James Smith', score: 82, games: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-white flex items-center gap-3"><Trophy className="w-8 h-8 text-yellow-400" /> Leaderboard</h1><p className="text-gray-400 mt-1">Top performers this month</p></div>
        <div className="glass-card px-4 py-2 flex items-center gap-2"><Users className="w-5 h-5 text-[#6C2BD9]" /><span className="text-sm text-gray-300">1,234 players</span></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((p) => (
          <div key={p.rank} className={`glass-card p-6 text-center ${p.rank === 1 ? 'border-yellow-400/30 bg-yellow-400/5' : p.rank === 2 ? 'border-gray-400/30 bg-gray-400/5' : 'border-amber-600/30 bg-amber-600/5'}`}>
            <div className="text-4xl mb-2">{p.rank === 1 ? <Crown className="w-8 h-8 text-yellow-400 mx-auto" /> : <Medal className="w-8 h-8 text-gray-400 mx-auto" />}</div>
            <div className="text-xl font-bold text-white">{p.name}</div>
            <div className="text-2xl font-bold text-[#6C2BD9] mt-1">{p.score}%</div>
            <div className="text-sm text-gray-400">{p.games} games</div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6"><h3 className="text-white font-semibold mb-4">All Players</h3>
        {players.map((p) => (
          <div key={p.rank} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4"><span className="text-gray-400 w-8">#{p.rank}</span><span className="text-white font-medium">{p.name}</span></div>
            <div className="text-right"><div className="text-white font-bold">{p.score}%</div><div className="text-xs text-gray-400">{p.games} games</div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// RIDDLES PAGE
// ============================================
const Riddles = () => {
  const riddles = [
    { id: 1, question: "What has keys but can't open locks?", hint: "Think about what you type on", difficulty: "Easy" },
    { id: 2, question: "I speak without a mouth and hear without ears. What am I?", hint: "It comes from your device", difficulty: "Medium" },
    { id: 3, question: "The more you take, the more you leave behind. What am I?", hint: "Think about walking", difficulty: "Hard" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-white flex items-center gap-3"><Puzzle className="w-8 h-8 text-[#6C2BD9]" /> Riddle Challenge</h1><p className="text-gray-400 mt-1">Test your lateral thinking skills</p></div>
        <div className="glass-card px-4 py-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-400" /><span className="text-sm text-gray-300">Daily Riddle</span></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riddles.map((r) => (
          <div key={r.id} className="glass-card p-6 hover:border-[#6C2BD9]/30 transition-all duration-300">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-[#6C2BD9] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium">{r.question}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button className="text-sm text-[#6C2BD9] hover:text-[#8B5CF6] transition-colors flex items-center gap-1"><Lightbulb className="w-4 h-4" /> Hint</button>
                  <span className={`text-xs px-2 py-1 rounded-full ${r.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : r.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{r.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// CATEGORIES PAGE
// ============================================
const Categories = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(new Set());

  const toggleExpand = (id) => {
    const newSet = new Set(expanded);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpanded(newSet);
  };

  const categories = [
    { id: 1, name: 'Technology', icon: Laptop, color: 'text-blue-400', children: [
      { id: 11, name: 'Programming', icon: Code, color: 'text-purple-400', children: [
        { id: 111, name: 'JavaScript', icon: Star, color: 'text-yellow-400' },
        { id: 112, name: 'Python', icon: Star, color: 'text-green-400' },
      ]}
    ]},
    { id: 2, name: 'Science', icon: FlaskConical, color: 'text-green-400', children: [
      { id: 21, name: 'Physics', icon: Globe, color: 'text-cyan-400', children: [
        { id: 211, name: 'Mechanics', icon: Target, color: 'text-blue-400' },
      ]}
    ]},
  ];

  const renderCategory = (cat, depth = 0) => {
    const hasChildren = cat.children?.length > 0;
    const isExpanded = expanded.has(cat.id);
    const Icon = cat.icon;

    return (
      <div key={cat.id} className="mb-1">
        <div className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-white/5`} style={{ paddingLeft: `${depth * 20 + 8}px` }} onClick={() => { if (hasChildren) toggleExpand(cat.id); else navigate('/quiz'); }}>
          {hasChildren && (isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />)}
          <Icon className={`w-5 h-5 ${cat.color || 'text-gray-400'}`} />
          <span className="text-white font-medium text-sm">{cat.name}</span>
          {!hasChildren && <span className="ml-auto text-xs text-yellow-400"><Trophy className="w-3 h-3 inline" /> Quiz</span>}
        </div>
        {hasChildren && isExpanded && <div className="ml-4 border-l-2 border-white/5 pl-2">{cat.children.map(c => renderCategory(c, depth + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-white flex items-center gap-3"><FolderTree className="w-8 h-8 text-[#6C2BD9]" /> Category Explorer</h1><p className="text-gray-400 mt-1">Browse categories like a file explorer</p></div>
        <div className="glass-card px-4 py-2 flex items-center gap-2"><Brain className="w-5 h-5 text-[#6C2BD9]" /><span className="text-sm text-gray-300">24 Categories</span></div>
      </div>
      <div className="glass-card p-6"><div className="max-h-[600px] overflow-y-auto">{categories.map(c => renderCategory(c))}</div></div>
      <div className="glass-card p-6 bg-gradient-to-r from-[#6C2BD9]/10 to-[#8B5CF6]/10 border border-[#6C2BD9]/20">
        <div className="flex items-center gap-4"><Sparkles className="w-8 h-8 text-[#6C2BD9]" /><div><h3 className="text-white font-semibold">Smart Category Explorer</h3><p className="text-sm text-gray-400">Click any sub-category to instantly start a quiz!</p></div></div>
      </div>
    </div>
  );
};

// ============================================
// APP
// ============================================
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A1A]">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/quiz" element={<Layout><Quiz /></Layout>} />
          <Route path="/results" element={<Layout><Results /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
          <Route path="/riddles" element={<Layout><Riddles /></Layout>} />
          <Route path="/categories" element={<Layout><Categories /></Layout>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" toastClassName="!bg-[#1A1A3E] !text-white !rounded-xl !border !border-white/10" />
      </div>
    </Router>
  );
}

export default App;
