import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Snowflake, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { toast } from 'react-toastify';

const StreakFreeze = ({ userId, currentStreak }) => {
  const [freezes, setFreezes] = useState(0);
  const [lastFreezeDate, setLastFreezeDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [frozenStreakDate, setFrozenStreakDate] = useState(null);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    if (userId) {
      loadFreezeData();
    }
  }, [userId]);

  const loadFreezeData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('streak_freezes, last_freeze_date, frozen_streak_date, stats')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setFreezes(data?.streak_freezes || 0);
      setLastFreezeDate(data?.last_freeze_date);
      setFrozenStreakDate(data?.frozen_streak_date);

      const today = new Date().toISOString().split('T')[0];
      if (data?.frozen_streak_date === today) {
        setIsFrozen(true);
      }

    } catch (error) {
      console.error('Error loading freeze data:', error);
    }
  };

  const canFreezeToday = () => {
    if (!lastFreezeDate) return true;
    const now = new Date();
    const last = new Date(lastFreezeDate);
    const daysSinceLastFreeze = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    return daysSinceLastFreeze >= 30;
  };

  const handleFreezeStreak = async () => {
    if (loading) return;
    if (freezes <= 0) {
      toast.warning('❄️ No freezes available! Complete achievements to earn more.');
      return;
    }
    if (!canFreezeToday()) {
      const daysLeft = 30 - Math.floor((new Date() - new Date(lastFreezeDate)) / (1000 * 60 * 60 * 24));
      toast.warning(`❄️ Next freeze available in ${daysLeft} days`);
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('users')
        .update({
          streak_freezes: freezes - 1,
          last_freeze_date: new Date().toISOString(),
          frozen_streak_date: today
        })
        .eq('id', userId);

      if (error) throw error;

      setFreezes(prev => prev - 1);
      setIsFrozen(true);
      setLastFreezeDate(new Date().toISOString());

      toast.success('❄️ Streak frozen! Your streak is safe for today.');
      await loadFreezeData();

    } catch (error) {
      console.error('Error freezing streak:', error);
      toast.error('Failed to freeze streak. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilNextFreeze = () => {
    if (!lastFreezeDate) return 0;
    const now = new Date();
    const last = new Date(lastFreezeDate);
    const daysSince = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysSince);
  };

  const daysUntilNext = getDaysUntilNextFreeze();

  return (
    <div className="glass-card p-4 sm:p-6 border border-orange-500/20 bg-orange-500/5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {isFrozen ? (
              <div className="p-3 bg-blue-500/20 rounded-full border border-blue-500/30">
                <Snowflake className="w-6 h-6 text-[#2A1535]" />
              </div>
            ) : (
              <div className="p-3 bg-orange-500/20 rounded-full border border-orange-500/30">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
            )}
            {freezes > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {freezes}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base">
              {isFrozen ? '❄️ Streak Frozen Today' : 'Streak Protection'}
            </h4>
            <p className="text-gray-400 text-xs sm:text-sm">
              {isFrozen 
                ? 'Your streak is safe for today! Come back tomorrow to continue.'
                : `${freezes} freeze${freezes !== 1 ? 's' : ''} available`
              }
              {!isFrozen && freezes > 0 && ` • ${daysUntilNext > 0 ? `${daysUntilNext} days until next freeze` : 'Ready to freeze!'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isFrozen && (
            <button
              onClick={handleFreezeStreak}
              disabled={loading || freezes <= 0 || daysUntilNext > 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 w-full sm:w-auto justify-center
                ${loading || freezes <= 0 || daysUntilNext > 0
                  ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Snowflake className="w-4 h-4" />
                  Freeze Streak
                </>
              )}
            </button>
          )}
          {isFrozen && (
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
              <CheckCircle className="w-4 h-4" />
              Protected ✓
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {daysUntilNext > 0 ? `Next freeze in ${daysUntilNext} days` : 'Freeze available now'}
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#2A1535]" />
            Earn freezes through achievements
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-green-400" />
            Protects {currentStreak}-day streak
          </span>
        </div>
      </div>
    </div>
  );
};

export default StreakFreeze;
