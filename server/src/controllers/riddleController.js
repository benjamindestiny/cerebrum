// server/src/controllers/riddleController.js
const Riddle = require('../models/Riddle');
const User = require('../models/User');

// @desc    Get riddles
// @route   GET /api/riddles
// @access  Public
const getRiddles = async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    
    const riddles = await Riddle.find(query)
      .limit(parseInt(limit))
      .select('-__v');
    
    res.json({
      success: true,
      riddles: riddles.map(r => ({
        ...r.toObject(),
        answer: undefined // Hide answer
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch riddles'
    });
  }
};

// @desc    Get daily riddle
// @route   GET /api/riddles/daily
// @access  Public
const getDailyRiddle = async (req, res) => {
  try {
    // Get or create daily riddle
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    
    const count = await Riddle.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    
    const riddle = await Riddle.findOne().skip(randomIndex);
    
    res.json({
      success: true,
      riddle: {
        ...riddle.toObject(),
        answer: undefined
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch daily riddle'
    });
  }
};

// @desc    Solve riddle
// @route   POST /api/riddles/solve
// @access  Private
const solveRiddle = async (req, res) => {
  try {
    const { riddleId, answer } = req.body;
    
    const riddle = await Riddle.findById(riddleId);
    
    if (!riddle) {
      return res.status(404).json({
        success: false,
        error: 'Riddle not found'
      });
    }
    
    const isCorrect = answer.toLowerCase().trim() === riddle.answer.toLowerCase().trim();
    
    if (isCorrect) {
      // Update riddle stats
      riddle.timesSolved += 1;
      await riddle.save();
      
      // Update user stats
      req.user.stats.totalPrize += riddle.points;
      await req.user.save();
    }
    
    res.json({
      success: true,
      isCorrect,
      points: isCorrect ? riddle.points : 0,
      explanation: isCorrect ? riddle.explanation : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to solve riddle'
    });
  }
};

// @desc    Create riddle (Admin only)
// @route   POST /api/riddles
// @access  Private (Admin)
const createRiddle = async (req, res) => {
  try {
    const { title, riddle, answer, hint, explanation, difficulty, category, points } = req.body;
    
    const newRiddle = await Riddle.create({
      title,
      riddle,
      answer,
      hint,
      explanation,
      difficulty,
      category,
      points,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      riddle: newRiddle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get riddle leaderboard
// @route   GET /api/riddles/leaderboard
// @access  Public
const getRiddleLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ 'stats.totalPrize': -1 })
      .limit(10)
      .select('name stats.totalPrize stats.quizzesCompleted');
    
    res.json({
      success: true,
      leaderboard: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
};

module.exports = {
  getRiddles,
  getDailyRiddle,
  solveRiddle,
  createRiddle,
  getRiddleLeaderboard
};