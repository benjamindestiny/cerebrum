// Open Trivia DB API Service with Category-Specific Fallbacks
const BASE_URL = "https://opentdb.com/api.php";
const CATEGORY_URL = "https://opentdb.com/api_category.php";
const COUNT_URL = "https://opentdb.com/api_count.php";

import { getCustomQuestions } from "../data/customQuestions";

const questionCache = {};
let categoriesCache = null;
let countsCache = {};
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export const decodeHTML = (html) => {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const fetchCategories = async () => {
  const now = Date.now();
  if (categoriesCache && now - lastFetchTime < CACHE_DURATION) {
    return categoriesCache;
  }

  try {
    const response = await fetch(CATEGORY_URL);
    const data = await response.json();
    categoriesCache = data.trivia_categories || [];
    lastFetchTime = now;
    return categoriesCache;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return categoriesCache || [];
  }
};

export const fetchCategoryCount = async (categoryId) => {
  if (countsCache[categoryId]) {
    return { total_question_count: countsCache[categoryId] };
  }

  try {
    const response = await fetch(`${COUNT_URL}?category=${categoryId}`);
    const data = await response.json();
    const count = data.category_question_count?.total_question_count || 0;
    countsCache[categoryId] = count;
    return { total_question_count: count };
  } catch (error) {
    console.error("Error fetching category count:", error);
    return { total_question_count: 0 };
  }
};

// ============================================
// CATEGORY-SPECIFIC FALLBACK QUESTIONS
// ============================================
export const FALLBACK_QUESTIONS_BY_CATEGORY = {
  // ... (keep your existing fallback questions but make them harder)

  // Default fallback - now with harder questions
  default: [
    {
      question: "Which of these countries was NOT part of the British Empire at its peak?",
      correct_answer: "France",
      incorrect_answers: ["India", "Canada", "Australia"],
      category: "General Knowledge",
    },
    {
      question: "Which of these is NOT a type of star in the main sequence?",
      correct_answer: "Red giant",
      incorrect_answers: ["G-type", "K-type", "M-type"],
      category: "General Knowledge",
    },
    {
      question: "Who wrote the concept of 'the social contract'?",
      correct_answer: "Jean-Jacques Rousseau",
      incorrect_answers: ["Thomas Hobbes", "John Locke", "Voltaire"],
      category: "General Knowledge",
    },
    {
      question: "Which of these is NOT one of the four fundamental forces?",
      correct_answer: "Friction",
      incorrect_answers: ["Gravity", "Electromagnetism", "Strong nuclear force"],
      category: "General Knowledge",
    },
    {
      question: "In which country did the Renaissance originate?",
      correct_answer: "Italy",
      incorrect_answers: ["France", "England", "Germany"],
      category: "General Knowledge",
    },
  ],
};

// Get fallback questions by category
const getFallbackQuestions = (categoryId, count) => {
  const catId =
    typeof categoryId === "string" ? parseInt(categoryId) : categoryId;

  let questions = FALLBACK_QUESTIONS_BY_CATEGORY[catId] || [];

  if (questions.length === 0) {
    const categoryMap = {
      general: 9,
      "general knowledge": 9,
      books: 10,
      film: 11,
      movies: 11,
      music: 12,
      science: 17,
      "science and nature": 17,
      nature: 17,
      computers: 18,
      technology: 18,
      programming: 18,
      "web-development": 18,
      "web development": 18,
      sports: 21,
      geography: 22,
      history: 23,
    };

    if (typeof categoryId === "string") {
      const normalizedCategory = categoryId
        .toLowerCase()
        .trim()
        .replace(/[_\s]+/g, "-");
      let mappedId = categoryMap[normalizedCategory];

      if (!mappedId) {
        for (const [key, id] of Object.entries(categoryMap)) {
          if (
            normalizedCategory.includes(key) ||
            key.includes(normalizedCategory)
          ) {
            mappedId = id;
            break;
          }
        }
      }

      if (mappedId && FALLBACK_QUESTIONS_BY_CATEGORY[mappedId]) {
        questions = FALLBACK_QUESTIONS_BY_CATEGORY[mappedId];
      }
    }
  }

  if (questions.length === 0) {
    questions =
      FALLBACK_QUESTIONS_BY_CATEGORY.default ||
      FALLBACK_QUESTIONS_BY_CATEGORY[9];
  }

  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// ============================================
// MAIN FETCH FUNCTION - WITH DIFFICULTY
// ============================================
export const fetchQuestions = async (
  amount = 20,
  categoryId = null,
  difficulty = null,
  type = "multiple",
) => {
  const cacheKey = `${categoryId}_${difficulty}_${amount}`;

  if (questionCache[cacheKey]) {
    return questionCache[cacheKey];
  }

  try {
    let allQuestions = [];
    let actualCategoryId = categoryId;

    // 1. Check for custom questions
    if (typeof categoryId === "string") {
      const customQ = getCustomQuestions(categoryId, amount);
      if (customQ.length > 0) {
        allQuestions = customQ;
      }
    }

    // 2. If we have enough custom questions, return them
    if (allQuestions.length >= amount) {
      const shuffled = shuffleArray(allQuestions);
      questionCache[cacheKey] = shuffled;
      return shuffled.slice(0, amount);
    }

    // 3. Try API with difficulty
    const neededFromApi = Math.max(0, amount - allQuestions.length);
    let apiCategoryId = null;

    if (typeof categoryId === "number" && categoryId >= 9 && categoryId <= 32) {
      apiCategoryId = categoryId;
      actualCategoryId = categoryId;
    } else if (typeof categoryId === "string") {
      const parsed = parseInt(categoryId);
      if (!isNaN(parsed) && parsed >= 9 && parsed <= 32) {
        apiCategoryId = parsed;
        actualCategoryId = parsed;
      }
    }

    let apiQuestions = [];
    if (apiCategoryId && neededFromApi > 0) {
      const params = new URLSearchParams({
        amount: Math.min(neededFromApi, 50),
        type: type,
      });

      if (apiCategoryId) params.append("category", apiCategoryId);
      if (difficulty) params.append("difficulty", difficulty);

      const url = `${BASE_URL}?${params.toString()}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (
          data.response_code === 0 &&
          data.results &&
          data.results.length > 0
        ) {
          apiQuestions = data.results.map((q) => ({
            ...q,
            question: decodeHTML(q.question),
            correct_answer: decodeHTML(q.correct_answer),
            incorrect_answers: q.incorrect_answers.map((a) => decodeHTML(a)),
          }));
        }
      } catch (apiError) {}
    }

    allQuestions = [...allQuestions, ...apiQuestions];

    // 4. Use category-specific fallback if needed
    if (allQuestions.length < amount) {
      const needed = amount - allQuestions.length;
      const fallback = getFallbackQuestions(actualCategoryId, needed);
      allQuestions = [...allQuestions, ...fallback];
    }

    // 5. Always return something
    if (allQuestions.length === 0) {
      const fallback = getFallbackQuestions(9, Math.min(amount, 10));
      allQuestions = fallback;
    }

    const shuffled = shuffleArray(allQuestions);
    const result = shuffled.slice(0, amount);
    questionCache[cacheKey] = result;

    setTimeout(() => {
      delete questionCache[cacheKey];
    }, CACHE_DURATION);

    return result;
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    const emergency = getFallbackQuestions(9, Math.min(amount, 10));
    return emergency;
  }
};

export const clearCache = () => {
  categoriesCache = null;
  countsCache = {};
  lastFetchTime = 0;
  for (const key in questionCache) {
    delete questionCache[key];
  }
};