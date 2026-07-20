import {
  Brain,
  Rocket,
  Sparkles,
  Target,
  Zap,
  Wand2,
  Shield,
  Flame,
  Crown,
  Star,
  Trophy,
  Sword,
  Compass,
  Gem,
  Feather,
  Sun,
} from 'lucide-react';

// 16 different avatars with Lucide icons
export const defaultAvatars = [
  { id: 1, icon: Brain, bg: "#7c3aed", label: "Brain" },
  { id: 2, icon: Rocket, bg: "#2563eb", label: "Rocket" },
  { id: 3, icon: Sparkles, bg: "#f59e0b", label: "Sparkles" },
  { id: 4, icon: Target, bg: "#ef4444", label: "Target" },
  { id: 5, icon: Zap, bg: "#22c55e", label: "Zap" },
  { id: 6, icon: Wand2, bg: "#8b5cf6", label: "Wand" },
  { id: 7, icon: Shield, bg: "#f97316", label: "Shield" },
  { id: 8, icon: Flame, bg: "#14b8a6", label: "Flame" },
  { id: 9, icon: Crown, bg: "#3b82f6", label: "Crown" },
  { id: 10, icon: Star, bg: "#6b7280", label: "Star" },
  { id: 11, icon: Trophy, bg: "#ec4899", label: "Trophy" },
  { id: 12, icon: Sword, bg: "#374151", label: "Sword" },
  { id: 13, icon: Compass, bg: "#d97706", label: "Compass" },
  { id: 14, icon: Gem, bg: "#1e293b", label: "Gem" },
  { id: 15, icon: Feather, bg: "#f43f5e", label: "Feather" },
  { id: 16, icon: Sun, bg: "#78350f", label: "Sun" },
];

// Get random avatar
export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[randomIndex];
};

export const getAvatarById = (id) => {
  return defaultAvatars.find(avatar => avatar.id === id) || defaultAvatars[0];
};

export const getAvatarIcon = (id) => {
  const avatar = getAvatarById(id);
  return avatar.icon || Brain;
};
