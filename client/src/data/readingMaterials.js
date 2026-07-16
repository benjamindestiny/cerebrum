// Reading materials data - Expanded with more topics
export const readingMaterials = [
  // ============================================
  // 📱 TECHNOLOGY
  // ============================================
  {
    id: 1,
    title: "The History of Artificial Intelligence",
    category: "Technology",
    subcategory: "Artificial Intelligence",
    icon: "🤖",
    difficulty: "Medium",
    estimatedTime: "8 min read",
    content: "<h3>The History of Artificial Intelligence</h3><p>Artificial Intelligence (AI) has a rich history dating back to ancient Greek myths of mechanical beings. However, the modern field of AI was officially born in 1956 at the Dartmouth Conference, where John McCarthy coined the term 'Artificial Intelligence.'</p><p>Early AI research focused on symbolic reasoning and problem-solving. In the 1960s and 1970s, researchers developed expert systems that could mimic human decision-making in specific domains like medical diagnosis.</p><p>The 1980s saw the rise of machine learning, where computers could learn from data rather than being explicitly programmed. This was followed by the development of neural networks in the 1990s, which were inspired by the human brain.</p><p>Today, AI is everywhere—from voice assistants like Siri and Alexa to recommendation algorithms on Netflix and Amazon. Recent advances in deep learning have led to breakthroughs in image recognition, natural language processing, and autonomous vehicles.</p><p>The future of AI holds both promise and challenges. Ethical considerations, such as bias in AI systems and the impact on jobs, need to be carefully addressed as the technology continues to evolve.</p>",
    questions: [
      { question: "When was the term 'Artificial Intelligence' coined?", options: ["1956", "1960", "1950", "1945"], correct: 0 },
      { question: "What type of AI research was popular in the 1980s?", options: ["Machine Learning", "Expert Systems", "Neural Networks", "Robotics"], correct: 0 },
      { question: "Which of these is an application of AI?", options: ["Voice Assistants", "Spreadsheets", "Email", "Web Browsers"], correct: 0 }
    ]
  },
  {
    id: 2,
    title: "Cybersecurity: Protecting Our Digital World",
    category: "Technology",
    subcategory: "Cybersecurity",
    icon: "🔒",
    difficulty: "Medium",
    estimatedTime: "7 min read",
    content: "<h3>Cybersecurity: Protecting Our Digital World</h3><p>Cybersecurity is the practice of protecting computer systems, networks, and data from digital attacks. In today's interconnected world, cybersecurity is more important than ever.</p><p>Common cybersecurity threats include malware, phishing, ransomware, and social engineering. These attacks can lead to data breaches, financial loss, and damage to an organization's reputation.</p><p>There are several key principles of cybersecurity: confidentiality (keeping data private), integrity (ensuring data is accurate), and availability (ensuring data is accessible when needed).</p><p>Best practices for individuals include using strong passwords, enabling two-factor authentication, keeping software updated, and being cautious about suspicious emails and links.</p><p>Organizations implement security measures like firewalls, intrusion detection systems, and security awareness training for employees.</p>",
    questions: [
      { question: "What is the practice of protecting computer systems from digital attacks called?", options: ["Cybersecurity", "Data Science", "Network Administration", "Software Development"], correct: 0 },
      { question: "Which of these is a common cybersecurity threat?", options: ["Phishing", "Firewalls", "Passwords", "Software updates"], correct: 0 },
      { question: "What is a recommended practice for individuals to improve security?", options: ["Use strong passwords", "Share passwords", "Disable updates", "Click all links"], correct: 0 }
    ]
  },
  {
    id: 3,
    title: "Cloud Computing: The Future of Technology",
    category: "Technology",
    subcategory: "Cloud Computing",
    icon: "☁️",
    difficulty: "Easy",
    estimatedTime: "6 min read",
    content: "<h3>Cloud Computing: The Future of Technology</h3><p>Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, and analytics—over the internet ('the cloud').</p><p>There are three main types of cloud computing: Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).</p><p>Popular cloud providers include Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform. These companies offer a wide range of services.</p><p>The benefits of cloud computing include cost savings, scalability, flexibility, and reliability.</p>",
    questions: [
      { question: "What is cloud computing?", options: ["Computing services over the internet", "Computing on physical servers", "Computing without networks", "Computing on paper"], correct: 0 },
      { question: "Which of these is a cloud provider?", options: ["Amazon Web Services", "Microsoft Office", "Google Docs", "Apple Store"], correct: 0 },
      { question: "What is a benefit of cloud computing?", options: ["Cost savings", "More hardware", "Physical security", "Manual updates"], correct: 0 }
    ]
  },

  // ============================================
  // 🌾 AGRICULTURE
  // ============================================
  {
    id: 4,
    title: "Sustainable Farming Practices",
    category: "Agriculture",
    subcategory: "Sustainable Farming",
    icon: "🌾",
    difficulty: "Medium",
    estimatedTime: "7 min read",
    content: "<h3>Sustainable Farming Practices</h3><p>Sustainable farming is the practice of producing food in a way that protects the environment, public health, and animal welfare. It involves using farming techniques that conserve natural resources and maintain soil fertility.</p><p>Key sustainable farming practices include crop rotation, cover cropping, reduced tillage, and integrated pest management. These methods help maintain soil health, reduce erosion, and minimize the use of chemical inputs.</p><p>Organic farming is a form of sustainable agriculture that avoids the use of synthetic pesticides and fertilizers. It emphasizes the use of natural methods to control pests and enrich the soil.</p><p>Agroforestry combines trees and shrubs with crops and livestock. This practice can improve soil health, increase biodiversity, and provide additional income for farmers.</p>",
    questions: [
      { question: "What is sustainable farming?", options: ["Producing food while protecting the environment", "Producing as much food as possible", "Using only chemical fertilizers", "Farming without technology"], correct: 0 },
      { question: "Which is a sustainable farming practice?", options: ["Crop rotation", "Monoculture", "Excessive tilling", "Overuse of pesticides"], correct: 0 },
      { question: "What does organic farming avoid?", options: ["Synthetic pesticides", "Natural fertilizers", "Crop rotation", "Composting"], correct: 0 }
    ]
  },
  {
    id: 5,
    title: "The Science of Soil Health",
    category: "Agriculture",
    subcategory: "Soil Science",
    icon: "🌱",
    difficulty: "Hard",
    estimatedTime: "8 min read",
    content: "<h3>The Science of Soil Health</h3><p>Soil health is the capacity of soil to function as a living ecosystem that sustains plants, animals, and humans. Healthy soil is rich in organic matter and teeming with microorganisms.</p><p>The soil food web consists of bacteria, fungi, protozoa, nematodes, and earthworms. These organisms break down organic matter and release nutrients that plants need to grow.</p><p>Soil organic matter is the foundation of soil health. It improves soil structure, increases water-holding capacity, and provides nutrients for plants.</p>",
    questions: [
      { question: "What is soil health?", options: ["Capacity to function as a living ecosystem", "Amount of minerals in soil", "Color of the soil", "Temperature of the soil"], correct: 0 },
      { question: "What does the soil food web consist of?", options: ["Bacteria, fungi, and earthworms", "Only bacteria", "Only fungi", "Only earthworms"], correct: 0 },
      { question: "What improves soil structure?", options: ["Organic matter", "Chemical fertilizers", "Pesticides", "Herbicides"], correct: 0 }
    ]
  },

  // ============================================
  // 💰 FINANCE
  // ============================================
  {
    id: 6,
    title: "Personal Finance: Building Wealth",
    category: "Finance",
    subcategory: "Personal Finance",
    icon: "💰",
    difficulty: "Easy",
    estimatedTime: "6 min read",
    content: "<h3>Personal Finance: Building Wealth</h3><p>Personal finance is the management of an individual's financial resources. It includes budgeting, saving, investing, and planning for financial goals.</p><p>Effective personal finance involves creating a budget that tracks income and expenses. This helps identify areas where you can save and invest for the future.</p><p>Saving money is an important part of personal finance. Building an emergency fund and saving for retirement are key financial goals.</p><p>Investing can help grow wealth over time. Common investment options include stocks, bonds, mutual funds, and real estate.</p>",
    questions: [
      { question: "What is personal finance?", options: ["Management of financial resources", "Business management", "Investment strategies", "Real estate planning"], correct: 0 },
      { question: "What is a key part of personal finance?", options: ["Creating a budget", "Buying luxury items", "Giving away money", "Spending everything"], correct: 0 },
      { question: "What is an important savings goal?", options: ["Emergency fund", "Luxury car", "Large TV", "Designer clothes"], correct: 0 }
    ]
  },
  {
    id: 7,
    title: "Understanding Cryptocurrency",
    category: "Finance",
    subcategory: "Cryptocurrency",
    icon: "💎",
    difficulty: "Hard",
    estimatedTime: "9 min read",
    content: "<h3>Understanding Cryptocurrency</h3><p>Cryptocurrency is a digital or virtual currency that uses cryptography for security. It operates independently of a central bank and can be used for online transactions and investments.</p><p>The first and most well-known cryptocurrency is Bitcoin, created in 2009 by an anonymous individual or group known as Satoshi Nakamoto.</p><p>Cryptocurrencies use blockchain technology, which is a distributed ledger that records all transactions. This makes them transparent and resistant to fraud.</p>",
    questions: [
      { question: "What is cryptocurrency?", options: ["Digital or virtual currency", "Physical currency", "Paper currency", "Gold-backed currency"], correct: 0 },
      { question: "When was Bitcoin created?", options: ["2009", "2010", "2005", "2015"], correct: 0 },
      { question: "What technology do cryptocurrencies use?", options: ["Blockchain", "AI", "Cloud computing", "Big data"], correct: 0 }
    ]
  },
  {
    id: 8,
    title: "Stock Market Basics",
    category: "Finance",
    subcategory: "Investing",
    icon: "📈",
    difficulty: "Medium",
    estimatedTime: "7 min read",
    content: "<h3>Stock Market Basics</h3><p>The stock market is a place where shares of publicly traded companies are bought and sold. It serves as a marketplace for investors to trade stocks.</p><p>Investing in stocks means buying ownership in a company. As a shareholder, you can earn money through dividends and capital appreciation.</p><p>There are different types of stocks: common stocks and preferred stocks. Common stocks give voting rights, while preferred stocks offer fixed dividends.</p>",
    questions: [
      { question: "What is the stock market?", options: ["A place where shares are traded", "A bank", "A government agency", "A type of currency"], correct: 0 },
      { question: "What does investing in stocks mean?", options: ["Buying ownership in a company", "Lending money to a company", "Buying products from a company", "Working for a company"], correct: 0 },
      { question: "What do common stocks give?", options: ["Voting rights", "Fixed dividends", "Guaranteed profits", "Company ownership only"], correct: 0 }
    ]
  },

  // ============================================
  // 🌿 BIOLOGY & NATURE
  // ============================================
  {
    id: 9,
    title: "The Human Body: An Overview",
    category: "Biology",
    subcategory: "Human Anatomy",
    icon: "🧍",
    difficulty: "Medium",
    estimatedTime: "7 min read",
    content: "<h3>The Human Body: An Overview</h3><p>The human body is a complex system composed of several organ systems that work together to maintain life. Each system has specific functions that contribute to overall health.</p><p>The skeletal system provides structure and support for the body. It consists of 206 bones that protect internal organs and allow movement.</p><p>The muscular system enables movement and helps maintain posture. There are three types of muscles: skeletal, smooth, and cardiac.</p><p>The circulatory system transports blood, oxygen, and nutrients throughout the body. The heart pumps blood through blood vessels.</p>",
    questions: [
      { question: "How many bones are in the human body?", options: ["206", "200", "210", "190"], correct: 0 },
      { question: "What does the circulatory system transport?", options: ["Blood, oxygen, and nutrients", "Only blood", "Only oxygen", "Only nutrients"], correct: 0 },
      { question: "Which type of muscle is found in the heart?", options: ["Cardiac", "Skeletal", "Smooth", "Voluntary"], correct: 0 }
    ]
  },
  {
    id: 10,
    title: "The Miracle of Photosynthesis",
    category: "Biology",
    subcategory: "Plant Biology",
    icon: "🌿",
    difficulty: "Medium",
    estimatedTime: "6 min read",
    content: "<h3>The Miracle of Photosynthesis</h3><p>Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy. This process is essential for life on Earth.</p><p>Plants use chlorophyll, the green pigment in leaves, to capture sunlight. They combine carbon dioxide from the air and water from the soil to produce glucose and oxygen.</p><p>The oxygen released during photosynthesis is essential for most living organisms. The glucose produced provides energy for the plant and other organisms that consume it.</p>",
    questions: [
      { question: "What is photosynthesis?", options: ["Converting light energy into chemical energy", "Converting food into energy", "Converting water into oxygen", "Converting sunlight into heat"], correct: 0 },
      { question: "What pigment captures sunlight in plants?", options: ["Chlorophyll", "Carotene", "Xanthophyll", "Anthocyanin"], correct: 0 },
      { question: "What is released during photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correct: 0 }
    ]
  },
  {
    id: 11,
    title: "DNA: The Blueprint of Life",
    category: "Biology",
    subcategory: "Genetics",
    icon: "🧬",
    difficulty: "Hard",
    estimatedTime: "9 min read",
    content: "<h3>DNA: The Blueprint of Life</h3><p>DNA, or deoxyribonucleic acid, is the hereditary material in humans and almost all other organisms. It contains the instructions needed for an organism to develop, survive, and reproduce.</p><p>DNA is shaped like a double helix, which resembles a twisted ladder. The sides of the ladder are made of sugar and phosphate molecules, while the rungs are made of nitrogenous bases.</p><p>Genes are segments of DNA that contain the instructions for making proteins. These proteins determine an organism's traits and characteristics.</p>",
    questions: [
      { question: "What does DNA stand for?", options: ["Deoxyribonucleic acid", "Dioxyribonucleic acid", "Deoxyribose nucleic acid", "Dioxyribose nucleic acid"], correct: 0 },
      { question: "What shape is DNA?", options: ["Double helix", "Single strand", "Circle", "Square"], correct: 0 },
      { question: "What are genes?", options: ["Segments of DNA containing instructions", "Types of proteins", "Sugars in DNA", "Parts of the cell"], correct: 0 }
    ]
  },

  // ============================================
  // 🔬 SCIENCE
  // ============================================
  {
    id: 12,
    title: "The Science of Climate Change",
    category: "Science",
    subcategory: "Environmental Science",
    icon: "🌍",
    difficulty: "Medium",
    estimatedTime: "8 min read",
    content: "<h3>The Science of Climate Change</h3><p>Climate change refers to long-term shifts in temperatures and weather patterns. Since the Industrial Revolution, human activities have been the main driver of climate change.</p><p>The greenhouse effect is a natural process that warms the Earth's surface. When greenhouse gases are released into the atmosphere, they trap heat and cause global temperatures to rise.</p><p>The effects of climate change include rising sea levels, more frequent severe weather events, loss of biodiversity, and threats to food security.</p>",
    questions: [
      { question: "What is the main driver of climate change?", options: ["Human activities", "Natural cycles", "Solar radiation", "Volcanic eruptions"], correct: 0 },
      { question: "What is the greenhouse effect?", options: ["Natural warming process", "Cooling process", "Weather pattern", "Climate cycle"], correct: 0 },
      { question: "What is a solution to climate change?", options: ["Renewable energy", "More fossil fuels", "Deforestation", "Increasing emissions"], correct: 0 }
    ]
  },
  {
    id: 13,
    title: "Exploring the Solar System",
    category: "Science",
    subcategory: "Astronomy",
    icon: "🚀",
    difficulty: "Medium",
    estimatedTime: "7 min read",
    content: "<h3>Exploring the Solar System</h3><p>The Solar System consists of the Sun, eight planets, and countless smaller objects like asteroids and comets. It has been a subject of scientific exploration for centuries.</p><p>The Sun is a yellow dwarf star that contains about 99.86% of the total mass of the Solar System.</p><p>The planets in order from the Sun are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.</p>",
    questions: [
      { question: "What percentage of the Solar System's mass does the Sun contain?", options: ["99.86%", "95%", "98%", "100%"], correct: 0 },
      { question: "Which planet is the largest in the Solar System?", options: ["Jupiter", "Saturn", "Neptune", "Uranus"], correct: 0 },
      { question: "What are the inner planets made of?", options: ["Rock", "Gas", "Ice", "Water"], correct: 0 }
    ]
  },

  // ============================================
  // 📜 HISTORY
  // ============================================
  {
    id: 14,
    title: "The French Revolution: A Turning Point",
    category: "History",
    subcategory: "European History",
    icon: "🏛️",
    difficulty: "Hard",
    estimatedTime: "9 min read",
    content: "<h3>The French Revolution: A Turning Point</h3><p>The French Revolution was a period of radical political and societal change in France that began in 1789 and ended with the formation of the French Consulate in 1799.</p><p>The revolution was driven by widespread dissatisfaction with the French monarchy and the influence of Enlightenment ideas.</p><p>Key events included the storming of the Bastille prison on July 14, 1789, and the Declaration of the Rights of Man and of the Citizen.</p>",
    questions: [
      { question: "When did the French Revolution begin?", options: ["1789", "1776", "1799", "1804"], correct: 0 },
      { question: "What event on July 14, 1789, is celebrated as France's national holiday?", options: ["Storming of the Bastille", "Reign of Terror", "Death of Louis XVI", "Rise of Napoleon"], correct: 0 },
      { question: "Who led the Reign of Terror?", options: ["Maximilien Robespierre", "Napoleon Bonaparte", "Louis XVI", "Marie Antoinette"], correct: 0 }
    ]
  },
  {
    id: 15,
    title: "Ancient Egypt: The Land of Pharaohs",
    category: "History",
    subcategory: "Ancient History",
    icon: "🏺",
    difficulty: "Medium",
    estimatedTime: "8 min read",
    content: "<h3>Ancient Egypt: The Land of Pharaohs</h3><p>Ancient Egypt was one of the most powerful and enduring civilizations in history. It developed along the Nile River over 5,000 years ago.</p><p>The civilization is known for its hieroglyphic writing, elaborate architecture, and complex religious beliefs. The most iconic structures are the pyramids.</p><p>Egyptian society was hierarchical, with the pharaoh at the top considered both a political and religious leader.</p>",
    questions: [
      { question: "Which river was Ancient Egypt developed along?", options: ["The Nile", "The Amazon", "The Mississippi", "The Danube"], correct: 0 },
      { question: "What is the most iconic structure associated with Ancient Egypt?", options: ["Pyramids", "Palaces", "Temples", "Colosseum"], correct: 0 },
      { question: "Who was at the top of Egyptian society?", options: ["The Pharaoh", "The Priest", "The General", "The Vizier"], correct: 0 }
    ]
  },

  // ============================================
  // 💪 HEALTH & FITNESS
  // ============================================
  {
    id: 16,
    title: "The Science of Nutrition",
    category: "Health & Fitness",
    subcategory: "Nutrition",
    icon: "🥗",
    difficulty: "Easy",
    estimatedTime: "6 min read",
    content: "<h3>The Science of Nutrition</h3><p>Nutrition is the science of how food affects the body. It involves the study of nutrients, which are substances that provide energy and support bodily functions.</p><p>There are six essential nutrients: carbohydrates, proteins, fats, vitamins, minerals, and water.</p><p>A balanced diet should include a variety of foods from all food groups. This ensures the body receives all the nutrients it needs.</p>",
    questions: [
      { question: "What is the science of how food affects the body called?", options: ["Nutrition", "Dietetics", "Cooking", "Biology"], correct: 0 },
      { question: "How many essential nutrients are there?", options: ["Six", "Three", "Ten", "Four"], correct: 0 },
      { question: "What should a balanced diet include?", options: ["Variety of foods", "Only meat", "Only vegetables", "Only fruits"], correct: 0 }
    ]
  },
  {
    id: 17,
    title: "Understanding Mental Health",
    category: "Health & Fitness",
    subcategory: "Mental Health",
    icon: "🧘",
    difficulty: "Medium",
    estimatedTime: "7 min read",
    content: "<h3>Understanding Mental Health</h3><p>Mental health refers to a person's emotional, psychological, and social wellbeing. It affects how people think, feel, and act.</p><p>Mental health conditions are common and include depression, anxiety, bipolar disorder, and schizophrenia.</p><p>Good mental health involves coping with stress, maintaining healthy relationships, and making sound decisions.</p>",
    questions: [
      { question: "What is mental health?", options: ["Emotional, psychological, and social wellbeing", "Physical wellbeing", "Financial wellbeing", "Social status"], correct: 0 },
      { question: "Which of these is a common mental health condition?", options: ["Depression", "Diabetes", "Arthritis", "Asthma"], correct: 0 },
      { question: "What does good mental health involve?", options: ["Coping with stress", "Avoiding all stress", "Ignoring problems", "Isolating from others"], correct: 0 }
    ]
  },

  // ============================================
  // 🌍 GEOGRAPHY
  // ============================================
  {
    id: 18,
    title: "World Geography: Continents and Oceans",
    category: "Geography",
    subcategory: "Physical Geography",
    icon: "🌍",
    difficulty: "Easy",
    estimatedTime: "6 min read",
    content: "<h3>World Geography: Continents and Oceans</h3><p>The Earth's surface is divided into seven continents and five oceans. The continents are Africa, Antarctica, Asia, Europe, North America, Australia, and South America.</p><p>Asia is the largest continent by both land area and population. Africa is the second largest continent.</p><p>The Pacific Ocean is the largest and deepest ocean, covering more than 30% of the Earth's surface.</p>",
    questions: [
      { question: "How many continents are there?", options: ["7", "5", "6", "8"], correct: 0 },
      { question: "Which is the largest continent?", options: ["Asia", "Africa", "North America", "Europe"], correct: 0 },
      { question: "Which ocean is the largest?", options: ["Pacific", "Atlantic", "Indian", "Southern"], correct: 0 }
    ]
  },

  // ============================================
  // 🎨 ARTS & ENTERTAINMENT
  // ============================================
  {
    id: 19,
    title: "The History of Cinema",
    category: "Arts & Entertainment",
    subcategory: "Film",
    icon: "🎬",
    difficulty: "Medium",
    estimatedTime: "8 min read",
    content: "<h3>The History of Cinema</h3><p>The history of cinema began in the late 19th century with the invention of the picture camera. The first films were short, silent, and simple.</p><p>In the 1920s, sound was introduced to films, revolutionizing the industry and leading to the 'Golden Age of Hollywood.'</p><p>Today, cinema is a powerful form of storytelling that reaches audiences around the world.</p>",
    questions: [
      { question: "When did the history of cinema begin?", options: ["19th century", "18th century", "20th century", "17th century"], correct: 0 },
      { question: "What was introduced to films in the 1920s?", options: ["Sound", "Color", "Digital", "Animation"], correct: 0 },
      { question: "Which era is known for iconic films and stars?", options: ["Golden Age of Hollywood", "Silent Era", "Modern Era", "Digital Era"], correct: 0 }
    ]
  },

  // ============================================
  // 🏀 SPORTS
  // ============================================
  {
    id: 20,
    title: "The History of the Olympic Games",
    category: "Sports",
    subcategory: "Olympics",
    icon: "🏅",
    difficulty: "Medium",
    estimatedTime: "7 min read",
    content: "<h3>The History of the Olympic Games</h3><p>The Olympic Games are a major international multi-sport event that takes place every four years. The modern Olympic Games were inspired by the ancient Olympic Games in Greece.</p><p>The ancient Olympic Games were held in Olympia and featured events like running, wrestling, and chariot racing.</p><p>The modern Olympic Games were revived in 1896 by Pierre de Coubertin.</p>",
    questions: [
      { question: "Where were the ancient Olympic Games held?", options: ["Greece", "Rome", "Egypt", "Turkey"], correct: 0 },
      { question: "When were the modern Olympic Games revived?", options: ["1896", "1900", "1888", "1910"], correct: 0 },
      { question: "How often do the Olympic Games take place?", options: ["Every four years", "Every two years", "Every year", "Every five years"], correct: 0 }
    ]
  },

  // ============================================
  // 🧠 PHILOSOPHY
  // ============================================
  {
    id: 21,
    title: "Introduction to Philosophy",
    category: "Philosophy",
    subcategory: "Western Philosophy",
    icon: "💡",
    difficulty: "Hard",
    estimatedTime: "9 min read",
    content: "<h3>Introduction to Philosophy</h3><p>Philosophy is the study of fundamental questions about existence, knowledge, values, reason, mind, and language.</p><p>The ancient Greek philosophers laid the foundation for Western philosophy. Socrates developed the Socratic method, Plato explored reality, and Aristotle made contributions to logic and ethics.</p><p>Philosophy is divided into several branches: metaphysics (study of reality), epistemology (study of knowledge), ethics (study of right and wrong), and logic (study of reasoning).</p>",
    questions: [
      { question: "What is philosophy?", options: ["Study of fundamental questions", "Study of science", "Study of art", "Study of technology"], correct: 0 },
      { question: "Which ancient Greeks laid the foundation for Western philosophy?", options: ["Socrates, Plato, Aristotle", "Homer, Sophocles, Euripides", "Herodotus, Thucydides, Xenophon", "Ptolemy, Archimedes, Euclid"], correct: 0 },
      { question: "What is metaphysics?", options: ["Study of reality", "Study of knowledge", "Study of right and wrong", "Study of reasoning"], correct: 0 }
    ]
  },

  // ============================================
  // 🌿 NATURE & ENVIRONMENT
  // ============================================
  {
    id: 22,
    title: "Biodiversity and Conservation",
    category: "Nature",
    subcategory: "Biodiversity",
    icon: "🌿",
    difficulty: "Medium",
    estimatedTime: "7 min read",
    content: "<h3>Biodiversity and Conservation</h3><p>Biodiversity refers to the variety of life on Earth, including all species of plants, animals, and microorganisms, as well as the ecosystems they form.</p><p>Conservation is the protection and preservation of biodiversity. It involves efforts to protect species, habitats, and ecosystems from threats.</p><p>Human activities have led to a significant loss of biodiversity, with many species facing extinction.</p>",
    questions: [
      { question: "What is biodiversity?", options: ["Variety of life on Earth", "The number of humans on Earth", "The size of forests", "The amount of water"], correct: 0 },
      { question: "What is conservation?", options: ["Protection and preservation of biodiversity", "The destruction of nature", "Building cities", "Climate change"], correct: 0 },
      { question: "What has led to a significant loss of biodiversity?", options: ["Human activities", "Natural disasters", "Volcanic eruptions", "Solar radiation"], correct: 0 }
    ]
  },

  // ============================================
  // 🧠 PSYCHOLOGY
  // ============================================
  {
    id: 23,
    title: "Introduction to Psychology",
    category: "Psychology",
    subcategory: "General Psychology",
    icon: "🧠",
    difficulty: "Medium",
    estimatedTime: "8 min read",
    content: "<h3>Introduction to Psychology</h3><p>Psychology is the scientific study of the human mind and behavior. It encompasses a wide range of topics, including emotions, cognition, development, and social interactions.</p><p>There are several major schools of thought in psychology, including psychoanalysis, behaviorism, and humanistic psychology.</p><p>Understanding psychology can help us understand ourselves and others better, and can improve our relationships and quality of life.</p>",
    questions: [
      { question: "What is psychology?", options: ["Scientific study of mind and behavior", "Study of the brain", "Study of emotions only", "Study of mental illness"], correct: 0 },
      { question: "Which is a school of thought in psychology?", options: ["Behaviorism", "Biology", "Chemistry", "Physics"], correct: 0 },
      { question: "What can psychology help us understand?", options: ["Ourselves and others", "Only ourselves", "Only others", "Only animals"], correct: 0 }
    ]
  },

  // ============================================
  // 🌱 AGRICULTURE (More)
  // ============================================
  {
    id: 24,
    title: "Modern Farming Technologies",
    category: "Agriculture",
    subcategory: "AgriTech",
    icon: "🚜",
    difficulty: "Medium",
    estimatedTime: "7 min read",
    content: "<h3>Modern Farming Technologies</h3><p>Modern agriculture has been transformed by technology. Precision farming uses GPS, sensors, and data analytics to optimize crop production.</p><p>Drones are used in agriculture for crop monitoring, spraying, and mapping. They provide real-time data on crop health and soil conditions.</p><p>Automated irrigation systems use sensors to determine when and how much to water crops, saving water and improving yields.</p>",
    questions: [
      { question: "What does precision farming use?", options: ["GPS and sensors", "Only tractors", "Only fertilizers", "Only irrigation"], correct: 0 },
      { question: "What are drones used for in agriculture?", options: ["Crop monitoring", "Planting seeds", "Harvesting", "Packaging"], correct: 0 },
      { question: "What do automated irrigation systems use?", options: ["Sensors", "Rain", "Wind", "Sunlight"], correct: 0 }
    ]
  }
];

export default readingMaterials;
