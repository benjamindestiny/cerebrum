// server/src/routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const { getLeaderboard, getFriendsLeaderboard } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

router.get('/', getLeaderboard);
router.get('/friends', protect, getFriendsLeaderboard);

module.exports = router;