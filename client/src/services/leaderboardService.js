import { supabase } from './supabase';

/**
 * Strict Leaderboard Calculation
 * Fair, balanced, and anti-cheese
 */

const MIN_QUIZZES_TO_RANK = 5;
const MAX_QUIZZES_TO_COUNT = 50; // Prevents grinding

export const calculateStrictRankScore = async (userId) => {
  try {
    // Get user data
    const { data: userData } = await supabase
      .from('users')
      .select('stats')
      .eq('id', userId)
      .single();

    const stats = userData?.stats || {};

    // Get quiz history (limited to last 50)
    const { data: quizzes } = await supabase
      .from('quiz_results')
      .select('percentage, difficulty, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(MAX_QUIZZES_TO_COUNT);

    if (!quizzes || quizzes.length < MIN_QUIZZES_TO_RANK) {
      return { rankScore: 0, isRanked: false, message: 'Need 5+ quizzes' };
    }

    // 1. Quality Score (Average Score) - 30% weight
    const avgScore = stats.average_score || 0;
    const qualityScore = (avgScore / 100) * 30;

    // 2. Volume Score - 30% weight
    const quizCount = Math.min(quizzes.length, MAX_QUIZZES_TO_COUNT);
    const volumeScore = (quizCount / MAX_QUIZZES_TO_COUNT) * 30;

    // 3. Consistency Score (Streak + Recency) - 20% weight
    const streak = stats.streak || 0;
    const streakScore = Math.min(streak / 30, 1) * 15;
    
    // Recency bonus: quizzes in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentQuizzes = quizzes.filter(q => 
      new Date(q.created_at) > thirtyDaysAgo
    );
    const recencyScore = Math.min(recentQuizzes.length / 10, 1) * 5;
    
    const consistencyScore = streakScore + recencyScore;

    // 4. Excellence Score (Perfect Scores) - 20% weight
    const perfectScores = stats.perfect_scores || 0;
    const excellenceScore = Math.min(perfectScores / 5, 1) * 20;

    // 5. Difficulty Bonus (Extra for hard quizzes)
    const hardQuizzes = quizzes.filter(q => q.difficulty === 'hard').length;
    const difficultyBonus = Math.min(hardQuizzes / 5, 1) * 10;

    // Total Score (max 100 + bonus)
    const totalScore = qualityScore + volumeScore + consistencyScore + excellenceScore + difficultyBonus;

    // Rank tier
    const tier = getRankTier(totalScore);

    return {
      rankScore: Math.round(Math.min(totalScore, 100)),
      isRanked: true,
      tier,
      details: {
        qualityScore: Math.round(qualityScore),
        volumeScore: Math.round(volumeScore),
        consistencyScore: Math.round(consistencyScore),
        excellenceScore: Math.round(excellenceScore),
        difficultyBonus: Math.round(difficultyBonus),
        quizCount,
        streak,
        perfectScores,
      }
    };

  } catch (error) {
    console.error('Error calculating rank score:', error);
    return { rankScore: 0, isRanked: false, error: error.message };
  }
};

const getRankTier = (score) => {
  if (score >= 90) return { 
    label: '🏆 Grandmaster', 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/10',
    emoji: '👑'
  };
  if (score >= 75) return { 
    label: '⭐ Elite', 
    color: 'text-purple-400', 
    bg: 'bg-purple-500/10',
    emoji: '⭐'
  };
  if (score >= 60) return { 
    label: '📈 Expert', 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10',
    emoji: '📈'
  };
  if (score >= 45) return { 
    label: '💪 Advanced', 
    color: 'text-green-400', 
    bg: 'bg-green-500/10',
    emoji: '💪'
  };
  if (score >= 30) return { 
    label: '🌱 Learner', 
    color: 'text-teal-400', 
    bg: 'bg-teal-500/10',
    emoji: '🌱'
  };
  return { 
    label: '🌀 Beginner', 
    color: 'text-gray-400', 
    bg: 'bg-gray-500/10',
    emoji: '🌀'
  };
};

export const getLeaderboard = async () => {
  try {
    // Get all users with stats
    const { data: users } = await supabase
      .from('users')
      .select('id, name, avatar_id, email, stats');

    if (!users) return [];

    // Calculate rank for each user
    const rankedUsers = [];
    for (const user of users) {
      const result = await calculateStrictRankScore(user.id);
      if (result.isRanked) {
        rankedUsers.push({
          ...user,
          rankScore: result.rankScore,
          tier: result.tier,
          details: result.details,
        });
      }
    }

    // Sort by rank score (highest first)
    rankedUsers.sort((a, b) => b.rankScore - a.rankScore);

    // Add ranks
    rankedUsers.forEach((user, index) => {
      user.rank = index + 1;
    });

    return rankedUsers;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

export default {
  calculateStrictRankScore,
  getLeaderboard,
  MIN_QUIZZES_TO_RANK,
};
