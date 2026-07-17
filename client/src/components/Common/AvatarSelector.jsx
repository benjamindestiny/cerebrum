import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { defaultAvatars } from '../../data/avatars';

const AvatarSelector = ({ currentAvatar, onSelect, onClose }) => {
  const [selectedId, setSelectedId] = useState(currentAvatar?.id || 1);

  const handleSelect = (avatar) => {
    setSelectedId(avatar.id);
    onSelect(avatar);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Choose Your Avatar</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {defaultAvatars.map((avatar) => {
            const IconComponent = avatar.icon;
            const isSelected = selectedId === avatar.id;

            return (
              <button
                key={avatar.id}
                onClick={() => handleSelect(avatar)}
                className={`relative w-full aspect-square rounded-xl flex items-center justify-center transition-all
                  ${isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}
                `}
                style={{ backgroundColor: avatar.bg }}
              >
                <IconComponent className="w-8 h-8 text-white" />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="absolute bottom-1 text-[8px] text-white/70">
                  {avatar.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarSelector;
