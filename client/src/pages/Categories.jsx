import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderTree, ChevronRight, ChevronDown, 
  Brain, Code, Globe, BookOpen, Music, 
  FlaskConical, Laptop, 
  Landmark, Palette, 
  Star, Sparkles, Trophy, Award, Target,
  Users, Zap, Clock, Medal, Crown
} from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();
  const [expandedIds, setExpandedIds] = useState(new Set());

  const categoryTree = [
    {
      id: 1,
      name: 'Technology',
      icon: Laptop,
      color: 'text-blue-400',
      children: [
        {
          id: 11,
          name: 'Programming',
          icon: Code,
          color: 'text-purple-400',
          children: [
            { id: 111, name: 'JavaScript', icon: Star, color: 'text-yellow-400' },
            { id: 112, name: 'Python', icon: Star, color: 'text-green-400' },
            { id: 113, name: 'React', icon: Star, color: 'text-cyan-400' },
          ]
        },
        {
          id: 12,
          name: 'AI & Machine Learning',
          icon: Brain,
          color: 'text-[#6C2BD9]',
          children: [
            { id: 121, name: 'Deep Learning', icon: Target, color: 'text-pink-400' },
            { id: 122, name: 'NLP', icon: BookOpen, color: 'text-indigo-400' },
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Science',
      icon: FlaskConical,
      color: 'text-green-400',
      children: [
        {
          id: 21,
          name: 'Physics',
          icon: Globe,
          color: 'text-cyan-400',
          children: [
            { id: 211, name: 'Mechanics', icon: Target, color: 'text-blue-400' },
            { id: 212, name: 'Quantum Physics', icon: Sparkles, color: 'text-purple-400' },
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'History',
      icon: Landmark,
      color: 'text-amber-400',
      children: [
        {
          id: 31,
          name: 'World History',
          icon: Globe,
          color: 'text-orange-400',
          children: [
            { id: 311, name: 'Ancient Civilizations', icon: Award, color: 'text-yellow-400' },
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Arts',
      icon: Palette,
      color: 'text-pink-400',
      children: [
        {
          id: 41,
          name: 'Music',
          icon: Music,
          color: 'text-purple-400',
          children: [
            { id: 411, name: 'Classical', icon: Star, color: 'text-amber-400' },
          ]
        }
      ]
    },
    {
      id: 5,
      name: 'Sports',
      icon: Trophy,
      color: 'text-rose-400',
      children: [
        {
          id: 51,
          name: 'Football',
          icon: Globe,
          color: 'text-green-400',
          children: [
            { id: 511, name: 'World Cup', icon: Award, color: 'text-yellow-400' },
          ]
        }
      ]
    }
  ];

  const toggleExpand = (id) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  const renderCategory = (category, depth = 0) => {
    const hasChildren = category.children?.length > 0;
    const isExpanded = expandedIds.has(category.id);
    const Icon = category.icon;

    return (
      <div key={category.id} className="mb-1">
        <div 
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200
            hover:bg-white/5 group`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(category.id);
            } else {
              navigate('/quiz');
            }
          }}
        >
          {hasChildren && (
            <button className="text-gray-400 hover:text-white">
              {isExpanded ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </button>
          )}
          <Icon className={`w-5 h-5 ${category.color || 'text-gray-400'}`} />
          <span className="text-white font-medium text-sm">{category.name}</span>
          {hasChildren && (
            <span className="text-xs text-gray-500 ml-auto">
              {category.children.length} sub-categories
            </span>
          )}
          {!hasChildren && (
            <span className="text-xs text-gray-500 ml-auto flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-400" /> Quiz
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-4 border-l-2 border-white/5 pl-2">
            {category.children.map(child => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FolderTree className="w-8 h-8 text-[#6C2BD9]" />
            Category Explorer
          </h1>
          <p className="text-gray-400 mt-1">
            Browse categories like a file explorer - click any sub-category to start a quiz
          </p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#6C2BD9]" />
          <span className="text-sm text-gray-300">24 Categories</span>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="max-h-[600px] overflow-y-auto">
          {categoryTree.map(cat => renderCategory(cat))}
        </div>
      </div>

      <div className="glass-card p-6 bg-gradient-to-r from-[#6C2BD9]/10 to-[#8B5CF6]/10 border border-[#6C2BD9]/20">
        <div className="flex items-center gap-4">
          <Sparkles className="w-8 h-8 text-[#6C2BD9]" />
          <div>
            <h3 className="text-white font-semibold">Smart Category Explorer</h3>
            <p className="text-sm text-gray-400">
              Navigate through categories like a file tree. Click any sub-category to instantly start a quiz!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
