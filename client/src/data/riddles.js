// Complete Riddle Collection
export const riddles = [
  {
    id: 1,
    question: "What has keys but can't open locks?",
    answer: "keyboard",
    hint: "Think about what you type on",
    difficulty: "easy",
    category: "wordplay",
    points: 10,
    explanation: "A keyboard has keys (like letter keys) but they don't open locks."
  },
  {
    id: 2,
    question: "I speak without a mouth and hear without ears. What am I?",
    answer: "echo",
    hint: "It comes from your device or in caves",
    difficulty: "easy",
    category: "nature",
    points: 10,
    explanation: "An echo is a sound that bounces back and can be heard, but it doesn't have a mouth or ears."
  },
  {
    id: 3,
    question: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    hint: "Think about walking",
    difficulty: "medium",
    category: "logic",
    points: 15,
    explanation: "Each step you take leaves a footprint behind. The more steps you take, the more footprints you leave."
  },
  {
    id: 4,
    question: "What has a head, a tail, but no body?",
    answer: "coin",
    hint: "Think about money",
    difficulty: "easy",
    category: "objects",
    points: 10,
    explanation: "A coin has a 'heads' side and a 'tails' side, but no physical body."
  },
  {
    id: 5,
    question: "What can travel around the world while staying in a corner?",
    answer: "stamp",
    hint: "Think about mail",
    difficulty: "medium",
    category: "objects",
    points: 15,
    explanation: "A stamp can be placed on a letter that travels around the world, while the stamp itself stays in the corner of the envelope."
  },
  {
    id: 6,
    question: "What gets wetter as it dries?",
    answer: "towel",
    hint: "Think about what you use after a shower",
    difficulty: "easy",
    category: "objects",
    points: 10,
    explanation: "A towel gets wetter as it dries you off, because it absorbs the water from your body."
  },
  {
    id: 7,
    question: "What has cities, but no houses; forests, but no trees; and water, but no fish?",
    answer: "map",
    hint: "Think about what you use to find places",
    difficulty: "medium",
    category: "objects",
    points: 15,
    explanation: "A map shows cities, forests, and water bodies, but they are only representations, not real."
  },
  {
    id: 8,
    question: "What can you break, even if you never pick it up or touch it?",
    answer: "promise",
    hint: "Think about commitments",
    difficulty: "hard",
    category: "abstract",
    points: 20,
    explanation: "A promise is a commitment that can be broken without physically touching it."
  },
  {
    id: 9,
    question: "What has hands but can't clap?",
    answer: "clock",
    hint: "Think about what tells time",
    difficulty: "easy",
    category: "objects",
    points: 10,
    explanation: "A clock has hands (hour and minute hands) but they can't clap."
  },
  {
    id: 10,
    question: "What has a neck but no head?",
    answer: "bottle",
    hint: "Think about what you drink from",
    difficulty: "easy",
    category: "objects",
    points: 10,
    explanation: "A bottle has a neck (the narrow part at the top) but no head."
  },
  {
    id: 11,
    question: "I have branches, but no fruit, trunk, or leaves. What am I?",
    answer: "bank",
    hint: "Think about money",
    difficulty: "hard",
    category: "abstract",
    points: 20,
    explanation: "A bank has branches (different locations) but no fruit, trunk, or leaves like a tree."
  },
  {
    id: 12,
    question: "What is full of holes but still holds water?",
    answer: "sponge",
    hint: "Think about what you use to clean",
    difficulty: "medium",
    category: "objects",
    points: 15,
    explanation: "A sponge has many holes but can still absorb and hold water."
  },
  {
    id: 13,
    question: "What runs but never walks, has a mouth but never talks?",
    answer: "river",
    hint: "Think about nature",
    difficulty: "medium",
    category: "nature",
    points: 15,
    explanation: "A river runs (flows) and has a mouth (where it meets the sea), but it doesn't walk or talk."
  },
  {
    id: 14,
    question: "What is so fragile that saying its name breaks it?",
    answer: "silence",
    hint: "Think about what happens when you speak",
    difficulty: "hard",
    category: "abstract",
    points: 20,
    explanation: "Silence is broken when you say something. Simply saying 'silence' breaks the silence."
  },
  {
    id: 15,
    question: "I have keys but no locks. I have space but no room. You can enter but can't go outside. What am I?",
    answer: "keyboard",
    hint: "Think about what you use to type",
    difficulty: "medium",
    category: "objects",
    points: 15,
    explanation: "A keyboard has keys, space bar, and you can 'enter' (Enter key) but can't go outside."
  },
  {
    id: 16,
    question: "What can you hold in your left hand but not in your right hand?",
    answer: "right hand",
    hint: "Think about body parts",
    difficulty: "hard",
    category: "logic",
    points: 20,
    explanation: "You can hold your right hand with your left hand, but you can't hold your right hand with your right hand."
  },
  {
    id: 17,
    question: "What goes up but never comes down?",
    answer: "age",
    hint: "Think about time",
    difficulty: "easy",
    category: "abstract",
    points: 10,
    explanation: "Age always increases (goes up) but never decreases (comes down)."
  },
  {
    id: 18,
    question: "What has a bottom at the top?",
    answer: "leg",
    hint: "Think about body parts",
    difficulty: "medium",
    category: "logic",
    points: 15,
    explanation: "Your leg has a bottom (your foot) at the top of your leg? Actually, the riddle plays on words - the bottom of a person is at the top of their legs."
  },
  {
    id: 19,
    question: "What has four wheels and flies?",
    answer: "garbage truck",
    hint: "Think about vehicles and insects",
    difficulty: "hard",
    category: "wordplay",
    points: 20,
    explanation: "A garbage truck has four wheels and flies (attracts flies)."
  },
  {
    id: 20,
    question: "What starts with an E, ends with an E, but only has one letter?",
    answer: "envelope",
    hint: "Think about mail",
    difficulty: "medium",
    category: "wordplay",
    points: 15,
    explanation: "An envelope starts with 'E', ends with 'E', and contains a letter (one letter)."
  }
];

export const getRiddleById = (id) => {
  return riddles.find(r => r.id === id);
};

export const getRiddlesByDifficulty = (difficulty) => {
  return riddles.filter(r => r.difficulty === difficulty);
};

export const getRandomRiddle = () => {
  return riddles[Math.floor(Math.random() * riddles.length)];
};

export const getDailyRiddle = () => {
  // In production, this would be based on the date
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % riddles.length;
  return riddles[index];
};

export default riddles;
