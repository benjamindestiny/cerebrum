// src/utils/helpers.js

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const decodeHTML = (html) => {
  if (!html) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

export const getScoreMessage = (score) => {
  if (score >= 90) return { label: 'Outstanding! 🏆', color: 'text-teal-400' };
  if (score >= 70) return { label: 'Great Job! 🌟', color: 'text-[#00C9A7]' };
  if (score >= 50) return { label: 'Good Effort! 💪', color: 'text-[#2A1535]' };
  return { label: 'Keep Learning! 📚', color: 'text-gray-400' };
};
