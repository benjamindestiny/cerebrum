// server/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  stats: {
    totalQuizzes: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalIncorrect: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
    totalPrize: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 }
  },
  achievements: [{
    type: String,
    enum: ['first_quiz', 'perfect_score', 'streak_5', 'streak_10', 'quiz_master', 'riddle_solver']
  }],
  preferences: {
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    sound: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update stats method
userSchema.methods.updateStats = async function(quizData) {
  this.stats.totalQuizzes += 1;
  this.stats.totalCorrect += quizData.correctCount;
  this.stats.totalIncorrect += quizData.totalQuestions - quizData.correctCount;
  this.stats.totalTime += quizData.timeTaken;
  this.stats.totalPrize += quizData.prize || 0;
  this.stats.quizzesCompleted += 1;
  
  if (quizData.score > this.stats.bestScore) {
    this.stats.bestScore = quizData.score;
  }
  
  const totalQuizzes = this.stats.quizzesCompleted;
  const totalCorrect = this.stats.totalCorrect;
  const totalQuestions = totalCorrect + this.stats.totalIncorrect;
  this.stats.averageScore = totalQuestions > 0 
    ? Math.round((totalCorrect / totalQuestions) * 100) 
    : 0;
  
  // Update streak
  const lastQuizDate = this.stats.lastQuizDate;
  const today = new Date();
  const diffDays = lastQuizDate 
    ? Math.floor((today - lastQuizDate) / (1000 * 60 * 60 * 24))
    : 1;
  
  if (diffDays === 1) {
    this.stats.streak += 1;
  } else if (diffDays > 1) {
    this.stats.streak = 1;
  }
  
  if (this.stats.streak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.streak;
  }
  
  this.stats.lastQuizDate = today;
  this.updatedAt = today;
  
  await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;