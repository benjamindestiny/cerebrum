// server/src/models/Riddle.js
const mongoose = require('mongoose');

const riddleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  riddle: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  hint: {
    type: String,
    default: ''
  },
  explanation: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['logic', 'math', 'wordplay', 'lateral', 'visual', 'classic'],
    default: 'logic'
  },
  points: {
    type: Number,
    default: 10
  },
  timesSolved: {
    type: Number,
    default: 0
  },
  solveRate: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Riddle = mongoose.model('Riddle', riddleSchema);

module.exports = Riddle;