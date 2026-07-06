import { supabase } from './supabase';

export const leaderboardService = {
  // Get global leaderboard
  getLeaderboard: async (timeFrame = 'all', limit = 20) => {
    let query = supabase
      .from('quiz_results')
      .select('user_id, user_name, score, points, created_at');
    
    // Time frame filter
    if (timeFrame !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (timeFrame) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          break;
      }
      
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(1000);
    
    if (error) throw error;
    
    // Aggregate scores by user
    const userScores = {};
    data.forEach(record => {
      if (!userScores[record.user_id]) {
        userScores[record.user_id] = {
          userId: record.user_id,
          userName: record.user_name,
          totalScore: 0,
          quizCount: 0,
          bestScore: 0,
          totalPoints: 0
        };
      }
      
      const user = userScores[record.user_id];
      user.totalScore += record.score;
      user.quizCount += 1;
      user.bestScore = Math.max(user.bestScore, record.score);
      user.totalPoints += (record.points || 0);
    });
    
    // Calculate averages and sort
    const leaderboard = Object.values(userScores).map(user => ({
      ...user,
      averageScore: Math.round(user.totalScore / user.quizCount)
    }));
    
    leaderboard.sort((a, b) => b.averageScore - a.averageScore);
    
    // Get user details from users table
    const userIds = leaderboard.slice(0, limit).map(u => u.userId);
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .in('id', userIds);
      
      if (!usersError) {
        const userMap = {};
        users.forEach(u => {
          userMap[u.id] = u;
        });
        
        return leaderboard.slice(0, limit).map((u, index) => ({
          rank: index + 1,
          ...u,
          name: userMap[u.userId]?.name || u.userName,
          avatar: userMap[u.userId]?.avatar_url || ''
        }));
      }
    }
    
    return leaderboard.slice(0, limit).map((u, index) => ({
      rank: index + 1,
      ...u,
      avatar: ''
    }));
  },

  // Get category-specific leaderboard
  getCategoryLeaderboard: async (categoryId, limit = 20) => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('user_id, user_name, score, points, category')
      .eq('category->>id', categoryId.toString())
      .order('score', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Get user names
    const userIds = data.map(r => r.user_id);
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .in('id', userIds);
      
      if (!usersError) {
        const userMap = {};
        users.forEach(u => {
          userMap[u.id] = u;
        });
        
        return data.map((record, index) => ({
          rank: index + 1,
          userId: record.user_id,
          name: userMap[record.user_id]?.name || record.user_name,
          score: record.score,
          points: record.points || 0,
          avatar: userMap[record.user_id]?.avatar_url || ''
        }));
      }
    }
    
    return data.map((record, index) => ({
      rank: index + 1,
      userId: record.user_id,
      name: record.user_name,
      score: record.score,
      points: record.points || 0
    }));
  }
};

export default leaderboardService;
