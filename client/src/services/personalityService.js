import { supabase } from './supabase';

export const personalityService = {
  // Check if user has taken personality quiz
  hasTakenPersonality: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('personality_results')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking personality:', error);
      return false;
    }
  },

  // Get personality result
  getPersonalityResult: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('personality_results')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting personality:', error);
      return null;
    }
  },

  // Save personality result
  savePersonalityResult: async (userId, resultType, answers, scores) => {
    try {
      const { data, error } = await supabase
        .from('personality_results')
        .insert({
          user_id: userId,
          result_type: resultType,
          answers: answers,
          scores: scores,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving personality:', error);
      return null;
    }
  },

  // Get user's quiz count (to know if they're "new")
  getQuizCount: async (userId) => {
    try {
      const { count, error } = await supabase
        .from('quiz_results')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting quiz count:', error);
      return 0;
    }
  },

  // Should show personality prompt?
  shouldShowPrompt: async (userId) => {
    if (!userId) return false;

    // Check if already taken
    const hasTaken = await personalityService.hasTakenPersonality(userId);
    if (hasTaken) return false;

    // Check if user has at least 1 quiz (not brand new)
    const quizCount = await personalityService.getQuizCount(userId);
    if (quizCount < 1) return false;

    return true;
  }
};

export default personalityService;
