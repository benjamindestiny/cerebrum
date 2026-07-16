import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4  text-white border-[#2A2A4A]">
      <div
        
        
        
        className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto  text-white border-[#2A2A4A]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6  text-white border-[#2A2A4A]">
          <div>
            <h2 className="text-2xl font-bold text-white  text-white border-[#2A2A4A]">Choose Avatar</h2>
            <p className="text-gray-400 text-sm  text-white border-[#2A2A4A]">Select an avatar or upload your own</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg /5 transition-colors  text-white border-[#2A2A4A]"
          >
            <X className="w-6 h-6 text-gray-400  text-white border-[#2A2A4A]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6  text-white border-[#2A2A4A]">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'avatar'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400  /15'
            }`}
          >
            <User className="w-4 h-4 inline mr-2  text-white border-[#2A2A4A]" />
            Avatars
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'upload'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400  /15'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2  text-white border-[#2A2A4A]" />
            Upload Photo
          </button>
        </div>

        {/* Avatar Grid */}
        {activeTab === 'avatar' && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3  text-white border-[#2A2A4A]">
            {defaultAvatars.map((avatar) => (
              <button
                key={avatar.id}
                
                
                onClick={() => handleAvatarSelect(avatar)}
                className={`relative w-full aspect-square rounded-xl transition-all  flex items-center justify-center text-3xl
                  ${selectedAvatar?.id === avatar.id 
                    ? 'ring-2 ring-[#3B82F6] ring-offset-2 ring-offset-[#1A1A1A] ' 
                    : '/5'
                  }`}
                style={{ backgroundColor: avatar.bg }}
              >
                <span>{avatar.emoji}</span>
                {selectedAvatar?.id === avatar.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center  text-white border-[#2A2A4A]">
                    <Check className="w-3 h-3 text-white  text-white border-[#2A2A4A]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="text-center py-8  text-white border-[#2A2A4A]">
            <div className="w-24 h-24 rounded-full bg-[#2d2d5e] mx-auto mb-4 flex items-center justify-center  text-white border-[#2A2A4A]">
              <Camera className="w-10 h-10 text-gray-500  text-white border-[#2A2A4A]" />
            </div>
            <p className="text-gray-400 mb-2  text-white border-[#2A2A4A]">Upload your own profile photo</p>
            <p className="text-xs text-gray-500 mb-4  text-white border-[#2A2A4A]">PNG, JPG up to 2MB</p>
            <button className="btn-primary text-sm px-6 py-2  text-white border-[#2A2A4A]">
              <Upload className="w-4 h-4 inline mr-2  text-white border-[#2A2A4A]" />
              Choose Photo
            </button>
          </div>
        )}

        {/* Selected Preview */}
        <div className="mt-6 pt-6 border-t border-gray-700/50 flex items-center justify-between  text-white border-[#2A2A4A]">
          <div className="flex items-center gap-3  text-white border-[#2A2A4A]">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl  text-white border-[#2A2A4A]"
              style={{ backgroundColor: selectedAvatar?.bg || '#2d2d5e' }}
            >
              {selectedAvatar?.emoji || '🧠'}
            </div>
            <div>
              <div className="text-white font-medium  text-white border-[#2A2A4A]">Selected</div>
              <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Avatar will be displayed everywhere</div>
            </div>
          </div>
          <button
            onClick={() => handleAvatarSelect(selectedAvatar)}
            className="btn-primary text-sm px-4 py-2  text-white border-[#2A2A4A]"
          >
            Apply Avatar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
