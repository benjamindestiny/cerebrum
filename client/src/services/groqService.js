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
// ✅ DIFFICULTY VALIDATION - STRICT
// ============================================
const validateAndLabelQuestions = (questions, difficulty, category) => {
  if (!questions || questions.length === 0) return [];

  // Filter out questions that are too easy
  const filtered = questions.filter((q) => {
    return validateQuestionDifficulty(q, difficulty);
  });

  return filtered.map((q, index) => {
    q.difficulty = difficulty;
    q.category = category || "General Knowledge";

    if (!q.options || q.options.length === 0) {
      q.options = [q.correct_answer, ...(q.incorrect_answers || [])];
    }

    q.options = shuffleArray(q.options);
    return q;
  });
};

// ✅ NEW: Validate question difficulty
const validateQuestionDifficulty = (question, difficulty) => {
  if (!question) return false;

  const qText = question.question?.toLowerCase() || "";

  // Keywords that make a question too easy (basic trivia)
  const tooEasyKeywords = [
    "capital of",
    "largest",
    "smallest",
    "who is",
    "what is the name of",
    "how many",
    "which planet",
    "who wrote",
    "who painted",
    "who discovered",
    "is the currency of",
    "is known as",
  ];

  // For EASY: Still allow some basic questions but make sure they're not TOO basic
  if (difficulty === "easy") {
    // Reject questions that are extremely basic
    const extremelyBasic = [
      "what is the capital of france",
      "what is the chemical symbol for water",
      "how many continents",
      "who was the first president",
      "what is the largest ocean",
      "what is the currency of",
      "which planet is known as",
    ];

    const isExtremelyBasic = extremelyBasic.some((keyword) =>
      qText.includes(keyword)
    );

    if (isExtremelyBasic) {
      console.log("❌ Rejected too-easy question:", qText.substring(0, 50));
      return false;
    }

    // Also check if question is too short (usually means too simple)
    const wordCount = qText.split(" ").length;
    if (wordCount < 8) {
      return false;
    }

    // Check if the correct answer is too obvious (the question contains the answer)
    const answer = question.correct_answer?.toLowerCase() || "";
    const answerWords = answer.split(" ");
    const obviousAnswer = answerWords.some((word) => 
      word.length > 3 && qText.includes(word)
    );
    if (obviousAnswer) {
      return false;
    }
  }

  // For MEDIUM: Reject questions that are too basic
  if (difficulty === "medium") {
    const wordCount = qText.split(" ").length;
    if (wordCount < 10) {
      return false;
    }

    // Check if question contains any easy keywords
    const containsEasyKeyword = tooEasyKeywords.some((keyword) =>
      qText.includes(keyword)
    );
    if (containsEasyKeyword) {
      return false;
    }
  }

  // For HARD: Must be complex
  if (difficulty === "hard") {
    const wordCount = qText.split(" ").length;
    if (wordCount < 14) {
      return false;
    }

    // Must contain specific, detailed language
    const hardIndicators = [
      "specific",
      "complex",
      "theory",
      "relationship",
      "difference between",
      "compared to",
      "how does",
      "which of the following best describes",
    ];
    const hasComplexity = hardIndicators.some((indicator) =>
      qText.includes(indicator)
    );

    // If not complex enough and not in the hard keyword list, reject
    if (!hasComplexity && !qText.includes("which of the following")) {
      return false;
    }
  }

  return true;
};

export const generateQuizQuestions = async (
  category,
  count = 5,
  difficulty = "medium",
) => {
  const cached = getCachedQuestions(category, count);
  if (cached) {
    console.log(
      `✅ Cache hit for "${category}" with ${cached.length} questions`,
    );
    return validateAndLabelQuestions(cached, difficulty, category);
  }

  console.log(`🔄 Generating ${difficulty} questions for "${category}"...`);

  let fetchedQuestions = [];

  // Try Groq with stricter prompts
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

  // Fallback 1: Open Trivia DB with difficulty
  if (fetchedQuestions.length === 0) {
    try {
      const questions = await fetchFromTriviaDB(category, count, difficulty);
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

  // Fallback 2: Local fallback with strict difficulty
  if (fetchedQuestions.length === 0) {
    console.log("📚 Using local fallback questions");
    fetchedQuestions = getFallbackQuestions(category, count, difficulty);
  }

  // Validate and label
  const validatedQuestions = validateAndLabelQuestions(
    fetchedQuestions,
    difficulty,
    category,
  );

  // If we don't have enough valid questions, try with more lenient validation
  if (validatedQuestions.length < Math.min(count, 3)) {
    console.log("⚠️ Not enough valid questions, using lenient fallback");
    const lenientQuestions = getFallbackQuestions(category, count, difficulty);
    const lenientValidated = validateAndLabelQuestions(
      lenientQuestions,
      difficulty,
      category,
    );
    if (lenientValidated.length > validatedQuestions.length) {
      return lenientValidated;
    }
  }

  if (validatedQuestions.length > 0) {
    setCachedQuestions(category, count, validatedQuestions);
  }

  return validatedQuestions;
};

// ============================================
// GROQ GENERATOR - UPDATED WITH STRICTER PROMPTS
// ============================================
const generateWithGroq = async (category, count = 5, difficulty = "medium") => {
  const difficultyPrompts = {
    easy: `Generate ${count} EASY multiple-choice quiz questions about "${category}".
      
      IMPORTANT RULES:
      - Questions should be TRICKY, NOT obvious trivia
      - 60-70% of people should get these right, NOT 90-100%
      - Avoid these topics: capitals, currencies, basic chemistry, planets, simple history dates
      - Make sure the wrong answers are PLAUSIBLE, not obviously wrong
      - Each question should have 4 options with ONLY ONE correct answer
      - Questions should require some thinking, not just remembering a fact
      
      Return ONLY valid JSON:
      {
        "questions": [
          {
            "question": "Which of these was NOT a major factor in the fall of the Roman Empire?",
            "options": ["Economic decline", "Barbarian invasions", "Nuclear war", "Political corruption"],
            "correct_answer": "Nuclear war",
            "explanation": "Nuclear war didn't exist in ancient times."
          }
        ]
      }`,

    medium: `Generate ${count} MEDIUM difficulty multiple-choice quiz questions about "${category}".
      
      IMPORTANT RULES:
      - Questions should require specific knowledge, not general trivia
      - 40-60% of people should get these right
      - Topics should be moderately specific, not basic facts
      - Wrong answers should be VERY plausible
      - Questions should have 4 options with ONLY ONE correct answer
      - Include at least one "tricky" detail that makes it not obvious
      
      Return ONLY valid JSON:
      {
        "questions": [
          {
            "question": "Which of the following best describes the main function of the Golgi apparatus?",
            "options": ["Protein synthesis", "Energy production", "Protein modification and packaging", "DNA replication"],
            "correct_answer": "Protein modification and packaging",
            "explanation": "The Golgi apparatus modifies and packages proteins."
          }
        ]
      }`,

    hard: `Generate ${count} HARD multiple-choice quiz questions about "${category}".
      
      IMPORTANT RULES:
      - Questions should be CHALLENGING, require expert knowledge
      - 10-30% of people should get these right
      - Topics should be very specific, niche knowledge
      - Wrong answers should be very tricky and easily confused with correct answer
      - Questions should have 4 options with ONLY ONE correct answer
      - Include specific details that differentiate the correct answer
      
      Return ONLY valid JSON:
      {
        "questions": [
          {
            "question": "In quantum mechanics, which of the following is NOT a valid interpretation of wavefunction collapse?",
            "options": ["Copenhagen interpretation", "Many-worlds interpretation", "Objective collapse theory", "Classical determinism"],
            "correct_answer": "Classical determinism",
            "explanation": "Classical determinism is not a quantum interpretation."
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
            "You are a quiz question generator. Create challenging, high-quality multiple-choice questions. Always return valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
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
// OPEN TRIVIA DB FALLBACK - WITH DIFFICULTY FILTER
// ============================================
const fetchFromTriviaDB = async (category, count, difficulty) => {
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
  
  // ✅ FIX: Pass difficulty to API
  const difficultyParam = difficulty === "easy" ? "easy" : 
                         difficulty === "hard" ? "hard" : "medium";
  
  const url = `https://opentdb.com/api.php?amount=${Math.min(count, 20)}&category=${categoryId}&difficulty=${difficultyParam}&type=multiple`;

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
// LOCAL FALLBACK - RESTRUCTURED WITH BETTER DIFFICULTY
// ============================================
const getFallbackQuestions = (category, count, difficulty) => {
  const allFallbackQuestions = {
    "General Knowledge": [
      // EASY - but not TOO easy
      {
        question: "Which of these countries was NOT part of the Soviet Union?",
        options: ["Russia", "Ukraine", "Poland", "Kazakhstan"],
        correct_answer: "Poland",
        explanation: "Poland was not part of the Soviet Union.",
        difficulty: "easy",
      },
      {
        question: "Which of these inventions came FIRST?",
        options: ["Telephone", "Radio", "Telegraph", "Television"],
        correct_answer: "Telegraph",
        explanation: "The telegraph was invented in the 1830s.",
        difficulty: "easy",
      },
      {
        question: "Which of these is NOT a type of cloud?",
        options: ["Cumulus", "Stratus", "Cirrus", "Plasma"],
        correct_answer: "Plasma",
        explanation: "Plasma is a state of matter, not a cloud type.",
        difficulty: "easy",
      },
      // MEDIUM
      {
        question: "Which of these elements is a noble gas?",
        options: ["Oxygen", "Nitrogen", "Neon", "Chlorine"],
        correct_answer: "Neon",
        explanation: "Neon is a noble gas.",
        difficulty: "medium",
      },
      {
        question: "Who wrote the novel 'One Hundred Years of Solitude'?",
        options: ["Pablo Neruda", "Gabriel García Márquez", "Jorge Luis Borges", "Mario Vargas Llosa"],
        correct_answer: "Gabriel García Márquez",
        explanation: "He won the Nobel Prize in 1982.",
        difficulty: "medium",
      },
      {
        question: "Which of these is NOT a fundamental force in physics?",
        options: ["Gravity", "Electromagnetism", "Nuclear force", "Centrifugal force"],
        correct_answer: "Centrifugal force",
        explanation: "Centrifugal force is a pseudo-force.",
        difficulty: "medium",
      },
      // HARD
      {
        question: "In which year did the Cuban Missile Crisis occur?",
        options: ["1960", "1962", "1964", "1966"],
        correct_answer: "1962",
        explanation: "The Cuban Missile Crisis was in October 1962.",
        difficulty: "hard",
      },
      {
        question: "Which of these countries has the oldest continuous monarchy?",
        options: ["England", "Japan", "Denmark", "Sweden"],
        correct_answer: "Japan",
        explanation: "Japan's monarchy dates back to 660 BCE.",
        difficulty: "hard",
      },
      {
        question: "What is the name of the largest known bacterium?",
        options: ["E. coli", "Thiomargarita magnifica", "Staphylococcus", "Mycobacterium"],
        correct_answer: "Thiomargarita magnifica",
        explanation: "It can be up to 2cm long.",
        difficulty: "hard",
      },
    ],
    Science: [
      {
        question: "Which of these is NOT a type of rock?",
        options: ["Igneous", "Sedimentary", "Metamorphic", "Atmospheric"],
        correct_answer: "Atmospheric",
        explanation: "Atmospheric is not a type of rock.",
        difficulty: "easy",
      },
      {
        question: "Which of these blood types is considered the universal donor?",
        options: ["A", "B", "AB", "O"],
        correct_answer: "O",
        explanation: "O negative is the universal donor.",
        difficulty: "medium",
      },
      {
        question: "In which part of the cell does photosynthesis take place in plants?",
        options: ["Nucleus", "Chloroplast", "Mitochondria", "Ribosome"],
        correct_answer: "Chloroplast",
        explanation: "Chloroplasts contain chlorophyll.",
        difficulty: "medium",
      },
      {
        question: "Which of these is NOT a type of RNA?",
        options: ["mRNA", "tRNA", "rRNA", "pRNA"],
        correct_answer: "pRNA",
        explanation: "pRNA is not a standard RNA type.",
        difficulty: "hard",
      },
    ],
    History: [
      {
        question: "Who was the first human to orbit Earth?",
        options: ["Neil Armstrong", "Yuri Gagarin", "John Glenn", "Alan Shepard"],
        correct_answer: "Yuri Gagarin",
        explanation: "He orbited Earth in 1961.",
        difficulty: "medium",
      },
      {
        question: "In which century did the Black Death occur in Europe?",
        options: ["12th", "13th", "14th", "15th"],
        correct_answer: "14th",
        explanation: "The Black Death peaked between 1347 and 1351.",
        difficulty: "hard",
      },
    ],
    Geography: [
      {
        question: "Which of these is NOT a country in the British Isles?",
        options: ["England", "Scotland", "Wales", "France"],
        correct_answer: "France",
        explanation: "France is not part of the British Isles.",
        difficulty: "easy",
      },
      {
        question: "Which mountain range separates Europe from Asia?",
        options: ["Alps", "Andes", "Ural", "Rocky"],
        correct_answer: "Ural",
        explanation: "The Ural Mountains form the boundary.",
        difficulty: "medium",
      },
    ],
  };

  let questions = allFallbackQuestions[category] || allFallbackQuestions["General Knowledge"];
  
  // Filter by difficulty
  const filtered = questions.filter((q) => q.difficulty === difficulty);
  
  // If not enough, include some from other difficulties
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