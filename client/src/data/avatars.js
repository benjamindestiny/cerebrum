// Default Avatars - 16 different animal/fun emojis
export const defaultAvatars = [
  { id: 1, emoji: "🧠", bg: "#7c3aed", label: "Brain" },
  { id: 2, emoji: "🦊", bg: "#f97316", label: "Fox" },
  { id: 3, emoji: "🐉", bg: "#14b8a6", label: "Dragon" },
  { id: 4, emoji: "🦅", bg: "#3b82f6", label: "Eagle" },
  { id: 5, emoji: "🐺", bg: "#6b7280", label: "Wolf" },
  { id: 6, emoji: "🦄", bg: "#ec4899", label: "Unicorn" },
  { id: 7, emoji: "🐼", bg: "#374151", label: "Panda" },
  { id: 8, emoji: "🦁", bg: "#d97706", label: "Lion" },
  { id: 9, emoji: "🐧", bg: "#1e293b", label: "Penguin" },
  { id: 10, emoji: "🐱", bg: "#f43f5e", label: "Cat" },
  { id: 11, emoji: "🐶", bg: "#78350f", label: "Dog" },
  { id: 12, emoji: "🦋", bg: "#8b5cf6", label: "Butterfly" },
  { id: 13, emoji: "🦉", bg: "#4b5563", label: "Owl" },
  { id: 14, emoji: "🐨", bg: "#64748b", label: "Koala" },
  { id: 15, emoji: "🦦", bg: "#78716c", label: "Otter" },
  { id: 16, emoji: "🐘", bg: "#44403c", label: "Elephant" },
];

// Get random avatar
export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[randomIndex];
};

export const getAvatarById = (id) => {
  return defaultAvatars.find(avatar => avatar.id === id) || defaultAvatars[0];
};
