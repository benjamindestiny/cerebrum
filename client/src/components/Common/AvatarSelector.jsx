import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Check, User } from 'lucide-react';
import { defaultAvatars } from '../../data/avatars';

const AvatarSelector = ({ currentAvatar, onSelect, onClose }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || defaultAvatars[0]);
  const [activeTab, setActiveTab] = useState('avatar'); // 'avatar' or 'upload'

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    onSelect(avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Choose Avatar</h2>
            <p className="text-gray-400 text-sm">Select an avatar or upload your own</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'avatar'
                ? 'bg-[#7c3aed] text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Avatars
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'upload'
                ? 'bg-[#7c3aed] text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload Photo
          </button>
        </div>

        {/* Avatar Grid */}
        {activeTab === 'avatar' && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {defaultAvatars.map((avatar) => (
              <motion.button
                key={avatar.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAvatarSelect(avatar)}
                className={`relative w-full aspect-square rounded-xl transition-all duration-300 flex items-center justify-center text-3xl
                  ${selectedAvatar?.id === avatar.id 
                    ? 'ring-2 ring-[#7c3aed] ring-offset-2 ring-offset-[#1a1a2e] bg-[#7c3aed]/20' 
                    : 'hover:bg-white/5'
                  }`}
                style={{ backgroundColor: avatar.bg }}
              >
                <span>{avatar.emoji}</span>
                {selectedAvatar?.id === avatar.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#7c3aed] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="text-center py-8">
            <div className="w-24 h-24 rounded-full bg-[#2d2d5e] mx-auto mb-4 flex items-center justify-center">
              <Camera className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-400 mb-2">Upload your own profile photo</p>
            <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 2MB</p>
            <button className="btn-primary text-sm px-6 py-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Choose Photo
            </button>
          </div>
        )}

        {/* Selected Preview */}
        <div className="mt-6 pt-6 border-t border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: selectedAvatar?.bg || '#2d2d5e' }}
            >
              {selectedAvatar?.emoji || '🧠'}
            </div>
            <div>
              <div className="text-white font-medium">Selected</div>
              <div className="text-xs text-gray-400">Avatar will be displayed everywhere</div>
            </div>
          </div>
          <button
            onClick={() => handleAvatarSelect(selectedAvatar)}
            className="btn-primary text-sm px-4 py-2"
          >
            Apply Avatar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarSelector;
