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
  // General Knowledge (9)
  9: [
    {
      question: "What is the capital of France?",
      correct_answer: "Paris",
      incorrect_answers: ["London", "Berlin", "Madrid"],
      category: "General Knowledge",
    },
    {
      question: "Which planet is known as the Red Planet?",
      correct_answer: "Mars",
      incorrect_answers: ["Venus", "Jupiter", "Saturn"],
      category: "General Knowledge",
    },
    {
      question: "What is the largest ocean on Earth?",
      correct_answer: "Pacific Ocean",
      incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
      category: "General Knowledge",
    },
    {
      question: "What is the chemical symbol for water?",
      correct_answer: "H2O",
      incorrect_answers: ["CO2", "NaCl", "HCl"],
      category: "General Knowledge",
    },
    {
      question: "Who painted the Mona Lisa?",
      correct_answer: "Leonardo da Vinci",
      incorrect_answers: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet"],
      category: "General Knowledge",
    },
    {
      question: "What is the tallest mountain in the world?",
      correct_answer: "Mount Everest",
      incorrect_answers: ["K2", "Kilimanjaro", "Denali"],
      category: "General Knowledge",
    },
    {
      question: "Which country has the most people?",
      correct_answer: "India",
      incorrect_answers: ["China", "United States", "Indonesia"],
      category: "General Knowledge",
    },
    {
      question: "What is the smallest country in the world?",
      correct_answer: "Vatican City",
      incorrect_answers: ["Monaco", "San Marino", "Liechtenstein"],
      category: "General Knowledge",
    },
    {
      question: "Which language has the most native speakers?",
      correct_answer: "Mandarin Chinese",
      incorrect_answers: ["English", "Spanish", "Hindi"],
      category: "General Knowledge",
    },
    {
      question: "What is the currency of Japan?",
      correct_answer: "Yen",
      incorrect_answers: ["Won", "Rupee", "Yuan"],
      category: "General Knowledge",
    },
  ],
  // Books (10)
  10: [
    {
      question: "Who wrote '1984'?",
      correct_answer: "George Orwell",
      incorrect_answers: ["Aldous Huxley", "Ray Bradbury", "H.G. Wells"],
      category: "Books",
    },
    {
      question: "Who wrote 'Pride and Prejudice'?",
      correct_answer: "Jane Austen",
      incorrect_answers: [
        "Charlotte Brontë",
        "Emily Brontë",
        "Charles Dickens",
      ],
      category: "Books",
    },
    {
      question: "Which novel begins with 'Call me Ishmael'?",
      correct_answer: "Moby-Dick",
      incorrect_answers: [
        "The Great Gatsby",
        "The Old Man and the Sea",
        "The Catcher in the Rye",
      ],
      category: "Books",
    },
    {
      question: "Who wrote 'The Hobbit'?",
      correct_answer: "J.R.R. Tolkien",
      incorrect_answers: [
        "C.S. Lewis",
        "George R.R. Martin",
        "Terry Pratchett",
      ],
      category: "Books",
    },
    {
      question: "Which author created Sherlock Holmes?",
      correct_answer: "Arthur Conan Doyle",
      incorrect_answers: [
        "Agatha Christie",
        "Edgar Allan Poe",
        "Sir Walter Scott",
      ],
      category: "Books",
    },
    {
      question: "What is the first book of the Bible?",
      correct_answer: "Genesis",
      incorrect_answers: ["Exodus", "Leviticus", "Numbers"],
      category: "Books",
    },
    {
      question: "Which Shakespeare play features the character Hamlet?",
      correct_answer: "Hamlet",
      incorrect_answers: ["Macbeth", "Othello", "Romeo and Juliet"],
      category: "Books",
    },
    {
      question: "Who wrote 'To Kill a Mockingbird'?",
      correct_answer: "Harper Lee",
      incorrect_answers: [
        "John Steinbeck",
        "F. Scott Fitzgerald",
        "Ernest Hemingway",
      ],
      category: "Books",
    },
  ],
  // Film (11)
  11: [
    {
      question: "Who directed 'The Godfather'?",
      correct_answer: "Francis Ford Coppola",
      incorrect_answers: [
        "Martin Scorsese",
        "Steven Spielberg",
        "Quentin Tarantino",
      ],
      category: "Film",
    },
    {
      question: "What year was the first Star Wars movie released?",
      correct_answer: "1977",
      incorrect_answers: ["1980", "1975", "1985"],
      category: "Film",
    },
    {
      question: "Who played Jack in 'Titanic'?",
      correct_answer: "Leonardo DiCaprio",
      incorrect_answers: ["Brad Pitt", "Tom Cruise", "Johnny Depp"],
      category: "Film",
    },
    {
      question: "Which movie features the quote 'May the Force be with you'?",
      correct_answer: "Star Wars",
      incorrect_answers: ["The Matrix", "Alien", "Blade Runner"],
      category: "Film",
    },
    {
      question: "Who directed 'Inception'?",
      correct_answer: "Christopher Nolan",
      incorrect_answers: ["Ridley Scott", "James Cameron", "Denis Villeneuve"],
      category: "Film",
    },
    {
      question: "Which film won the 2020 Academy Award for Best Picture?",
      correct_answer: "Parasite",
      incorrect_answers: ["1917", "Joker", "Once Upon a Time in Hollywood"],
      category: "Film",
    },
    {
      question: "Who played Wolverine in the X-Men films?",
      correct_answer: "Hugh Jackman",
      incorrect_answers: ["Ryan Reynolds", "Patrick Stewart", "Liam Hemsworth"],
      category: "Film",
    },
    {
      question: "Which animated film features a snowman named Olaf?",
      correct_answer: "Frozen",
      incorrect_answers: ["Moana", "Tangled", "Shrek"],
      category: "Film",
    },
  ],
  // Music (12)
  12: [
    {
      question: "Who is known as the 'King of Pop'?",
      correct_answer: "Michael Jackson",
      incorrect_answers: ["Elvis Presley", "Prince", "Freddie Mercury"],
      category: "Music",
    },
    {
      question: "What instrument is used in 'Bohemian Rhapsody'?",
      correct_answer: "Piano",
      incorrect_answers: ["Guitar", "Drums", "Violin"],
      category: "Music",
    },
    {
      question: "Which band sang 'Stairway to Heaven'?",
      correct_answer: "Led Zeppelin",
      incorrect_answers: ["The Beatles", "Pink Floyd", "Queen"],
      category: "Music",
    },
    {
      question: "Who sang 'Imagine'?",
      correct_answer: "John Lennon",
      incorrect_answers: ["Paul McCartney", "Elton John", "George Harrison"],
      category: "Music",
    },
    {
      question: "Which singer is known as the Queen of Pop?",
      correct_answer: "Madonna",
      incorrect_answers: ["Britney Spears", "Lady Gaga", "Taylor Swift"],
      category: "Music",
    },
    {
      question: "What instrument does Yo-Yo Ma play?",
      correct_answer: "Cello",
      incorrect_answers: ["Violin", "Piano", "Flute"],
      category: "Music",
    },
    {
      question: "Which band released the album 'Abbey Road'?",
      correct_answer: "The Beatles",
      incorrect_answers: ["The Rolling Stones", "Pink Floyd", "Queen"],
      category: "Music",
    },
    {
      question: "Which artist released the album 'Like a Prayer'?",
      correct_answer: "Madonna",
      incorrect_answers: ["Beyoncé", "Rihanna", "Taylor Swift"],
      category: "Music",
    },
  ],
  // Science & Nature (17)
  17: [
    {
      question: "What is the speed of light?",
      correct_answer: "299,792,458 m/s",
      incorrect_answers: [
        "300,000,000 m/s",
        "299,000,000 m/s",
        "300,792,458 m/s",
      ],
      category: "Science & Nature",
    },
    {
      question: "What is the powerhouse of the cell?",
      correct_answer: "Mitochondria",
      incorrect_answers: ["Nucleus", "Ribosome", "Golgi apparatus"],
      category: "Science & Nature",
    },
    {
      question: "What is the hardest natural substance?",
      correct_answer: "Diamond",
      incorrect_answers: ["Gold", "Iron", "Platinum"],
      category: "Science & Nature",
    },
    {
      question: "What gas do plants absorb from the atmosphere?",
      correct_answer: "Carbon dioxide",
      incorrect_answers: ["Oxygen", "Nitrogen", "Hydrogen"],
      category: "Science & Nature",
    },
    {
      question: "How many bones are in the adult human body?",
      correct_answer: "206",
      incorrect_answers: ["198", "210", "220"],
      category: "Science & Nature",
    },
    {
      question: "What planet is known as the Morning Star?",
      correct_answer: "Venus",
      incorrect_answers: ["Mercury", "Mars", "Jupiter"],
      category: "Science & Nature",
    },
    {
      question: "What is H2O commonly called?",
      correct_answer: "Water",
      incorrect_answers: ["Salt", "Oxygen", "Sugar"],
      category: "Science & Nature",
    },
    {
      question: "What part of the plant conducts photosynthesis?",
      correct_answer: "Leaves",
      incorrect_answers: ["Roots", "Stem", "Flowers"],
      category: "Science & Nature",
    },
  ],
  // Computers (18)
  18: [
    {
      question: "What does CPU stand for?",
      correct_answer: "Central Processing Unit",
      incorrect_answers: [
        "Computer Personal Unit",
        "Central Process Unit",
        "Computer Processing Unit",
      ],
      category: "Computers",
    },
    {
      question: "What is the most popular programming language?",
      correct_answer: "JavaScript",
      incorrect_answers: ["Python", "Java", "C++"],
      category: "Computers",
    },
    {
      question: "Who is known as the father of computers?",
      correct_answer: "Alan Turing",
      incorrect_answers: ["Charles Babbage", "Bill Gates", "Steve Jobs"],
      category: "Computers",
    },
    {
      question: "What does HTML stand for?",
      correct_answer: "HyperText Markup Language",
      incorrect_answers: [
        "High Transfer Markup Language",
        "Hyperlink Text Management Language",
        "Home Tool Markup Language",
      ],
      category: "Computers",
    },
    {
      question: "Which company created the Windows operating system?",
      correct_answer: "Microsoft",
      incorrect_answers: ["Apple", "Google", "IBM"],
      category: "Computers",
    },
    {
      question: "What is the main function of RAM?",
      correct_answer: "Temporary storage for active data",
      incorrect_answers: [
        "Permanent storage",
        "Processing data",
        "Connecting to the internet",
      ],
      category: "Computers",
    },
    {
      question: "What does URL stand for?",
      correct_answer: "Uniform Resource Locator",
      incorrect_answers: [
        "Universal Remote Link",
        "User Resource Link",
        "Uniform Research Locator",
      ],
      category: "Computers",
    },
    {
      question: "Which keyboard shortcut copies selected text?",
      correct_answer: "Ctrl+C",
      incorrect_answers: ["Ctrl+V", "Ctrl+X", "Ctrl+P"],
      category: "Computers",
    },
  ],
  // Sports (21)
  21: [
    {
      question: "Which country has won the most FIFA World Cups?",
      correct_answer: "Brazil",
      incorrect_answers: ["Germany", "Italy", "Argentina"],
      category: "Sports",
    },
    {
      question: "How many players are on a basketball team?",
      correct_answer: "5",
      incorrect_answers: ["6", "4", "7"],
      category: "Sports",
    },
    {
      question: "What is the fastest recorded tennis serve speed?",
      correct_answer: "163.7 mph",
      incorrect_answers: ["150 mph", "170 mph", "155 mph"],
      category: "Sports",
    },
    {
      question: "In soccer, how many points is a goal worth?",
      correct_answer: "1",
      incorrect_answers: ["2", "3", "0"],
      category: "Sports",
    },
    {
      question: "How many minutes is a standard soccer match?",
      correct_answer: "90 minutes",
      incorrect_answers: ["80 minutes", "100 minutes", "120 minutes"],
      category: "Sports",
    },
    {
      question: "Which sport uses a shuttlecock?",
      correct_answer: "Badminton",
      incorrect_answers: ["Tennis", "Squash", "Table Tennis"],
      category: "Sports",
    },
    {
      question: "How many holes are there in a standard round of golf?",
      correct_answer: "18",
      incorrect_answers: ["16", "20", "14"],
      category: "Sports",
    },
    {
      question: "Which country hosted the 2016 Summer Olympics?",
      correct_answer: "Brazil",
      incorrect_answers: ["China", "Japan", "United Kingdom"],
      category: "Sports",
    },
  ],
  // Geography (22)
  22: [
    {
      question: "What is the largest country by area?",
      correct_answer: "Russia",
      incorrect_answers: ["Canada", "China", "USA"],
      category: "Geography",
    },
    {
      question: "What is the longest river in the world?",
      correct_answer: "Amazon River",
      incorrect_answers: ["Nile", "Mississippi", "Yangtze"],
      category: "Geography",
    },
    {
      question: "Which continent has the most countries?",
      correct_answer: "Africa",
      incorrect_answers: ["Asia", "Europe", "South America"],
      category: "Geography",
    },
    {
      question: "What is the capital of Australia?",
      correct_answer: "Canberra",
      incorrect_answers: ["Sydney", "Melbourne", "Perth"],
      category: "Geography",
    },
    {
      question: "Which desert is the largest hot desert in the world?",
      correct_answer: "Sahara",
      incorrect_answers: ["Arabian", "Kalahari", "Gobi"],
      category: "Geography",
    },
    {
      question: "What is the deepest ocean in the world?",
      correct_answer: "Pacific Ocean",
      incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
      category: "Geography",
    },
    {
      question: "Which country is known as the Land of the Rising Sun?",
      correct_answer: "Japan",
      incorrect_answers: ["China", "South Korea", "Thailand"],
      category: "Geography",
    },
    {
      question: "What is the capital of Egypt?",
      correct_answer: "Cairo",
      incorrect_answers: ["Alexandria", "Luxor", "Giza"],
      category: "Geography",
    },
  ],
  // History (23)
  23: [
    {
      question: "When did World War II end?",
      correct_answer: "1945",
      incorrect_answers: ["1944", "1946", "1943"],
      category: "History",
    },
    {
      question: "Who was the first President of the United States?",
      correct_answer: "George Washington",
      incorrect_answers: ["Thomas Jefferson", "Abraham Lincoln", "John Adams"],
      category: "History",
    },
    {
      question: "When was the Declaration of Independence signed?",
      correct_answer: "1776",
      incorrect_answers: ["1775", "1777", "1780"],
      category: "History",
    },
    {
      question: "Who was the first person to step on the moon?",
      correct_answer: "Neil Armstrong",
      incorrect_answers: ["Buzz Aldrin", "Yuri Gagarin", "John Glenn"],
      category: "History",
    },
    {
      question: "Which empire built Machu Picchu?",
      correct_answer: "Inca Empire",
      incorrect_answers: ["Roman Empire", "Maya Empire", "Aztec Empire"],
      category: "History",
    },
    {
      question: "In which year did the Berlin Wall fall?",
      correct_answer: "1989",
      incorrect_answers: ["1987", "1991", "1993"],
      category: "History",
    },
    {
      question:
        "Who was the leader of the Soviet Union during most of World War II?",
      correct_answer: "Joseph Stalin",
      incorrect_answers: [
        "Vladimir Lenin",
        "Nikita Khrushchev",
        "Mikhail Gorbachev",
      ],
      category: "History",
    },
    {
      question: "Which ancient civilization built the pyramids of Giza?",
      correct_answer: "Ancient Egyptians",
      incorrect_answers: ["Greeks", "Romans", "Persians"],
      category: "History",
    },
  ],
  // Video Games (15)
  15: [
    {
      question: "What is the best-selling video game of all time?",
      correct_answer: "Minecraft",
      incorrect_answers: ["Grand Theft Auto V", "Tetris", "PUBG"],
      category: "Video Games",
    },
    {
      question: "Who created Mario?",
      correct_answer: "Shigeru Miyamoto",
      incorrect_answers: ["Hideo Kojima", "Will Wright", "Sid Meier"],
      category: "Video Games",
    },
    {
      question: "What year was the first PlayStation released?",
      correct_answer: "1994",
      incorrect_answers: ["1995", "1996", "1993"],
      category: "Video Games",
    },
    {
      question: "Which game features the character Master Chief?",
      correct_answer: "Halo",
      incorrect_answers: ["Fortnite", "Destiny", "God of War"],
      category: "Video Games",
    },
    {
      question:
        "What is the name of the main character in The Legend of Zelda?",
      correct_answer: "Link",
      incorrect_answers: ["Zelda", "Ganondorf", "Epona"],
      category: "Video Games",
    },
    {
      question: "Which company developed the Pokémon franchise?",
      correct_answer: "Nintendo",
      incorrect_answers: ["Sony", "Microsoft", "Sega"],
      category: "Video Games",
    },
    {
      question: "What is the name of the virtual world in Ready Player One?",
      correct_answer: "OASIS",
      incorrect_answers: ["The Grid", "The Matrix", "The Metaverse"],
      category: "Video Games",
    },
    {
      question:
        "Which game introduced the battle royale mode to a massive audience?",
      correct_answer: "Fortnite",
      incorrect_answers: ["PUBG", "Apex Legends", "Warzone"],
      category: "Video Games",
    },
  ],
  // Default fallback
  default: [
    {
      question: "What is the capital of France?",
      correct_answer: "Paris",
      incorrect_answers: ["London", "Berlin", "Madrid"],
      category: "General Knowledge",
    },
    {
      question: "Which planet is known as the Red Planet?",
      correct_answer: "Mars",
      incorrect_answers: ["Venus", "Jupiter", "Saturn"],
      category: "General Knowledge",
    },
    {
      question: "What is the largest ocean on Earth?",
      correct_answer: "Pacific Ocean",
      incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
      category: "General Knowledge",
    },
    {
      question: "Who painted the Mona Lisa?",
      correct_answer: "Leonardo da Vinci",
      incorrect_answers: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet"],
      category: "General Knowledge",
    },
    {
      question: "What is the currency of Japan?",
      correct_answer: "Yen",
      incorrect_answers: ["Won", "Rupee", "Yuan"],
      category: "General Knowledge",
    },
  ],
};

// Get fallback questions by category
const getFallbackQuestions = (categoryId, count) => {
  // Convert to number if string
  const catId =
    typeof categoryId === "string" ? parseInt(categoryId) : categoryId;

  // Try to get category-specific fallback
  let questions = FALLBACK_QUESTIONS_BY_CATEGORY[catId] || [];

  // If no specific questions, try to find by category name
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
      religion: 9,
      "bible-studies": 9,
      finance: 9,
      health: 9,
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

  // If still no questions, use default
  if (questions.length === 0) {
    questions =
      FALLBACK_QUESTIONS_BY_CATEGORY.default ||
      FALLBACK_QUESTIONS_BY_CATEGORY[9];
  }

  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Always returns questions - never fails
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

    // 3. Try API
    const neededFromApi = Math.max(0, amount - allQuestions.length);
    let apiCategoryId = null;

    // Determine the API category ID
    if (typeof categoryId === "number" && categoryId >= 9 && categoryId <= 32) {
      apiCategoryId = categoryId;
      actualCategoryId = categoryId;
    } else if (typeof categoryId === "string") {
      // Try to parse as number
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
        } else {
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

    // Shuffle and return
    const shuffled = shuffleArray(allQuestions);
    const result = shuffled.slice(0, amount);
    questionCache[cacheKey] = result;

    setTimeout(() => {
      delete questionCache[cacheKey];
    }, CACHE_DURATION);

    return result;
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    // Emergency fallback
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
