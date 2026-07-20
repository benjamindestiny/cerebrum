// ============================================
// MEGA EXPANDED CATEGORIES - 25+ PARENTS, 100+ SUB-CATEGORIES
// ============================================

export const categoryHierarchy = [
  // ============================================
  // 1. 🧠 GENERAL KNOWLEDGE
  // ============================================
  {
    id: 'general',
    name: 'General Knowledge',
    icon: '🧠',
    color: 'text-purple-400',
    description: 'Everything and anything',
    children: [
      { id: 'general-knowledge', name: 'General Knowledge', icon: '🧠', color: 'text-purple-400', description: 'Random general knowledge', source: 'api', apiId: 9 },
      { id: 'trivia', name: 'Trivia', icon: '🎯', color: 'text-[#3B82F6CC]', description: 'Fun facts and trivia', source: 'api', apiId: 9 },
      { id: 'world-facts', name: 'World Facts', icon: '🌍', color: 'text-green-400', description: 'Amazing world facts', source: 'api', apiId: 9 },
      { id: 'human-body', name: 'Human Body', icon: '🧍', color: 'text-red-400', description: 'Anatomy and physiology', source: 'api', apiId: 17 },
    ]
  },

  // ============================================
  // 2. 📚 BOOKS & LITERATURE
  // ============================================
  {
    id: 'literature',
    name: 'Books & Literature',
    icon: '📚',
    color: 'text-amber-600',
    description: 'All about books and writing',
    children: [
      { id: 'books', name: 'Books', icon: '📚', color: 'text-amber-600', description: 'Literature and authors', source: 'api', apiId: 10 },
      { id: 'classic-literature', name: 'Classic Literature', icon: '📖', color: 'text-amber-500', description: 'Classic novels and authors', source: 'api', apiId: 10 },
      { id: 'modern-literature', name: 'Modern Literature', icon: '📕', color: 'text-[#3B82F6CC]', description: 'Contemporary books', source: 'api', apiId: 10 },
      { id: 'poetry', name: 'Poetry', icon: '📝', color: 'text-pink-400', description: 'Poems and poets', source: 'api', apiId: 10 },
      { id: 'authors', name: 'Authors', icon: '✍️', color: 'text-purple-400', description: 'Famous writers', source: 'api', apiId: 10 },
      { id: 'fantasy-books', name: 'Fantasy Books', icon: '🐉', color: 'text-indigo-400', description: 'Fantasy literature', source: 'api', apiId: 10 },
      { id: 'sci-fi-books', name: 'Sci-Fi Books', icon: '🚀', color: 'text-cyan-400', description: 'Science fiction books', source: 'api', apiId: 10 },
    ]
  },

  // ============================================
  // 3. 🎬 FILM & CINEMA
  // ============================================
  {
    id: 'film',
    name: 'Film & Cinema',
    icon: '🎬',
    color: 'text-red-500',
    description: 'Movies, directors, and cinema history',
    children: [
      { id: 'film-movies', name: 'Movies', icon: '🎬', color: 'text-red-500', description: 'All about movies', source: 'api', apiId: 11 },
      { id: 'classic-films', name: 'Classic Films', icon: '🎞️', color: 'text-amber-400', description: 'Golden age cinema', source: 'api', apiId: 11 },
      { id: 'modern-films', name: 'Modern Films', icon: '📽️', color: 'text-[#3B82F6CC]', description: 'Contemporary cinema', source: 'api', apiId: 11 },
      { id: 'directors', name: 'Directors', icon: '🎥', color: 'text-purple-400', description: 'Famous directors', source: 'api', apiId: 11 },
      { id: 'actors', name: 'Actors', icon: '⭐', color: 'text-teal-400', description: 'Famous actors', source: 'api', apiId: 11 },
      { id: 'animated-films', name: 'Animated Films', icon: '🧸', color: 'text-pink-400', description: 'Animation movies', source: 'api', apiId: 11 },
      { id: 'horror-films', name: 'Horror Films', icon: '👻', color: 'text-red-400', description: 'Horror movies', source: 'api', apiId: 11 },
      { id: 'action-films', name: 'Action Films', icon: '💥', color: 'text-orange-400', description: 'Action movies', source: 'api', apiId: 11 },
      { id: 'comedy-films', name: 'Comedy Films', icon: '😂', color: 'text-green-400', description: 'Comedy movies', source: 'api', apiId: 11 },
      { id: 'drama-films', name: 'Drama Films', icon: '🎭', color: 'text-purple-400', description: 'Drama movies', source: 'api', apiId: 11 },
    ]
  },

  // ============================================
  // 4. 🎵 MUSIC
  // ============================================
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    color: 'text-pink-500',
    description: 'Music history, genres, and artists',
    children: [
      { id: 'music-trivia', name: 'Music Trivia', icon: '🎵', color: 'text-pink-500', description: 'Music facts', source: 'api', apiId: 12 },
      { id: 'rock-music', name: 'Rock Music', icon: '🎸', color: 'text-red-400', description: 'Rock and roll', source: 'api', apiId: 12 },
      { id: 'pop-music', name: 'Pop Music', icon: '🎤', color: 'text-pink-400', description: 'Pop music', source: 'api', apiId: 12 },
      { id: 'classical-music', name: 'Classical Music', icon: '🎻', color: 'text-amber-400', description: 'Classical music', source: 'api', apiId: 12 },
      { id: 'jazz-music', name: 'Jazz Music', icon: '🎷', color: 'text-[#3B82F6CC]', description: 'Jazz music', source: 'api', apiId: 12 },
      { id: 'hip-hop', name: 'Hip Hop', icon: '🎧', color: 'text-purple-400', description: 'Hip hop music', source: 'api', apiId: 12 },
      { id: 'electronic-music', name: 'Electronic Music', icon: '🎛️', color: 'text-cyan-400', description: 'EDM and electronic', source: 'api', apiId: 12 },
      { id: 'artists', name: 'Artists', icon: '⭐', color: 'text-teal-400', description: 'Famous musicians', source: 'api', apiId: 12 },
      { id: 'music-history', name: 'Music History', icon: '📜', color: 'text-amber-400', description: 'History of music', source: 'api', apiId: 12 },
    ]
  },

  // ============================================
  // 5. 📺 TELEVISION
  // ============================================
  {
    id: 'television',
    name: 'Television',
    icon: '📺',
    color: 'text-[#2A1535]',
    description: 'TV shows, sitcoms, and television history',
    children: [
      { id: 'tv-shows', name: 'TV Shows', icon: '📺', color: 'text-[#2A1535]', description: 'TV series', source: 'api', apiId: 14 },
      { id: 'sitcoms', name: 'Sitcoms', icon: '😂', color: 'text-green-400', description: 'Situation comedies', source: 'api', apiId: 14 },
      { id: 'drama-shows', name: 'Drama Shows', icon: '🎭', color: 'text-purple-400', description: 'Drama TV series', source: 'api', apiId: 14 },
      { id: 'reality-tv', name: 'Reality TV', icon: '📸', color: 'text-pink-400', description: 'Reality shows', source: 'api', apiId: 14 },
      { id: 'animated-shows', name: 'Animated Shows', icon: '🧸', color: 'text-teal-400', description: 'Animated TV series', source: 'api', apiId: 14 },
      { id: 'tv-history', name: 'TV History', icon: '📜', color: 'text-amber-400', description: 'Television history', source: 'api', apiId: 14 },
      { id: 'tv-personalities', name: 'TV Personalities', icon: '⭐', color: 'text-teal-400', description: 'Famous TV hosts', source: 'api', apiId: 14 },
    ]
  },

  // ============================================
  // 6. 🎮 VIDEO GAMES
  // ============================================
  {
    id: 'video-games',
    name: 'Video Games',
    icon: '🎮',
    color: 'text-green-500',
    description: 'Gaming history, consoles, and game trivia',
    children: [
      { id: 'video-games-trivia', name: 'Video Games', icon: '🎮', color: 'text-green-500', description: 'Gaming trivia', source: 'api', apiId: 15 },
      { id: 'game-development', name: 'Game Development', icon: '🛠️', color: 'text-purple-400', description: 'Making games', source: 'custom', customId: 'game-dev' },
      { id: 'retro-games', name: 'Retro Games', icon: '🕹️', color: 'text-amber-400', description: 'Classic games', source: 'api', apiId: 15 },
      { id: 'modern-games', name: 'Modern Games', icon: '🎯', color: 'text-[#3B82F6CC]', description: 'Current games', source: 'api', apiId: 15 },
      { id: 'game-consoles', name: 'Game Consoles', icon: '🖥️', color: 'text-red-400', description: 'PlayStation, Xbox, Nintendo', source: 'api', apiId: 15 },
      { id: 'game-characters', name: 'Game Characters', icon: '👾', color: 'text-purple-400', description: 'Iconic game characters', source: 'api', apiId: 15 },
      { id: 'esports', name: 'Esports', icon: '🏆', color: 'text-teal-400', description: 'Competitive gaming', source: 'api', apiId: 15 },
    ]
  },

  // ============================================
  // 7. 💻 TECHNOLOGY & COMPUTERS
  // ============================================
  {
    id: 'tech',
    name: 'Technology & Computers',
    icon: '💻',
    color: 'text-[#3B82F6CC]',
    description: 'All things technology',
    children: [
      { id: 'computer-science', name: 'Computer Science', icon: '🖥️', color: 'text-[#3B82F6CC]', description: 'CS fundamentals', source: 'api', apiId: 18 },
      { id: 'programming', name: 'Programming', icon: '⌨️', color: 'text-purple-400', description: 'Programming concepts', source: 'custom', customId: 'web-dev' },
      { id: 'web-development', name: 'Web Development', icon: '🌐', color: 'text-cyan-400', description: 'HTML, CSS, JavaScript, React', source: 'custom', customId: 'web-dev' },
      { id: 'ai-ml', name: 'AI & Machine Learning', icon: '🤖', color: 'text-purple-300', description: 'Neural networks, deep learning', source: 'custom', customId: 'ai-ml' },
      { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒', color: 'text-emerald-400', description: 'Security, ethical hacking', source: 'custom', customId: 'cybersecurity' },
      { id: 'gadgets', name: 'Gadgets', icon: '📱', color: 'text-gray-400', description: 'Tech devices', source: 'api', apiId: 30 },
      { id: 'data-science', name: 'Data Science', icon: '📊', color: 'text-green-400', description: 'Data analysis', source: 'custom', customId: 'data-science' },
      { id: 'devops', name: 'DevOps', icon: '🚀', color: 'text-orange-400', description: 'CI/CD, cloud', source: 'custom', customId: 'devops' },
      { id: 'mobile-development', name: 'Mobile Development', icon: '📱', color: 'text-indigo-400', description: 'iOS, Android', source: 'custom', customId: 'mobile-dev' },
      { id: 'blockchain', name: 'Blockchain', icon: '⛓️', color: 'text-cyan-400', description: 'Blockchain technology', source: 'custom', customId: 'cryptocurrency' },
    ]
  },

  // ============================================
  // 8. 🔬 SCIENCE
  // ============================================
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: 'text-green-400',
    description: 'Explore the wonders of science',
    children: [
      { id: 'general-science', name: 'General Science', icon: '🔬', color: 'text-green-400', description: 'Various science topics', source: 'api', apiId: 17 },
      { id: 'biology', name: 'Biology', icon: '🧬', color: 'text-teal-400', description: 'Study of life', source: 'api', apiId: 17 },
      { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: 'text-emerald-400', description: 'Study of matter', source: 'api', apiId: 17 },
      { id: 'physics', name: 'Physics', icon: '⚛️', color: 'text-cyan-400', description: 'Study of matter and energy', source: 'api', apiId: 17 },
      { id: 'astronomy', name: 'Astronomy', icon: '🌌', color: 'text-indigo-400', description: 'Stars and planets', source: 'api', apiId: 17 },
      { id: 'geology', name: 'Geology', icon: '🌋', color: 'text-amber-400', description: 'Earth and rocks', source: 'api', apiId: 17 },
      { id: 'environmental-science', name: 'Environmental Science', icon: '🌿', color: 'text-green-400', description: 'Ecology and environment', source: 'api', apiId: 17 },
      { id: 'neuroscience', name: 'Neuroscience', icon: '🧠', color: 'text-purple-400', description: 'Brain and nervous system', source: 'api', apiId: 17 },
      { id: 'genetics', name: 'Genetics', icon: '🧬', color: 'text-red-400', description: 'Genes and heredity', source: 'api', apiId: 17 },
    ]
  },

  // ============================================
  // 9. 📐 MATHEMATICS
  // ============================================
  {
    id: 'math',
    name: 'Mathematics',
    icon: '📐',
    color: 'text-red-400',
    description: 'Numbers, equations, and puzzles',
    children: [
      { id: 'mathematics-trivia', name: 'Math Trivia', icon: '📐', color: 'text-red-400', description: 'Math facts', source: 'api', apiId: 19 },
      { id: 'algebra', name: 'Algebra', icon: '🔢', color: 'text-[#3B82F6CC]', description: 'Algebra concepts', source: 'api', apiId: 19 },
      { id: 'geometry', name: 'Geometry', icon: '📐', color: 'text-green-400', description: 'Shapes and space', source: 'api', apiId: 19 },
      { id: 'calculus', name: 'Calculus', icon: '∫', color: 'text-purple-400', description: 'Calculus concepts', source: 'api', apiId: 19 },
      { id: 'statistics', name: 'Statistics', icon: '📊', color: 'text-orange-400', description: 'Data statistics', source: 'api', apiId: 19 },
      { id: 'math-puzzles', name: 'Math Puzzles', icon: '🧩', color: 'text-teal-400', description: 'Math brain teasers', source: 'api', apiId: 19 },
    ]
  },

  // ============================================
  // 10. 🌍 GEOGRAPHY
  // ============================================
  {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    color: 'text-[#3B82F6CC]',
    description: 'Countries, capitals, and world geography',
    children: [
      { id: 'world-geography', name: 'World Geography', icon: '🌍', color: 'text-[#3B82F6CC]', description: 'General geography', source: 'api', apiId: 22 },
      { id: 'countries', name: 'Countries', icon: '🏳️', color: 'text-[#14B8A6]', description: 'Countries and cultures', source: 'api', apiId: 22 },
      { id: 'capitals', name: 'Capitals', icon: '🏙️', color: 'text-indigo-300', description: 'World capitals', source: 'api', apiId: 22 },
      { id: 'continents', name: 'Continents', icon: '🗺️', color: 'text-green-400', description: 'The 7 continents', source: 'api', apiId: 22 },
      { id: 'oceans', name: 'Oceans & Seas', icon: '🌊', color: 'text-cyan-400', description: 'Water bodies', source: 'api', apiId: 22 },
      { id: 'mountains', name: 'Mountains', icon: '🏔️', color: 'text-amber-400', description: 'World mountains', source: 'api', apiId: 22 },
      { id: 'rivers', name: 'Rivers', icon: '🏞️', color: 'text-[#3B82F6CC]', description: 'Major rivers', source: 'api', apiId: 22 },
      { id: 'deserts', name: 'Deserts', icon: '🏜️', color: 'text-teal-400', description: 'World deserts', source: 'api', apiId: 22 },
    ]
  },

  // ============================================
  // 11. 📜 HISTORY
  // ============================================
  {
    id: 'history',
    name: 'History',
    icon: '🏛️',
    color: 'text-amber-400',
    description: 'Learn from the past',
    children: [
      { id: 'world-history', name: 'World History', icon: '🌍', color: 'text-amber-400', description: 'General history', source: 'api', apiId: 23 },
      { id: 'ancient-history', name: 'Ancient History', icon: '🏺', color: 'text-teal-400', description: 'Ancient civilizations', source: 'api', apiId: 23 },
      { id: 'medieval-history', name: 'Medieval History', icon: '⚔️', color: 'text-gray-400', description: 'Middle ages', source: 'api', apiId: 23 },
      { id: 'modern-history', name: 'Modern History', icon: '🏭', color: 'text-indigo-400', description: 'Recent history', source: 'api', apiId: 23 },
      { id: 'wwi', name: 'World War I', icon: '🎖️', color: 'text-red-400', description: 'WWI history', source: 'api', apiId: 23 },
      { id: 'wwii', name: 'World War II', icon: '🎖️', color: 'text-red-500', description: 'WWII history', source: 'api', apiId: 23 },
      { id: 'cold-war', name: 'Cold War', icon: '❄️', color: 'text-[#3B82F6CC]', description: 'Cold War era', source: 'api', apiId: 23 },
      { id: 'ancient-egypt', name: 'Ancient Egypt', icon: '🏺', color: 'text-amber-400', description: 'Egyptian civilization', source: 'api', apiId: 23 },
      { id: 'ancient-greece', name: 'Ancient Greece', icon: '🏛️', color: 'text-[#3B82F6CC]', description: 'Greek civilization', source: 'api', apiId: 23 },
      { id: 'roman-empire', name: 'Roman Empire', icon: '🏛️', color: 'text-red-400', description: 'Roman civilization', source: 'api', apiId: 23 },
    ]
  },

  // ============================================
  // 12. ⚖️ POLITICS
  // ============================================
  {
    id: 'politics',
    name: 'Politics & Government',
    icon: '⚖️',
    color: 'text-gray-500',
    description: 'Political systems and history',
    children: [
      { id: 'politics-trivia', name: 'Politics', icon: '⚖️', color: 'text-gray-500', description: 'Political knowledge', source: 'api', apiId: 24 },
      { id: 'us-politics', name: 'US Politics', icon: '🇺🇸', color: 'text-red-400', description: 'American politics', source: 'api', apiId: 24 },
      { id: 'world-politics', name: 'World Politics', icon: '🌍', color: 'text-[#3B82F6CC]', description: 'Global politics', source: 'api', apiId: 24 },
      { id: 'political-systems', name: 'Political Systems', icon: '🏛️', color: 'text-purple-400', description: 'Forms of government', source: 'api', apiId: 24 },
      { id: 'elections', name: 'Elections', icon: '🗳️', color: 'text-green-400', description: 'Elections and voting', source: 'api', apiId: 24 },
      { id: 'political-leaders', name: 'Political Leaders', icon: '👤', color: 'text-teal-400', description: 'Famous leaders', source: 'api', apiId: 24 },
    ]
  },

  // ============================================
  // 13. 🎨 ART
  // ============================================
  {
    id: 'art',
    name: 'Art',
    icon: '🎨',
    color: 'text-pink-400',
    description: 'Visual arts and creativity',
    children: [
      { id: 'art-trivia', name: 'Art Trivia', icon: '🎨', color: 'text-pink-400', description: 'Art facts', source: 'api', apiId: 25 },
      { id: 'painting', name: 'Painting', icon: '🖼️', color: 'text-pink-400', description: 'Famous paintings', source: 'api', apiId: 25 },
      { id: 'sculpture', name: 'Sculpture', icon: '🗿', color: 'text-gray-400', description: 'Sculptures and statues', source: 'api', apiId: 25 },
      { id: 'photography', name: 'Photography', icon: '📸', color: 'text-[#3B82F6CC]', description: 'Photography art', source: 'api', apiId: 25 },
      { id: 'famous-artists', name: 'Famous Artists', icon: '🎨', color: 'text-purple-400', description: 'Renowned artists', source: 'api', apiId: 25 },
      { id: 'art-movements', name: 'Art Movements', icon: '🔄', color: 'text-green-400', description: 'Art periods and styles', source: 'api', apiId: 25 },
      { id: 'renaissance', name: 'Renaissance', icon: '🖼️', color: 'text-amber-400', description: 'Renaissance art', source: 'api', apiId: 25 },
      { id: 'modern-art', name: 'Modern Art', icon: '🎨', color: 'text-purple-300', description: 'Contemporary art', source: 'api', apiId: 25 },
    ]
  },

  // ============================================
  // 14. ⭐ CELEBRITIES
  // ============================================
  {
    id: 'celebrities',
    name: 'Celebrities',
    icon: '⭐',
    color: 'text-teal-400',
    description: 'Famous people from all fields',
    children: [
      { id: 'celebrities-trivia', name: 'Celebrities', icon: '⭐', color: 'text-teal-400', description: 'Celebrity facts', source: 'api', apiId: 26 },
      { id: 'actors-celebs', name: 'Actors', icon: '🎬', color: 'text-red-400', description: 'Famous actors', source: 'api', apiId: 26 },
      { id: 'musicians-celebs', name: 'Musicians', icon: '🎵', color: 'text-pink-400', description: 'Famous musicians', source: 'api', apiId: 26 },
      { id: 'athletes-celebs', name: 'Athletes', icon: '🏆', color: 'text-green-400', description: 'Famous athletes', source: 'api', apiId: 26 },
      { id: 'influencers', name: 'Influencers', icon: '📱', color: 'text-[#3B82F6CC]', description: 'Social media stars', source: 'api', apiId: 26 },
    ]
  },

  // ============================================
  // 15. 🐾 ANIMALS
  // ============================================
  {
    id: 'animals',
    name: 'Animals',
    icon: '🐾',
    color: 'text-green-400',
    description: 'All about animals and wildlife',
    children: [
      { id: 'animals-trivia', name: 'Animals', icon: '🐾', color: 'text-green-400', description: 'Animal facts', source: 'api', apiId: 27 },
      { id: 'mammals', name: 'Mammals', icon: '🐕', color: 'text-brown-400', description: 'Mammal species', source: 'api', apiId: 27 },
      { id: 'birds', name: 'Birds', icon: '🐦', color: 'text-[#3B82F6CC]', description: 'Bird species', source: 'api', apiId: 27 },
      { id: 'reptiles', name: 'Reptiles', icon: '🐍', color: 'text-green-400', description: 'Reptile species', source: 'api', apiId: 27 },
      { id: 'sea-creatures', name: 'Sea Creatures', icon: '🐟', color: 'text-cyan-400', description: 'Marine life', source: 'api', apiId: 27 },
      { id: 'dinosaurs', name: 'Dinosaurs', icon: '🦕', color: 'text-amber-400', description: 'Dinosaur species', source: 'api', apiId: 27 },
      { id: 'insects', name: 'Insects', icon: '🐝', color: 'text-teal-400', description: 'Insect species', source: 'api', apiId: 27 },
    ]
  },

  // ============================================
  // 16. 🚗 VEHICLES
  // ============================================
  {
    id: 'vehicles',
    name: 'Vehicles',
    icon: '🚗',
    color: 'text-[#2563EB]',
    description: 'Cars, motorcycles, and transportation',
    children: [
      { id: 'vehicles-trivia', name: 'Vehicles', icon: '🚗', color: 'text-[#2563EB]', description: 'Vehicle facts', source: 'api', apiId: 28 },
      { id: 'cars', name: 'Cars', icon: '🚗', color: 'text-red-400', description: 'Car brands and models', source: 'api', apiId: 28 },
      { id: 'motorcycles', name: 'Motorcycles', icon: '🏍️', color: 'text-orange-400', description: 'Motorcycle brands', source: 'api', apiId: 28 },
      { id: 'trucks', name: 'Trucks', icon: '🚚', color: 'text-[#3B82F6CC]', description: 'Truck models', source: 'api', apiId: 28 },
      { id: 'classic-cars', name: 'Classic Cars', icon: '🚗', color: 'text-amber-400', description: 'Vintage cars', source: 'api', apiId: 28 },
    ]
  },

  // ============================================
  // 17. 🦸 COMICS
  // ============================================
  {
    id: 'comics',
    name: 'Comics',
    icon: '🦸',
    color: 'text-red-600',
    description: 'Comic books, superheroes, and graphic novels',
    children: [
      { id: 'comics-trivia', name: 'Comics', icon: '🦸', color: 'text-red-600', description: 'Comic book facts', source: 'api', apiId: 29 },
      { id: 'marvel', name: 'Marvel', icon: '🦸', color: 'text-red-500', description: 'Marvel universe', source: 'api', apiId: 29 },
      { id: 'dc', name: 'DC Comics', icon: '🦸', color: 'text-[#2A1535]', description: 'DC universe', source: 'api', apiId: 29 },
      { id: 'superheroes', name: 'Superheroes', icon: '🦸', color: 'text-purple-400', description: 'Superhero facts', source: 'api', apiId: 29 },
      { id: 'villains', name: 'Villains', icon: '🦹', color: 'text-red-400', description: 'Supervillains', source: 'api', apiId: 29 },
      { id: 'graphic-novels', name: 'Graphic Novels', icon: '📚', color: 'text-amber-400', description: 'Graphic novels', source: 'api', apiId: 29 },
    ]
  },

  // ============================================
  // 18. 🎌 ANIME & MANGA
  // ============================================
  {
    id: 'anime',
    name: 'Anime & Manga',
    icon: '🎌',
    color: 'text-pink-600',
    description: 'Japanese animation and manga',
    children: [
      { id: 'anime-manga', name: 'Anime', icon: '🎌', color: 'text-pink-600', description: 'Anime trivia', source: 'api', apiId: 31 },
      { id: 'manga', name: 'Manga', icon: '📖', color: 'text-pink-400', description: 'Manga trivia', source: 'api', apiId: 31 },
      { id: 'studio-ghibli', name: 'Studio Ghibli', icon: '🏠', color: 'text-[#3B82F6CC]', description: 'Ghibli films', source: 'api', apiId: 31 },
      { id: 'shonen', name: 'Shonen Anime', icon: '⚡', color: 'text-orange-400', description: 'Shonen anime', source: 'api', apiId: 31 },
      { id: 'shojo', name: 'Shojo Anime', icon: '🌸', color: 'text-pink-400', description: 'Shojo anime', source: 'api', apiId: 31 },
    ]
  },

  // ============================================
  // 19. 🧸 CARTOON & ANIMATION
  // ============================================
  {
    id: 'cartoons',
    name: 'Cartoon & Animation',
    icon: '🧸',
    color: 'text-teal-400',
    description: 'Cartoons and animated shows',
    children: [
      { id: 'cartoon-animation', name: 'Cartoons', icon: '🧸', color: 'text-teal-400', description: 'Cartoon trivia', source: 'api', apiId: 32 },
      { id: 'disney', name: 'Disney', icon: '🏰', color: 'text-[#3B82F6CC]', description: 'Disney animation', source: 'api', apiId: 32 },
      { id: 'pixar', name: 'Pixar', icon: '💡', color: 'text-teal-400', description: 'Pixar films', source: 'api', apiId: 32 },
      { id: 'cartoon-network', name: 'Cartoon Network', icon: '📺', color: 'text-red-400', description: 'Cartoon Network shows', source: 'api', apiId: 32 },
      { id: 'adult-swim', name: 'Adult Swim', icon: '🌙', color: 'text-purple-400', description: 'Adult Swim shows', source: 'api', apiId: 32 },
    ]
  },

  // ============================================
  // 20. ⚽ SPORTS
  // ============================================
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    color: 'text-rose-400',
    description: 'Athletics, competition, and fitness',
    children: [
      { id: 'general-sports', name: 'General Sports', icon: '🏆', color: 'text-rose-400', description: 'All sports', source: 'api', apiId: 21 },
      { id: 'football', name: 'Football (Soccer)', icon: '⚽', color: 'text-green-400', description: 'Soccer specific', source: 'custom', customId: 'football' },
      { id: 'basketball', name: 'Basketball', icon: '🏀', color: 'text-orange-400', description: 'NBA and basketball', source: 'api', apiId: 21 },
      { id: 'tennis', name: 'Tennis', icon: '🎾', color: 'text-green-400', description: 'Tennis trivia', source: 'api', apiId: 21 },
      { id: 'cricket', name: 'Cricket', icon: '🏏', color: 'text-[#3B82F6CC]', description: 'Cricket trivia', source: 'api', apiId: 21 },
      { id: 'formula-1', name: 'Formula 1', icon: '🏎️', color: 'text-red-400', description: 'F1 racing', source: 'api', apiId: 21 },
      { id: 'olympics', name: 'Olympics', icon: '🏅', color: 'text-teal-400', description: 'Olympic games', source: 'api', apiId: 21 },
      { id: 'baseball', name: 'Baseball', icon: '⚾', color: 'text-[#3B82F6CC]', description: 'Baseball trivia', source: 'api', apiId: 21 },
      { id: 'swimming', name: 'Swimming', icon: '🏊', color: 'text-cyan-400', description: 'Swimming trivia', source: 'api', apiId: 21 },
      { id: 'athletics', name: 'Athletics', icon: '🏃', color: 'text-orange-400', description: 'Track and field', source: 'api', apiId: 21 },
    ]
  },

  // ============================================
  // 21. ⛪ RELIGION
  // ============================================
  {
    id: 'religion',
    name: 'Religion & Spirituality',
    icon: '⛪',
    color: 'text-purple-300',
    description: 'Faith, beliefs, and spiritual practices',
    children: [
      { id: 'bible-studies', name: 'Bible Studies', icon: '📖', color: 'text-amber-400', description: 'Bible study', source: 'custom', customId: 'bible-studies' },
      { id: 'mythology', name: 'Mythology', icon: '🐉', color: 'text-indigo-500', description: 'Myths and legends', source: 'api', apiId: 20 },
      { id: 'greek-mythology', name: 'Greek Mythology', icon: '⚡', color: 'text-teal-400', description: 'Greek myths', source: 'api', apiId: 20 },
      { id: 'norse-mythology', name: 'Norse Mythology', icon: '🔨', color: 'text-[#3B82F6CC]', description: 'Norse myths', source: 'api', apiId: 20 },
      { id: 'world-religions', name: 'World Religions', icon: '🕊️', color: 'text-purple-400', description: 'Major religions', source: 'api', apiId: 20 },
      { id: 'christianity', name: 'Christianity', icon: '✝️', color: 'text-[#14B8A6]', description: 'Christian faith', source: 'custom', customId: 'bible-studies' },
      { id: 'islam', name: 'Islam', icon: '🕌', color: 'text-emerald-300', description: 'Islamic faith', source: 'custom', customId: 'islamic-studies' },
      { id: 'hinduism', name: 'Hinduism', icon: '🕉️', color: 'text-orange-400', description: 'Hindu faith', source: 'custom', customId: 'hinduism' },
      { id: 'buddhism', name: 'Buddhism', icon: '☸️', color: 'text-yellow-300', description: 'Buddhist faith', source: 'custom', customId: 'buddhism' },
    ]
  },

  // ============================================
  // 22. 💰 FINANCE & BUSINESS
  // ============================================
  {
    id: 'finance',
    name: 'Finance & Business',
    icon: '💰',
    color: 'text-emerald-400',
    description: 'Money, markets, and management',
    children: [
      { id: 'personal-finance', name: 'Personal Finance', icon: '💰', color: 'text-green-400', description: 'Budgeting and saving', source: 'custom', customId: 'personal-finance' },
      { id: 'cryptocurrency', name: 'Cryptocurrency', icon: '₿', color: 'text-orange-400', description: 'Bitcoin and blockchain', source: 'custom', customId: 'cryptocurrency' },
      { id: 'investing', name: 'Investing', icon: '📈', color: 'text-[#3B82F6CC]', description: 'Stocks and bonds', source: 'custom', customId: 'investing' },
      { id: 'entrepreneurship', name: 'Entrepreneurship', icon: '💼', color: 'text-purple-400', description: 'Starting a business', source: 'custom', customId: 'entrepreneurship' },
      { id: 'economics', name: 'Economics', icon: '📊', color: 'text-cyan-400', description: 'Economic principles', source: 'custom', customId: 'economics' },
      { id: 'marketing', name: 'Marketing', icon: '📣', color: 'text-pink-400', description: 'Marketing strategies', source: 'custom', customId: 'marketing' },
      { id: 'leadership', name: 'Leadership', icon: '👤', color: 'text-teal-400', description: 'Leadership skills', source: 'custom', customId: 'leadership' },
      { id: 'real-estate', name: 'Real Estate', icon: '🏠', color: 'text-amber-400', description: 'Property and real estate', source: 'custom', customId: 'real-estate' },
    ]
  },

  // ============================================
  // 23. 💪 HEALTH & WELLNESS
  // ============================================
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '💪',
    color: 'text-red-400',
    description: 'Physical and mental well-being',
    children: [
      { id: 'fitness', name: 'Fitness', icon: '🏋️', color: 'text-orange-400', description: 'Exercise and training', source: 'custom', customId: 'fitness' },
      { id: 'nutrition', name: 'Nutrition', icon: '🥗', color: 'text-green-400', description: 'Healthy eating', source: 'custom', customId: 'nutrition' },
      { id: 'mental-health', name: 'Mental Health', icon: '🧘', color: 'text-purple-400', description: 'Mental wellness', source: 'custom', customId: 'mental-health' },
      { id: 'yoga', name: 'Yoga', icon: '🧘', color: 'text-purple-300', description: 'Yoga and meditation', source: 'custom', customId: 'yoga' },
      { id: 'sleep', name: 'Sleep', icon: '😴', color: 'text-indigo-400', description: 'Sleep health', source: 'custom', customId: 'sleep' },
      { id: 'stress-management', name: 'Stress Management', icon: '🧘', color: 'text-[#3B82F6CC]', description: 'Managing stress', source: 'custom', customId: 'stress-management' },
    ]
  },

  // ============================================
  // 24. 🎭 THEATRE & PERFORMING ARTS
  // ============================================
  {
    id: 'theatre',
    name: 'Theatre & Performing Arts',
    icon: '🎭',
    color: 'text-purple-500',
    description: 'Theatre, musicals, and performance',
    children: [
      { id: 'musicals-theatres', name: 'Musicals', icon: '🎭', color: 'text-purple-500', description: 'Musical theatre', source: 'api', apiId: 13 },
      { id: 'broadway', name: 'Broadway', icon: '🎭', color: 'text-teal-400', description: 'Broadway shows', source: 'api', apiId: 13 },
      { id: 'west-end', name: 'West End', icon: '🎭', color: 'text-red-400', description: 'West End shows', source: 'api', apiId: 13 },
      { id: 'acting', name: 'Acting', icon: '🎭', color: 'text-[#3B82F6CC]', description: 'Acting techniques', source: 'api', apiId: 13 },
      { id: 'dance', name: 'Dance', icon: '💃', color: 'text-pink-400', description: 'Dance styles', source: 'api', apiId: 13 },
      { id: 'opera', name: 'Opera', icon: '🎵', color: 'text-amber-400', description: 'Opera music', source: 'api', apiId: 13 },
    ]
  },

  // ============================================
  // 25. 🧩 BOARD GAMES
  // ============================================
  {
    id: 'board-games',
    name: 'Board Games',
    icon: '♟️',
    color: 'text-amber-700',
    description: 'Board games, card games, and strategy games',
    children: [
      { id: 'board-games-trivia', name: 'Board Games', icon: '♟️', color: 'text-amber-700', description: 'Board game facts', source: 'api', apiId: 16 },
      { id: 'chess', name: 'Chess', icon: '♛', color: 'text-gray-400', description: 'Chess trivia', source: 'api', apiId: 16 },
      { id: 'card-games', name: 'Card Games', icon: '🃏', color: 'text-red-400', description: 'Card game facts', source: 'api', apiId: 16 },
      { id: 'strategy-games', name: 'Strategy Games', icon: '🧠', color: 'text-purple-400', description: 'Strategy board games', source: 'api', apiId: 16 },
      { id: 'puzzles', name: 'Puzzles', icon: '🧩', color: 'text-teal-400', description: 'Puzzle games', source: 'api', apiId: 16 },
    ]
  }
];

// Helper functions
export const getAllCategories = () => {
  const categories = [];
  categoryHierarchy.forEach(parent => {
    categories.push({ id: parent.id, name: parent.name, icon: parent.icon, color: parent.color, level: 0 });
    parent.children.forEach(child => {
      categories.push({ id: child.id, name: child.name, icon: child.icon, color: child.color, level: 1, parent: parent.id });
      if (child.children) {
        child.children.forEach(sub => {
          categories.push({ 
            id: sub.id, 
            name: sub.name, 
            icon: sub.icon, 
            color: sub.color, 
            level: 2, 
            parent: child.id,
            source: sub.source || 'api',
            apiId: sub.apiId || null,
            customId: sub.customId || null
          });
        });
      }
    });
  });
  return categories;
};

export const getCategoryById = (id) => {
  return getAllCategories().find(c => c.id === id);
};

export default categoryHierarchy;
