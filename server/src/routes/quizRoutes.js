// server/src/routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getQuestions, 
  submitQuiz, 
  getHistory, 
  getResult 
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.post('/questions', getQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getHistory);
router.get('/result/:id', protect, getResult);

module.exports = router;