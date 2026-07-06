import { supabase } from './supabase';

export const quizService = {
  // Save quiz result
  saveQuizResult: async (userId, userName, quizData) => {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        user_name: userName,
        category: quizData.category,
        difficulty: quizData.difficulty,
        score: quizData.score,
        correct_answers: quizData.correctCount,
        total_questions: quizData.totalQuestions,
        time_taken: quizData.timeTaken,
        points: quizData.points || 0,
        questions: quizData.questions,
        answers: quizData.answers
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get quiz history
  getQuizHistory: async (userId, limit = 20) => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Get specific quiz result
  getQuizResult: async (resultId, userId) => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('id', resultId)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user stats
  getUserStats: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('stats')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data?.stats || {};
  }
};

export default quizService;
