export const categories = [
  { id: 1, name: 'Technology', icon: '💻', color: 'text-[#3B82F6CC]', count: 45 },
  { id: 2, name: 'Programming', icon: '⌨️', color: 'text-purple-400', count: 35, parent: 1 },
  { id: 3, name: 'Science & Nature', icon: '🔬', color: 'text-green-400', count: 40 },
  { id: 4, name: 'Physics', icon: '⚛️', color: 'text-cyan-400', count: 20, parent: 3 },
  { id: 5, name: 'Chemistry', icon: '🧪', color: 'text-emerald-400', count: 15, parent: 3 },
  { id: 6, name: 'Biology', icon: '🧬', color: 'text-teal-400', count: 18, parent: 3 },
  { id: 7, name: 'History', icon: '📜', color: 'text-amber-400', count: 30 },
  { id: 8, name: 'World History', icon: '🌍', color: 'text-orange-400', count: 18, parent: 7 },
  { id: 9, name: 'Ancient Civilizations', icon: '🏛️', color: 'text-teal-400', count: 12, parent: 8 },
  { id: 10, name: 'Arts & Entertainment', icon: '🎨', color: 'text-pink-400', count: 35 },
  { id: 11, name: 'Music', icon: '🎵', color: 'text-rose-400', count: 15, parent: 10 },
  { id: 12, name: 'Film & TV', icon: '🎬', color: 'text-red-400', count: 12, parent: 10 },
  { id: 13, name: 'Literature', icon: '📚', color: 'text-indigo-400', count: 15 },
  { id: 14, name: 'Geography', icon: '🌍', color: 'text-sky-400', count: 25 },
  { id: 15, name: 'Countries', icon: '🗺️', color: 'text-[#14B8A6]', count: 15, parent: 14 },
  { id: 16, name: 'Capitals & Cities', icon: '🏙️', color: 'text-indigo-300', count: 10, parent: 14 },
  { id: 17, name: 'Sports', icon: '⚽', color: 'text-rose-400', count: 28 },
  { id: 18, name: 'Football', icon: '⚽', color: 'text-green-400', count: 12, parent: 17 },
  { id: 19, name: 'Basketball', icon: '🏀', color: 'text-orange-400', count: 8, parent: 17 },
  { id: 20, name: 'Medicine & Health', icon: '🏥', color: 'text-red-300', count: 20 },
  { id: 21, name: 'Psychology', icon: '🧠', color: 'text-purple-300', count: 18 },
  { id: 22, name: 'Business & Finance', icon: '💼', color: 'text-emerald-300', count: 22 },
  { id: 23, name: 'Politics & Government', icon: '🏛️', color: 'text-slate-400', count: 18 },
  { id: 24, name: 'Space & Astronomy', icon: '🌌', color: 'text-indigo-500', count: 16 },
  { id: 25, name: 'Mathematics', icon: '🧮', color: 'text-amber-300', count: 20 },
  { id: 26, name: 'Philosophy', icon: '📖', color: 'text-violet-400', count: 15 },
  { id: 27, name: 'Languages', icon: '🗣️', color: 'text-cyan-300', count: 18 },
  { id: 28, name: 'Gaming', icon: '🎮', color: 'text-fuchsia-400', count: 25 },
  { id: 29, name: 'Food & Cooking', icon: '🍳', color: 'text-amber-300', count: 16 },
  { id: 30, name: 'Nature & Environment', icon: '🌱', color: 'text-green-300', count: 14 },
  { id: 31, name: 'Mythology', icon: '🏺', color: 'text-amber-200', count: 12 },
  { id: 32, name: 'War & Military', icon: '⚔️', color: 'text-stone-400', count: 10 },
  { id: 33, name: 'Theater & Performing Arts', icon: '🎭', color: 'text-pink-300', count: 12 },
  { id: 34, name: 'General Knowledge', icon: '🧠', color: 'text-gray-400', count: 30 },
];

export const getCategoryById = (id) => {
  return categories.find(c => c.id === id);
};

export const getCategoriesByParent = (parentId) => {
  return categories.filter(c => c.parent === parentId);
};

export const getMainCategories = () => {
  return categories.filter(c => !c.parent);
};

export const getCategoryTree = () => {
  const main = getMainCategories();
  return main.map(cat => ({
    ...cat,
    children: getCategoriesByParent(cat.id)
  }));
};
