import { supabase } from './supabase';
import { riddles } from '../data/riddles';

export const riddleService = {
  // Get riddles with user progress
  getRiddles: async (userId) => {
    // Get user's progress
    const { data: progress, error: progressError } = await supabase
      .from('riddle_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (progressError) throw progressError;
    
    const progressMap = {};
    progress.forEach(p => {
      progressMap[p.riddle_id] = p;
    });
    
    // Combine riddles with progress
    return riddles.map(riddle => ({
      ...riddle,
      solved: progressMap[riddle.id]?.solved || false,
      attempts: progressMap[riddle.id]?.attempts || 0,
      solvedAt: progressMap[riddle.id]?.solved_at || null
    }));
  },

  // Solve a riddle
  solveRiddle: async (userId, riddleId, answer) => {
    const riddle = riddles.find(r => r.id === riddleId);
    if (!riddle) throw new Error('Riddle not found');
    
    // Check if already solved
    const { data: existing, error: checkError } = await supabase
      .from('riddle_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('riddle_id', riddleId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') throw checkError;
    
    if (existing && existing.solved) {
      return { solved: true, alreadySolved: true };
    }
    
    const isCorrect = answer.toLowerCase().trim() === riddle.answer.toLowerCase().trim();
    
    if (isCorrect) {
      // Update or insert progress
      const { data, error } = await supabase
        .from('riddle_progress')
        .upsert({
          user_id: userId,
          riddle_id: riddleId,
          solved: true,
          attempts: (existing?.attempts || 0) + 1,
          solved_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update user stats
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('stats')
        .eq('id', userId)
        .single();
      
      if (!userError && user) {
        const currentStats = user.stats || {};
        const updatedStats = {
          ...currentStats,
          riddles_solved: (currentStats.riddles_solved || 0) + 1,
          total_points: (currentStats.total_points || 0) + (riddle.points || 10)
        };
        
        await supabase
          .from('users')
          .update({ stats: updatedStats })
          .eq('id', userId);
      }
      
      return { solved: true, points: riddle.points };
    } else {
      // Update attempts
      const { data, error } = await supabase
        .from('riddle_progress')
        .upsert({
          user_id: userId,
          riddle_id: riddleId,
          solved: false,
          attempts: (existing?.attempts || 0) + 1
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return { solved: false };
    }
  },

  // Get riddle progress summary
  getProgress: async (userId) => {
    const { data, error } = await supabase
      .from('riddle_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    const solved = data.filter(p => p.solved).length;
    const total = riddles.length;
    
    return { solved, total, progress: data };
  }
};

export default riddleService;
