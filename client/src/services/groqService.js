import { getCachedQuestions, setCachedQuestions } from "./questionCache";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

let groqRequestCount = 0;
let groqResetTime = Date.now();

const checkGroqRateLimit = () => {
  const now = Date.now();
  if (now - groqResetTime > 60000) {
    groqRequestCount = 0;
    groqResetTime = now;
  }
  if (groqRequestCount >= 25) {
    return false;
  }
  return true;
};

const incrementGroqCount = () => {
  groqRequestCount++;
};

// ============================================
// DIFFICULTY VALIDATION
// ============================================
const validateAndLabelQuestions = (questions, difficulty, category) => {
  if (!questions || questions.length === 0) return [];

  return questions.map((q, index) => {
    // Add difficulty label
    q.difficulty = difficulty;
    q.category = category || "General Knowledge";

    // Ensure options array exists
    if (!q.options || q.options.length === 0) {
      q.options = [q.correct_answer, ...(q.incorrect_answers || [])];
    }

    // Shuffle options
    q.options = shuffleArray(q.options);

    return q;
  });
};

export const generateQuizQuestions = async (
  category,
  count = 5,
  difficulty = "medium",
) => {
  // Check cache first
  const cached = getCachedQuestions(category, count);
  if (cached) {
    console.log(
      `✅ Cache hit for "${category}" with ${cached.length} questions`,
    );
    return validateAndLabelQuestions(cached, difficulty, category);
  }

  console.log(`🔄 Generating ${difficulty} questions for "${category}"...`);

  let fetchedQuestions = [];

  // Try Groq
  if (checkGroqRateLimit() && GROQ_API_KEY) {
    try {
      const groqQuestions = await generateWithGroq(category, count, difficulty);
      if (groqQuestions && groqQuestions.length > 0) {
        incrementGroqCount();
        fetchedQuestions = groqQuestions;
        console.log(
          `✅ Generated ${fetchedQuestions.length} questions with Groq`,
        );
      }
    } catch (error) {
      console.warn("Groq API failed, falling back...", error.message);
    }
  }

  // Fallback 1: Try Open Trivia DB
  if (fetchedQuestions.length === 0) {
    try {
      const questions = await fetchFromTriviaDB(category, count);
      if (questions && questions.length > 0) {
        fetchedQuestions = questions;
        console.log(
          `✅ Using Trivia DB fallback: ${questions.length} questions`,
        );
      }
    } catch (error) {
      console.warn("Trivia DB failed:", error.message);
    }
  }

  // Fallback 2: Use local fallback questions with difficulty
  if (fetchedQuestions.length === 0) {
    console.log("📚 Using local fallback questions");
    fetchedQuestions = getFallbackQuestions(category, count, difficulty);
  }

  // Validate and label the questions
  const validatedQuestions = validateAndLabelQuestions(
    fetchedQuestions,
    difficulty,
    category,
  );

  // Cache the validated questions
  if (validatedQuestions.length > 0) {
    setCachedQuestions(category, count, validatedQuestions);
  }

  return validatedQuestions;
};

// ============================================
// GROQ GENERATOR
// ============================================
const generateWithGroq = async (category, count = 5, difficulty = "medium") => {
  const difficultyPrompts = {
    easy: `Generate ${count} EASY multiple-choice quiz questions about "${category}". 
      Questions should be basic, common knowledge that most people would know.
      Make the incorrect answers obviously wrong to most people.
      Return ONLY valid JSON in this exact format:
      {
        "questions": [
          {
            "question": "What is the capital of France?",
            "options": ["London", "Paris", "Berlin", "Madrid"],
            "correct_answer": "Paris",
            "explanation": "Paris is the capital of France."
          }
        ]
      }`,

    medium: `Generate ${count} MEDIUM difficulty multiple-choice quiz questions about "${category}". 
      Questions should require some thinking but not expert knowledge.
      Make the incorrect answers plausible but clearly wrong to those who know the topic.
      Return ONLY valid JSON in this exact format:
      {
        "questions": [
          {
            "question": "What is the capital of France?",
            "options": ["London", "Paris", "Berlin", "Madrid"],
            "correct_answer": "Paris",
            "explanation": "Paris is the capital of France."
          }
        ]
      }`,

    hard: `Generate ${count} HARD multiple-choice quiz questions about "${category}". 
      Questions should be challenging, require specific knowledge, and make people think.
      Make the incorrect answers very plausible and tricky to differentiate.
      Return ONLY valid JSON in this exact format:
      {
        "questions": [
          {
            "question": "What is the capital of France?",
            "options": ["London", "Paris", "Berlin", "Madrid"],
            "correct_answer": "Paris",
            "explanation": "Paris is the capital of France."
          }
        ]
      }`,
  };

  const prompt = difficultyPrompts[difficulty] || difficultyPrompts.medium;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a knowledgeable quiz generator. Always return valid JSON only. Do not include any other text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API Error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || "";

  try {
    const parsed = JSON.parse(content);
    return parsed.questions || [];
  } catch (parseError) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.questions || [];
    }
    throw new Error("Failed to parse quiz questions");
  }
};

// ============================================
// OPEN TRIVIA DB FALLBACK
// ============================================
const fetchFromTriviaDB = async (category, count) => {
  const categoryMap = {
    "General Knowledge": 9,
    Science: 17,
    "Science & Nature": 17,
    History: 23,
    Geography: 22,
    Sports: 21,
    Music: 12,
    Art: 25,
    Literature: 10,
    Mathematics: 19,
    Computers: 18,
    Technology: 18,
    Movies: 11,
    Film: 11,
    Television: 14,
    TV: 14,
    "Video Games": 15,
    Gaming: 15,
    Mythology: 20,
    Politics: 24,
    Animals: 27,
    Nature: 27,
    Food: 22,
    World: 22,
  };

  const categoryId = categoryMap[category] || 9;
  const url = `https://opentdb.com/api.php?amount=${Math.min(count, 20)}&category=${categoryId}&type=multiple`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Trivia DB API Error");

  const data = await response.json();
  if (data.response_code !== 0 || !data.results) {
    throw new Error("No questions from Trivia DB");
  }

  return data.results.map((q) => ({
    question: decodeHTML(q.question),
    options: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
    correct_answer: q.correct_answer,
    explanation: `Correct answer: ${q.correct_answer}`,
  }));
};

// ============================================
// LOCAL FALLBACK QUESTIONS WITH DIFFICULTY
// ============================================
const getFallbackQuestions = (category, count, difficulty) => {
  const allFallbackQuestions = {
    "General Knowledge": [
      {
        question: "What is the capital of Nigeria?",
        options: ["Lagos", "Abuja", "Kano", "Ibadan"],
        correct_answer: "Abuja",
        explanation: "Abuja became the capital in 1991.",
        difficulty: "easy",
      },
      {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Pacific", "Indian", "Arctic"],
        correct_answer: "Pacific",
        explanation: "The Pacific is the largest ocean.",
        difficulty: "easy",
      },
      {
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correct_answer: "7",
        explanation: "There are 7 continents.",
        difficulty: "easy",
      },
      {
        question: "Which country has the largest population?",
        options: ["USA", "India", "China", "Indonesia"],
        correct_answer: "India",
        explanation: "India recently surpassed China.",
        difficulty: "medium",
      },
      {
        question: "What is the longest river in the world?",
        options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
        correct_answer: "Nile",
        explanation: "The Nile is approximately 6,650 km long.",
        difficulty: "medium",
      },
      {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct_answer: "1945",
        explanation: "WWII ended in 1945.",
        difficulty: "hard",
      },
      {
        question: "Who developed the theory of general relativity?",
        options: ["Newton", "Einstein", "Hawking", "Galileo"],
        correct_answer: "Einstein",
        explanation: "Einstein published it in 1915.",
        difficulty: "hard",
      },
    ],
    Science: [
      {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "HCl"],
        correct_answer: "H2O",
        explanation: "Water is H2O.",
        difficulty: "easy",
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct_answer: "Mars",
        explanation: "Mars is called the Red Planet.",
        difficulty: "easy",
      },
      {
        question: "What is the speed of light approximately?",
        options: [
          "300,000 km/s",
          "150,000 km/s",
          "500,000 km/s",
          "100,000 km/s",
        ],
        correct_answer: "300,000 km/s",
        explanation: "Light travels at ~300,000 km/s.",
        difficulty: "medium",
      },
      {
        question: "What is the chemical formula for photosynthesis?",
        options: [
          "6CO2 + 6H2O → C6H12O6 + 6O2",
          "CO2 + H2O → C6H12O6 + O2",
          "6CO2 + 6H2O → C6H12O6 + 6O2",
          "None of the above",
        ],
        correct_answer: "6CO2 + 6H2O → C6H12O6 + 6O2",
        explanation: "This is the balanced equation for photosynthesis.",
        difficulty: "hard",
      },
    ],
    History: [
      {
        question: "Who was the first president of the United States?",
        options: ["Washington", "Adams", "Jefferson", "Lincoln"],
        correct_answer: "Washington",
        explanation: "George Washington was the first president.",
        difficulty: "easy",
      },
      {
        question: "When did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct_answer: "1945",
        explanation: "WWII ended in 1945.",
        difficulty: "medium",
      },
    ],
  };

  let questions =
    allFallbackQuestions[category] || allFallbackQuestions["General Knowledge"];

  // Filter by difficulty
  const filtered = questions.filter((q) => q.difficulty === difficulty);

  // If not enough questions of that difficulty, include some from other difficulties
  let result = filtered.length >= count ? filtered : questions;

  // Shuffle and return
  return shuffleArray(result).slice(0, Math.min(count, result.length));
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const decodeHTML = (html) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateQuestionsWithGroq = generateQuizQuestions;

export default {
  generateQuizQuestions,
  generateQuestionsWithGroq,
};
