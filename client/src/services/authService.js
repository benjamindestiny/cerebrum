import { supabase } from './supabase';

export const authService = {
  // Sign up with email and password
  signUp: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Get user profile
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user stats
  updateStats: async (userId, statsData) => {
    // Get current stats
    const { data: user } = await supabase
      .from('users')
      .select('stats')
      .eq('id', userId)
      .single();
    
    if (!user) throw new Error('User not found');

    const currentStats = user.stats || {};
    const updatedStats = {
      total_quizzes: (currentStats.total_quizzes || 0) + (statsData.totalQuizzes || 0),
      total_correct: (currentStats.total_correct || 0) + (statsData.totalCorrect || 0),
      total_incorrect: (currentStats.total_incorrect || 0) + (statsData.totalIncorrect || 0),
      best_score: Math.max(currentStats.best_score || 0, statsData.bestScore || 0),
      average_score: 0, // Will be recalculated
      total_time: (currentStats.total_time || 0) + (statsData.totalTime || 0),
      total_points: (currentStats.total_points || 0) + (statsData.totalPoints || 0),
      riddles_solved: (currentStats.riddles_solved || 0) + (statsData.riddlesSolved || 0),
      read_articles: (currentStats.read_articles || 0) + (statsData.readArticles || 0),
      streak: statsData.streak || currentStats.streak || 0,
      longest_streak: Math.max(currentStats.longest_streak || 0, statsData.streak || 0)
    };

    // Calculate average score
    const totalQuizzes = updatedStats.total_quizzes || 1;
    const totalCorrect = updatedStats.total_correct || 0;
    const totalQuestions = totalCorrect + (updatedStats.total_incorrect || 0);
    updatedStats.average_score = totalQuestions > 0 
      ? Math.round((totalCorrect / totalQuestions) * 100) 
      : 0;

    const { data, error } = await supabase
      .from('users')
      .update({ stats: updatedStats, last_active: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update preferences
  updatePreferences: async (userId, preferences) => {
    const { data, error } = await supabase
      .from('users')
      .update({ preferences })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export default authService;
