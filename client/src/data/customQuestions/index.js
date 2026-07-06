// Combine all custom question categories
import { financeQuestions } from './finance.js';
import { technologyQuestions } from './technology.js';
import { religionQuestions } from './religion.js';
import { sportsQuestions } from './sports.js';
import { healthQuestions } from './health.js';

// Merge all question categories
export const customQuestions = {
  ...financeQuestions,
  ...technologyQuestions,
  ...religionQuestions,
  ...sportsQuestions,
  ...healthQuestions
};

// Helper function to get custom questions
export const getCustomQuestions = (categoryId, count = 15) => {
  
  let questions = customQuestions[categoryId] || [];
  
  if (questions.length === 0) {
    const keys = Object.keys(customQuestions);
    for (const key of keys) {
      if (categoryId.includes(key) || key.includes(categoryId)) {
        questions = customQuestions[key];
        break;
      }
    }
  }
  
  // Ensure questions have the correct format (incorrect_answers array)
  const formattedQuestions = questions.map(q => {
    // If the question has 'options' but not 'incorrect_answers', convert it
    if (q.options && !q.incorrect_answers) {
      // Get the correct answer from options using the 'correct' index if available
      const correctAnswer = q.correct_answer || (q.correct !== undefined ? q.options[q.correct] : q.options[0]);
      const incorrectAnswers = q.options.filter(opt => opt !== correctAnswer);
      return {
        ...q,
        correct_answer: correctAnswer,
        incorrect_answers: incorrectAnswers,
        shuffledOptions: shuffleArray([correctAnswer, ...incorrectAnswers])
      };
    }
    return q;
  });
  
  // Shuffle and return
  const shuffled = [...formattedQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Simple shuffle function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const hasCustomQuestions = (categoryId) => {
  if (!categoryId) return false;
  const questions = getCustomQuestions(categoryId, 1);
  return questions.length > 0;
};

export default customQuestions;
