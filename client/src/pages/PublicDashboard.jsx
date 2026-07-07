import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, Trophy, Users, Zap, 
  TrendingUp, FolderTree, Flame, Clock, 
  ChevronRight, Award, Target, BookOpen,
  Gamepad2, Globe, Star, Medal, Crown,
  PartyPopper, Rocket, Coffee, MessageCircle,
  BarChart3, Activity, Eye, UserPlus,
  GraduationCap, Lightbulb, Layers, 
  ArrowUpRight, Calendar, CheckCircle,
  Play, Share2, Heart, ThumbsUp,
  Info, Shield, Lock, Server,
  Code, Database, Cloud, Terminal,
  Linkedin, Twitter, Github, Sun, Moon
} from 'lucide-react';

const PublicDashboard = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeStat, setActiveStat] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      icon: Brain, 
      value: '1000+', 
      label: 'Questions',
      color: 'text-[#6C2BD9]',
      bg: 'bg-[#6C2BD9]/20',
      description: 'Curated knowledge'
    },
    { 
      icon: Users, 
      value: '5,000+', 
      label: 'Active Learners',
      color: 'text-blue-400',
      bg: 'bg-blue-400/20',
      description: 'Growing community'
    },
    { 
      icon: Trophy, 
      value: '50+', 
      label: 'Categories',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/20',
      description: 'Diverse topics'
    },
    { 
      icon: Zap, 
      value: '24/7', 
      label: 'Available',
      color: 'text-[#00C9A7]',
      bg: 'bg-[#00C9A7]/20',
      description: 'Always ready'
    },
  ];

  const features = [
    {
      icon: FolderTree,
      title: 'Smart Category Explorer',
      desc: 'Navigate through 50+ categories like a file explorer',
      color: 'from-purple-500 to-pink-500',
      delay: 0.1
    },
    {
      icon: Gamepad2,
      title: 'Multiplayer Battles',
      desc: 'Challenge friends in real-time quiz competitions',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.2
    },
    {
      icon: BookOpen,
      title: 'Read & Test',
      desc: 'Read articles and test your comprehension',
      color: 'from-emerald-500 to-teal-500',
      delay: 0.3
    },
    {
      icon: Sparkles,
      title: 'AI-Generated Questions',
      desc: 'Fresh, personalized questions every time',
      color: 'from-orange-500 to-red-500',
      delay: 0.4
    },
  ];

  const categories = [
    { icon: '💻', name: 'Technology', count: 45 },
    { icon: '🧠', name: 'Science', count: 38 },
    { icon: '🏛️', name: 'History', count: 32 },
    { icon: '🎨', name: 'Arts', count: 28 },
    { icon: '⚽', name: 'Sports', count: 25 },
    { icon: '💰', name: 'Finance', count: 22 },
    { icon: '⛪', name: 'Religion', count: 18 },
    { icon: '🌍', name: 'Geography', count: 20 },
  ];

  const recentActivity = [
    { user: 'Alex K.', action: 'scored 92% on JavaScript Quiz', time: '2 min ago', avatar: '👨‍💻' },
    { user: 'Maria G.', action: 'completed AI & ML reading', time: '5 min ago', avatar: '👩‍🎓' },
    { user: 'James S.', action: 'won a multiplayer battle', time: '12 min ago', avatar: '🧑‍🏫' },
    { user: 'Sarah W.', action: 'solved 5 riddles in a row', time: '23 min ago', avatar: '👩‍🔬' },
    { user: 'Mike B.', action: 'mastered React Hooks quiz', time: '35 min ago', avatar: '👨‍💼' },
    { user: 'Emily D.', action: 'completed Python basics course', time: '1 hour ago', avatar: '👩‍💻' },
  ];

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Software Engineer',
      avatar: '👨‍💻',
      text: 'Cerebrum transformed how I learn. The Read & Test feature is a game-changer!',
      rating: 5
    },
    {
      name: 'Maria Garcia',
      role: 'University Student',
      avatar: '👩‍🎓',
      text: 'I love the variety of categories. Perfect for expanding my knowledge!',
      rating: 5
    },
    {
      name: 'James Smith',
      role: 'Teacher',
      avatar: '🧑‍🏫',
      text: 'My students love the multiplayer battles. Learning has never been this fun!',
      rating: 5
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* ============================================
      HERO SECTION
      ============================================ */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card p-12 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6C2BD9]/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00C9A7]/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6C2BD9]/5 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <Brain className="w-24 h-24 text-[#6C2BD9] mx-auto mb-6" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-white dark:text-white text-gray-900 mb-4"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-[#6C2BD9] via-[#8B5CF6] to-[#00C9A7] bg-clip-text text-transparent">
              Cerebrum
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-gray-400 dark:text-gray-400 text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Master any subject with interactive quizzes, read & test your knowledge,
            and compete with learners worldwide.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex gap-4 justify-center mt-8 flex-wrap"
          >
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4 shadow-lg shadow-[#6C2BD9]/30"
            >
              <UserPlus className="w-5 h-5" /> Get Started - Free
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/categories')}
              className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
            >
              <Eye className="w-5 h-5" /> Explore Categories
            </motion.button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 flex items-center justify-center gap-2 text-sm"
          >
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </span>
            <span className="text-gray-400 dark:text-gray-400 text-gray-500">Trusted by 5,000+ learners</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ============================================
      STATS SECTION
      ============================================ */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 }
            }}
            className="glass-card p-6 text-center hover:border-[#6C2BD9]/30 transition-all duration-300 relative overflow-hidden group"
          >
            <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="relative">
              <motion.div
                animate={activeStat === index ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              </motion.div>
              <motion.div 
                className="text-3xl font-bold text-white dark:text-white text-gray-900"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-400 dark:text-gray-400 text-gray-500">{stat.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 text-gray-400 mt-1">{stat.description}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ============================================
      FEATURES SECTION
      ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900">Why Choose Cerebrum?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + feature.delay }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="glass-card p-6 border border-white/5 hover:border-[#6C2BD9]/30 transition-all duration-300 relative overflow-hidden group"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative">
                <motion.div 
                  className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-20 inline-block mb-3`}
                  animate={hoveredCard === index ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-white dark:text-white text-gray-900 font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ============================================
      POPULAR CATEGORIES
      ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-[#6C2BD9]" />
            <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900">Popular Categories</h2>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/categories')}
            className="text-sm text-[#6C2BD9] hover:text-[#8B5CF6] transition-colors flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/categories')}
              className="glass-card p-4 text-center hover:border-[#6C2BD9]/30 transition-all duration-300"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-white dark:text-white text-gray-800 text-sm font-medium truncate">{cat.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 text-gray-400">{cat.count} questions</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ============================================
      HOW IT WORKS
      ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="glass-card p-8 bg-gradient-to-br from-[#6C2BD9]/10 to-[#8B5CF6]/10 border border-[#6C2BD9]/20"
      >
        <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900 text-center mb-8 flex items-center justify-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: BookOpen, 
              title: 'Learn', 
              desc: 'Read educational articles and explore topics',
              step: '01'
            },
            { 
              icon: Target, 
              title: 'Test', 
              desc: 'Take quizzes and test your understanding',
              step: '02'
            },
            { 
              icon: Trophy, 
              title: 'Master', 
              desc: 'Track progress and compete with others',
              step: '03'
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.15 }}
              className="text-center relative"
            >
              <div className="text-5xl font-bold text-[#6C2BD9]/20 mb-2">{item.step}</div>
              <div className="p-4 bg-[#6C2BD9]/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <item.icon className="w-8 h-8 text-[#6C2BD9]" />
              </div>
              <h3 className="text-xl font-bold text-white dark:text-white text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ============================================
      TWO COLUMN LAYOUT
      ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white dark:text-white text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#6C2BD9]" />
              Recent Activity
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-500 text-gray-400">Live feed</span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3 p-3 bg-white/5 dark:bg-white/5 bg-gray-100/50 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-200/50 transition-colors group"
              >
                <div className="text-2xl">{activity.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white dark:text-white text-gray-800 text-sm font-medium truncate">
                    {activity.user}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-400 text-gray-600 truncate">
                    {activity.action}
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 text-gray-400 whitespace-nowrap">
                  {activity.time}
                </div>
              </motion.div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/auth')}
            className="mt-4 w-full text-center text-sm text-[#6C2BD9] hover:text-[#8B5CF6] transition-colors flex items-center justify-center gap-1 group"
          >
            Sign up to see more <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="glass-card p-6 bg-gradient-to-br from-[#6C2BD9]/20 to-[#8B5CF6]/20 border border-[#6C2BD9]/30"
        >
          <div className="h-full flex flex-col items-center justify-center text-center">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <PartyPopper className="w-16 h-16 text-yellow-400 mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white dark:text-white text-gray-900 mb-2">
              Ready to Begin Your Journey?
            </h3>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 max-w-sm">
              Join thousands of learners and start mastering new topics today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-xs">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth')}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Sign Up Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/categories')}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" /> Explore
              </motion.button>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 text-gray-400">
              <span className="flex items-center gap-1">
                <Coffee className="w-3 h-3" /> No credit card
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Rocket className="w-3 h-3" /> Start instantly
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================
      ABOUT SECTION
      ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Info className="w-8 h-8 text-[#6C2BD9]" />
          <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900">About Cerebrum</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Description */}
          <div>
            <p className="text-gray-300 dark:text-gray-300 text-gray-700 leading-relaxed mb-4">
              <span className="text-[#6C2BD9] font-semibold">Cerebrum</span> is a next-generation learning platform 
              that combines interactive quizzes, reading materials, and multiplayer battles 
              to make learning engaging and fun.
            </p>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 leading-relaxed mb-4">
              Our mission is to make knowledge accessible to everyone. Whether you're a student 
              preparing for exams, a professional looking to upskill, or just someone who loves 
              learning, Cerebrum has something for you.
            </p>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 leading-relaxed">
              With 50+ categories, 1000+ questions, and a growing community of learners, 
              Cerebrum is the ultimate destination for interactive learning.
            </p>
          </div>

          {/* Right - Stats & Links */}
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 dark:bg-white/5 bg-gray-100/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#6C2BD9]">50+</div>
                <div className="text-xs text-gray-400 dark:text-gray-400 text-gray-600">Categories</div>
              </div>
              <div className="bg-white/5 dark:bg-white/5 bg-gray-100/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">1000+</div>
                <div className="text-xs text-gray-400 dark:text-gray-400 text-gray-600">Questions</div>
              </div>
              <div className="bg-white/5 dark:bg-white/5 bg-gray-100/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#00C9A7]">5K+</div>
                <div className="text-xs text-gray-400 dark:text-gray-400 text-gray-600">Learners</div>
              </div>
              <div className="bg-white/5 dark:bg-white/5 bg-gray-100/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">24/7</div>
                <div className="text-xs text-gray-400 dark:text-gray-400 text-gray-600">Available</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 justify-center">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://github.com/benjamindestiny/cerebrum"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 dark:bg-white/5 bg-gray-100/50 rounded-full hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-200/50 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-400 dark:text-gray-400 text-gray-600" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="p-2 bg-white/5 dark:bg-white/5 bg-gray-100/50 rounded-full hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-200/50 transition-colors"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="p-2 bg-white/5 dark:bg-white/5 bg-gray-100/50 rounded-full hover:bg-white/10 dark:hover:bg-white/10 hover:bg-gray-200/50 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-blue-500" />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================================
      TESTIMONIALS SECTION
      ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white dark:text-white text-gray-900 text-center mb-6 flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-red-400" />
          What Our Learners Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center hover:border-[#6C2BD9]/30 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{testimonial.avatar}</div>
              <div className="flex justify-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 dark:text-gray-300 text-gray-700 text-sm italic">"{testimonial.text}"</p>
              <div className="mt-3">
                <div className="text-white dark:text-white text-gray-900 font-semibold text-sm">{testimonial.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 text-gray-500">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ============================================
      BOTTOM CTA
      ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="glass-card p-8 bg-gradient-to-r from-[#6C2BD9]/30 to-[#00C9A7]/30 border border-white/10 text-center"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="p-3 bg-[#6C2BD9]/30 rounded-full"
            >
              <MessageCircle className="w-8 h-8 text-[#6C2BD9]" />
            </motion.div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white dark:text-white text-gray-900">Join the Conversation</h3>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">Connect with learners and share your progress</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth')}
            className="btn-primary flex items-center gap-2 px-8 py-3 shadow-lg shadow-[#6C2BD9]/30"
          >
            <Users className="w-5 h-5" /> Join Now - It's Free
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicDashboard;
