import { getCachedQuestions, setCachedQuestions } from './questionCache';

const GROQ_API_KEY =
  import.meta.env.VITE_GROQ_API_KEY ||
  "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Track Groq usage to avoid rate limits
let groqRequestCount = 0;
let groqResetTime = Date.now();

const checkGroqRateLimit = () => {
  const now = Date.now();
  if (now - groqResetTime > 60000) {
    // Reset every minute
    groqRequestCount = 0;
    groqResetTime = now;
  }

  if (groqRequestCount >= 25) {
    // Leave buffer of 5 requests
    return false;
  }
  return true;
};

const incrementGroqCount = () => {
  groqRequestCount++;
};

export const generateQuizQuestions = async (
  category,
  count = 5,
  difficulty = "medium",
) => {
  // ✅ Check cache first
  const cached = getCachedQuestions(category, count);
  if (cached) {
    console.log(`✅ Cache hit for "${category}" with ${cached.length} questions`);
    return cached;
  }

  console.log(`🔄 Generating questions for "${category}"...`);

  // Check if we're under Groq rate limit
  if (checkGroqRateLimit()) {
    try {
      const questions = await generateWithGroq(category, count, difficulty);
      if (questions && questions.length > 0) {
        incrementGroqCount();
        // ✅ Cache the questions
        setCachedQuestions(category, count, questions);
        console.log(`✅ Generated ${questions.length} questions with Groq`);
        return questions;
      }
    } catch (error) {
      console.warn("Groq API failed, falling back...", error.message);
    }
  } else {
    console.log("⏳ Groq rate limit reached, using fallback...");
  }

  // Fallback 1: Try Open Trivia DB
  try {
    const questions = await fetchFromTriviaDB(category, count);
    if (questions && questions.length > 0) {
      console.log(`✅ Using Trivia DB fallback: ${questions.length} questions`);
      setCachedQuestions(category, count, questions);
      return questions;
    }
  } catch (error) {
    console.warn("Trivia DB failed:", error.message);
  }

  // Fallback 2: Use local fallback questions
  console.log("📚 Using local fallback questions");
  const questions = getFallbackQuestions(category, count);
  setCachedQuestions(category, count, questions);
  return questions;
};

// ============================================
// GROQ GENERATOR
// ============================================
const generateWithGroq = async (category, count = 5, difficulty = "medium") => {
  const prompt = `Generate ${count} multiple-choice quiz questions about "${category}" with ${difficulty} difficulty.
  
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
  }`;

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
            "You are a knowledgeable quiz generator. Always return valid JSON only.",
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
  // Updated category map with more categories
  const categoryMap = {
    "General Knowledge": 9,
    "Science": 17,
    "Science & Nature": 17,
    "History": 23,
    "Geography": 22,
    "Sports": 21,
    "Music": 12,
    "Art": 25,
    "Literature": 10,
    "Mathematics": 19,
    "Computers": 18,
    "Technology": 18,
    "Movies": 11,
    "Film": 11,
    "Television": 14,
    "TV": 14,
    "Video Games": 15,
    "Gaming": 15,
    "Mythology": 20,
    "Politics": 24,
    "Animals": 27,
    "Nature": 27,
    "Food": 22, // Geography category has some food questions
    "Geography": 22,
    "World": 22,
  };

  const categoryId = categoryMap[category] || 9; // Default to General Knowledge
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
// LOCAL FALLBACK QUESTIONS (Expanded)
// ============================================
const getFallbackQuestions = (category, count) => {
  const fallbackQuestions = {
    "General Knowledge": [
      {
        question: "What is the capital of Nigeria?",
        options: ["Lagos", "Abuja", "Kano", "Ibadan"],
        correct_answer: "Abuja",
        explanation: "Abuja became the capital of Nigeria in 1991.",
      },
      {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Pacific", "Indian", "Arctic"],
        correct_answer: "Pacific",
        explanation: "The Pacific Ocean is the largest, covering over 60 million square miles.",
      },
      {
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correct_answer: "7",
        explanation: "There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Australia, and South America.",
      },
      {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        correct_answer: "Vatican City",
        explanation: "Vatican City is the smallest country, covering only 0.44 square kilometers.",
      },
      {
        question: "What is the longest river in the world?",
        options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
        correct_answer: "Nile",
        explanation: "The Nile River is the longest, stretching about 6,650 kilometers.",
      },
    ],
    "Science": [
      {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "HCl"],
        correct_answer: "H2O",
        explanation: "Water is composed of two hydrogen atoms and one oxygen atom (H2O).",
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct_answer: "Mars",
        explanation: "Mars is called the Red Planet because of its reddish appearance due to iron oxide on its surface.",
      },
      {
        question: "What is the hardest natural substance?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correct_answer: "Diamond",
        explanation: "Diamond is the hardest known natural material on Earth.",
      },
      {
        question: "What is the speed of light?",
        options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
        correct_answer: "299,792 km/s",
        explanation: "Light travels at approximately 299,792 kilometers per second in a vacuum.",
      },
    ],
    "History": [
      {
        question: "When did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct_answer: "1945",
        explanation: "World War II ended in 1945 with the surrender of Germany and Japan.",
      },
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "John Adams", "George Washington", "Abraham Lincoln"],
        correct_answer: "George Washington",
        explanation: "George Washington served as the first President of the United States from 1789 to 1797.",
      },
    ],
    "Geography": [
      {
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correct_answer: "Paris",
        explanation: "Paris is the capital and most populous city of France.",
      },
      {
        question: "Which country has the most natural lakes?",
        options: ["USA", "Canada", "Brazil", "Russia"],
        correct_answer: "Canada",
        explanation: "Canada has more lakes than the rest of the world combined.",
      },
    ],
    "Sports": [
      {
        question: "Which country has won the most FIFA World Cups?",
        options: ["Brazil", "Germany", "Italy", "Argentina"],
        correct_answer: "Brazil",
        explanation: "Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002).",
      },
      {
        question: "What sport is known as the 'king of sports'?",
        options: ["Basketball", "Football", "Tennis", "Cricket"],
        correct_answer: "Football",
        explanation: "Football (soccer) is often referred to as the 'king of sports' due to its global popularity.",
      },
    ],
  };

  // Try to get category-specific questions, fallback to General Knowledge
  let questions = fallbackQuestions[category] || fallbackQuestions["General Knowledge"];
  
  // If we have more questions than needed, slice
  if (questions.length > count) {
    // Shuffle to get random questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  return questions;
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