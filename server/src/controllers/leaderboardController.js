// server/src/controllers/leaderboardController.js
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 20, timeFrame = 'all' } = req.query;
    
    let query = {};
    
    // Time frame filtering
    if (timeFrame !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (timeFrame) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          break;
      }
      
      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }
    
    // Get top users based on quiz results
    const topResults = await QuizResult.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$userId',
          userName: { $first: '$userName' },
          totalScore: { $avg: '$score' },
          totalCorrect: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: '$totalQuestions' },
          quizCount: { $sum: 1 },
          bestScore: { $max: '$score' },
          totalPrize: { $sum: '$prize' }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: parseInt(limit) }
    ]);
    
    // Get user details
    const userIds = topResults.map(r => r._id);
    const users = await User.find({ _id: { $in: userIds } })
      .select('name email stats');
    
    // Combine data
    const leaderboard = topResults.map((result, index) => {
      const user = users.find(u => u._id.toString() === result._id.toString());
      return {
        rank: index + 1,
        userId: result._id,
        name: result.userName,
        totalScore: Math.round(result.totalScore),
        bestScore: result.bestScore,
        quizCount: result.quizCount,
        totalPrize: result.totalPrize,
        avatar: user?.avatar || ''
      };
    });
    
    res.json({
      success: true,
      leaderboard,
      timeFrame
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
};

// @desc    Get friends leaderboard
// @route   GET /api/leaderboard/friends
// @access  Private
const getFriendsLeaderboard = async (req, res) => {
  try {
    // For now, just return global leaderboard with user's rank
    const users = await User.find()
      .sort({ 'stats.bestScore': -1 })
      .limit(20)
      .select('name stats.bestScore stats.totalQuizzes');
    
    // Find user's rank
    const allUsers = await User.find()
      .sort({ 'stats.bestScore': -1 })
      .select('_id');
    
    const userRank = allUsers.findIndex(u => u._id.toString() === req.user.id.toString()) + 1;
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      bestScore: user.stats.bestScore,
      totalQuizzes: user.stats.totalQuizzes,
      isUser: user._id.toString() === req.user.id.toString()
    }));
    
    res.json({
      success: true,
      leaderboard,
      userRank,
      totalUsers: allUsers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch friends leaderboard'
    });
  }
};

module.exports = {
  getLeaderboard,
  getFriendsLeaderboard
};