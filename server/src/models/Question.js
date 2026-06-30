// server/src/models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: {
    id: { type: Number, required: true },
    name: { type: String, required: true }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  type: {
    type: String,
    enum: ['multiple', 'boolean', 'riddle', 'fill_blank'],
    default: 'multiple'
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  correct_answer: {
    type: String,
    required: true
  },
  incorrect_answers: [{
    type: String
  }],
  explanation: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  audioUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  difficultyRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  timesUsed: {
    type: Number,
    default: 0
  },
  correctRate: {
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
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for performance
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ 'category.id': 1 });
questionSchema.index({ tags: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;