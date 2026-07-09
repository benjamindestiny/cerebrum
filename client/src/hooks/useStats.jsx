import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useStats = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    activeLearners: 0,
    categories: 0,
    quizzesTaken: 0,
    totalPoints: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total questions from quiz_results
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_results')
        .select('id');

      if (!quizError) {
        const totalQuestions = quizData?.length || 0;
        setStats(prev => ({ ...prev, totalQuestions }));
      }

      // Get total users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id');

      if (!usersError) {
        setStats(prev => ({ ...prev, activeLearners: usersData?.length || 0 }));
      }

      // Get categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id');

      if (!categoriesError) {
        setStats(prev => ({ ...prev, categories: categoriesData?.length || 50 }));
      }

      // Get total quizzes taken
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quiz_results')
        .select('id');

      if (!quizzesError) {
        setStats(prev => ({ ...prev, quizzesTaken: quizzesData?.length || 0 }));
      }

      // Get total points from all users
      const { data: pointsData, error: pointsError } = await supabase
        .from('users')
        .select('stats');

      if (!pointsError && pointsData) {
        let totalPoints = 0;
        pointsData.forEach(user => {
          totalPoints += user.stats?.total_points || 0;
        });
        setStats(prev => ({ ...prev, totalPoints }));
      }

    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refreshStats: loadStats };
};
