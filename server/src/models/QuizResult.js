// server/src/models/QuizResult.js
const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  category: {
    id: { type: Number },
    name: { type: String, required: true }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number,
    required: true
  },
  prize: {
    type: Number,
    default: 0
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedAnswer: String,
    isCorrect: Boolean
  }],
  questions: [{
    question: String,
    correct_answer: String,
    incorrect_answers: [String],
    user_answer: String,
    isCorrect: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
quizResultSchema.index({ userId: 1, createdAt: -1 });
quizResultSchema.index({ score: -1 });
quizResultSchema.index({ category: 1 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;