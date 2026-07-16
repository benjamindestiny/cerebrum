// Default avatars for users
export const defaultAvatars = [
  { id: 1, emoji: '🧠', color: '#3B82F6', bg: '#3b1a6b' },
  { id: 2, emoji: '🚀', color: '#ec4899', bg: '#6b1a3a' },
  { id: 3, emoji: '🌟', color: '#f59e0b', bg: '#6b4a1a' },
  { id: 4, emoji: '🎯', color: '#10b981', bg: '#1a4a3a' },
  { id: 5, emoji: '💪', color: '#ef4444', bg: '#4a1a1a' },
  { id: 6, emoji: '🧙', color: '#3B82F6', bg: '#2a1a4a' },
  { id: 7, emoji: '🦊', color: '#f97316', bg: '#4a2a1a' },
  { id: 8, emoji: '🐉', color: '#06b6d4', bg: '#1a3a4a' },
  { id: 9, emoji: '🦅', color: '#3B82F6', bg: '#1a2a4a' },
  { id: 10, emoji: '🐺', color: '#6b7280', bg: '#2a2a2a' },
  { id: 11, emoji: '🦄', color: '#a855f7', bg: '#3a1a4a' },
  { id: 12, emoji: '🐼', color: '#4b5563', bg: '#1a1a1a' },
  { id: 13, emoji: '🦁', color: '#f59e0b', bg: '#4a3a1a' },
  { id: 14, emoji: '🐧', color: '#3B82F6', bg: '#1a2a3a' },
  { id: 15, emoji: '🐱', color: '#3B82F6', bg: '#2a1a3a' },
  { id: 16, emoji: '🐶', color: '#f97316', bg: '#3a2a1a' },
];

export const getAvatarById = (id) => {
  return defaultAvatars.find(a => a.id === id) || defaultAvatars[0];
};
