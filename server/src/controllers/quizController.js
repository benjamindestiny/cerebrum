// server/src/controllers/quizController.js
const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const { OpenAI } = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @desc    Get quiz questions
// @route   POST /api/quiz/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const { category, difficulty, count = 10, type = 'multiple' } = req.body;
    
    let questions = [];
    
    // Try to get questions from database
    const query = {
      'category.id': category,
      difficulty: difficulty,
      type: type
    };
    
    const dbQuestions = await Question.find(query)
      .limit(count)
      .select('-__v');
    
    if (dbQuestions.length >= count) {
      questions = dbQuestions;
    } else {
      // If not enough questions, generate with AI
      if (process.env.OPENAI_API_KEY) {
        const aiQuestions = await generateQuestionsWithAI(category, difficulty, count - dbQuestions.length);
        questions = [...dbQuestions, ...aiQuestions];
      } else {
        // Use fallback questions
        const fallbackQuestions = await getFallbackQuestions(category, difficulty, count - dbQuestions.length);
        questions = [...dbQuestions, ...fallbackQuestions];
      }
    }
    
    // Increment times used
    await Question.updateMany(
      { _id: { $in: questions.map(q => q._id) } },
      { $inc: { timesUsed: 1 } }
    );
    
    // Prepare questions for client (hide answers)
    const clientQuestions = questions.map(q => ({
      id: q._id,
      category: q.category,
      difficulty: q.difficulty,
      type: q.type,
      question: q.question,
      incorrect_answers: q.incorrect_answers,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      imageUrl: q.imageUrl,
      audioUrl: q.audioUrl
    }));
    
    res.json({
      success: true,
      questions: clientQuestions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch questions'
    });
  }
};

// @desc    Generate questions with AI
const generateQuestionsWithAI = async (category, difficulty, count) => {
  try {
    const prompt = `
      Generate ${count} ${difficulty} difficulty multiple choice questions about ${category.name}.
      Format as JSON array with fields: question, correct_answer, incorrect_answers (array of 3).
      Return only valid JSON.
    `;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    const aiQuestions = JSON.parse(response.choices[0].message.content);
    
    // Save to database
    const savedQuestions = await Question.create(
      aiQuestions.map(q => ({
        ...q,
        category: category,
        difficulty: difficulty,
        isAIGenerated: true,
        isVerified: false
      }))
    );
    
    return savedQuestions;
  } catch (error) {
    console.error('AI generation failed:', error);
    return [];
  }
};

// @desc    Get fallback questions
const getFallbackQuestions = async (category, difficulty, count) => {
  const fallbackQuestions = [];
  const categoryName = category.name || 'General Knowledge';
  
  for (let i = 1; i <= count; i++) {
    fallbackQuestions.push({
      category: category,
      difficulty: difficulty,
      type: 'multiple',
      question: `Sample question ${i} about ${categoryName}`,
      correct_answer: `Correct Answer ${i}`,
      incorrect_answers: [`Wrong Answer ${i}A`, `Wrong Answer ${i}B`, `Wrong Answer ${i}C`],
      explanation: `This is a sample explanation for question ${i}.`
    });
  }
  
  return fallbackQuestions;
};

// @desc    Submit quiz results
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      questions, 
      answers, 
      timeTaken 
    } = req.body;
    
    // Calculate score
    let correctCount = 0;
    const questionResults = [];
    
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correct_answer;
      
      if (isCorrect) correctCount++;
      
      questionResults.push({
        question: q.question,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers,
        user_answer: userAnswer,
        isCorrect
      });
    });
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    // Calculate prize
    let prize = 0;
    if (score >= 90) prize = 100;
    else if (score >= 70) prize = 50;
    else if (score >= 50) prize = 25;
    else if (score >= 30) prize = 5;
    
    // Save quiz result
    const quizResult = await QuizResult.create({
      userId: req.user.id,
      userName: req.user.name,
      category: category,
      difficulty: difficulty,
      score,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      timeTaken,
      prize,
      questions: questionResults,
      answers: questionResults.map((q, i) => ({
        questionId: questions[i]._id,
        selectedAnswer: q.user_answer,
        isCorrect: q.isCorrect
      }))
    });
    
    // Update user stats
    await req.user.updateStats({
      correctCount,
      totalQuestions: questions.length,
      timeTaken,
      score,
      prize
    });
    
    res.json({
      success: true,
      score,
      correctCount,
      totalQuestions: questions.length,
      timeTaken,
      prize,
      quizId: quizResult._id
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit quiz'
    });
  }
};

// @desc    Get quiz history
// @route   GET /api/quiz/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const results = await QuizResult.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      history: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history'
    });
  }
};

// @desc    Get detailed quiz result
// @route   GET /api/quiz/result/:id
// @access  Private
const getResult = async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Result not found'
      });
    }
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch result'
    });
  }
};

module.exports = {
  getQuestions,
  submitQuiz,
  getHistory,
  getResult
};