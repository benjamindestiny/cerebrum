import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import personalityService from '../../services/personalityService';

const PersonalityPrompt = ({ userId }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkShouldShow = async () => {
      try {
        const shouldShow = await personalityService.shouldShowPrompt(userId);
        if (shouldShow) {
          // Show after 10 seconds
          setTimeout(() => {
            setShow(true);
          }, 10000);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking personality prompt:', error);
        setLoading(false);
      }
    };

    checkShouldShow();

    // Check again every 60 seconds
    const interval = setInterval(async () => {
      try {
        const shouldShow = await personalityService.shouldShowPrompt(userId);
        if (shouldShow && !show) {
          setShow(true);
        }
      } catch (error) {
        console.error('Error checking personality prompt:', error);
      }
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [userId, show]);

  const handleStart = () => {
    setShow(false);
    navigate('/personality');
  };

  const handleDismiss = () => {
    setShow(false);
    // Hide for 5 minutes
    setTimeout(() => {
      personalityService.shouldShowPrompt(userId).then((shouldShow) => {
        if (shouldShow) setShow(true);
      });
    }, 300000);
  };

  const handleRemindLater = () => {
    setShow(false);
    // Remind after 2 minutes
    setTimeout(() => {
      personalityService.shouldShowPrompt(userId).then((shouldShow) => {
        if (shouldShow) setShow(true);
      });
    }, 120000);
  };

  if (loading) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className="glass-card p-5 border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl flex-shrink-0">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  Discover Your Learning Style
                </h4>
                <p className="text-gray-400 text-xs mt-1">
                  Take our 2-minute quiz to find out what type of learner you are! 🧠
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <button
                    onClick={handleStart}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs flex items-center gap-1"
                  >
                    Take Quiz <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleRemindLater}
                    className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors text-xs"
                  >
                    Remind Later
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonalityPrompt;
