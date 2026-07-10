import { getCachedQuestions, setCachedQuestions } from './questionCache';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Track Groq usage to avoid rate limits
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

export const generateQuizQuestions = async (
  category,
  count = 5,
  difficulty = "medium",
) => {
  // Check cache first
  const cached = getCachedQuestions(category, count);
  if (cached) {
    console.log(`✅ Cache hit for "${category}" with ${cached.length} questions`);
    return cached;
  }

  console.log(`🔄 Generating questions for "${category}"...`);

  // Check if we're under Groq rate limit
  if (checkGroqRateLimit() && GROQ_API_KEY) {
    try {
      const questions = await generateWithGroq(category, count, difficulty);
      if (questions && questions.length > 0) {
        incrementGroqCount();
        setCachedQuestions(category, count, questions);
        console.log(`✅ Generated ${questions.length} questions with Groq`);
        return questions;
      }
    } catch (error) {
      console.warn("Groq API failed, falling back...", error.message);
    }
  } else {
    console.log("⏳ Groq rate limit reached or no API key, using fallback...");
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
    "Food": 22,
    "World": 22,
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
// LOCAL FALLBACK QUESTIONS
// ============================================
const getFallbackQuestions = (category, count) => {
  const fallbackQuestions = {
    "General Knowledge": [
      { question: "What is the capital of Nigeria?", options: ["Lagos", "Abuja", "Kano", "Ibadan"], correct_answer: "Abuja", explanation: "Abuja became the capital in 1991." },
      { question: "What is the largest ocean?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct_answer: "Pacific", explanation: "The Pacific is the largest ocean." },
      { question: "How many continents are there?", options: ["5", "6", "7", "8"], correct_answer: "7", explanation: "There are 7 continents." },
    ],
    "Science": [
      { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "NaCl", "HCl"], correct_answer: "H2O", explanation: "Water is H2O." },
      { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct_answer: "Mars", explanation: "Mars is called the Red Planet." },
    ],
    "History": [
      { question: "When did World War II end?", options: ["1944", "1945", "1946", "1947"], correct_answer: "1945", explanation: "WWII ended in 1945." },
    ],
  };

  const questions = fallbackQuestions[category] || fallbackQuestions["General Knowledge"];
  return questions.slice(0, Math.min(count, questions.length));
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
