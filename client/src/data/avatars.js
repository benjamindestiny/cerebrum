// Default Avatars - 16 different options
export const defaultAvatars = [
  { id: 1, emoji: "🧠", bg: "#7c3aed" },
  { id: 2, emoji: "🚀", bg: "#2563eb" },
  { id: 3, emoji: "🌟", bg: "#f59e0b" },
  { id: 4, emoji: "🎯", bg: "#ef4444" },
  { id: 5, emoji: "💪", bg: "#22c55e" },
  { id: 6, emoji: "🧙", bg: "#8b5cf6" },
  { id: 7, emoji: "🦊", bg: "#f97316" },
  { id: 8, emoji: "🐉", bg: "#14b8a6" },
  { id: 9, emoji: "🦅", bg: "#3b82f6" },
  { id: 10, emoji: "🐺", bg: "#6b7280" },
  { id: 11, emoji: "🦄", bg: "#ec4899" },
  { id: 12, emoji: "🐼", bg: "#374151" },
  { id: 13, emoji: "🦁", bg: "#d97706" },
  { id: 14, emoji: "🐧", bg: "#1e293b" },
  { id: 15, emoji: "🐱", bg: "#f43f5e" },
  { id: 16, emoji: "🐶", bg: "#78350f" },
];

// Get random avatar
export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[randomIndex];
};

export const getAvatarById = (id) => {
  return defaultAvatars.find(avatar => avatar.id === id) || defaultAvatars[0];
};
