// server/src/routes/riddleRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getRiddles, 
  getDailyRiddle, 
  solveRiddle, 
  createRiddle,
  getRiddleLeaderboard 
} = require('../controllers/riddleController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getRiddles);
router.get('/daily', getDailyRiddle);
router.get('/leaderboard', getRiddleLeaderboard);
router.post('/solve', protect, solveRiddle);
router.post('/', protect, adminOnly, createRiddle);

module.exports = router;