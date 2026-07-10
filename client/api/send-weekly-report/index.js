const brevo = require('@getbrevo/brevo');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret } = req.body;
  if (secret !== process.env.BULK_EMAIL_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Get all users with their stats
    const response = await fetch(`${supabaseUrl}/rest/v1/users?select=id,name,email,stats,created_at`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch users');
    const users = await response.json();

    // Get quiz results for all users
    const quizResponse = await fetch(`${supabaseUrl}/rest/v1/quiz_results?select=user_id,percentage,points,created_at`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    const quizResults = quizResponse.ok ? await quizResponse.json() : [];

    // Group quiz results by user
    const userQuizMap = {};
    quizResults.forEach(q => {
      if (!userQuizMap[q.user_id]) userQuizMap[q.user_id] = [];
      userQuizMap[q.user_id].push(q);
    });

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    let sentCount = 0;
    let errors = [];

    // Send weekly report to each user
    for (const user of users) {
      if (!user.email) continue;

      const userQuizzes = userQuizMap[user.id] || [];
      const totalQuizzes = userQuizzes.length;
      const avgScore = totalQuizzes > 0 ? Math.round(userQuizzes.reduce((s, q) => s + q.percentage, 0) / totalQuizzes) : 0;
      const totalPoints = userQuizzes.reduce((s, q) => s + (q.points || 0), 0);
      const bestScore = totalQuizzes > 0 ? Math.max(...userQuizzes.map(q => q.percentage)) : 0;
      const recentQuizzes = userQuizzes.slice(0, 3);

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f0f1a; color: #fff; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px;">🧠</div>
            <h1 style="color: #a78bfa;">Your Weekly Cerebrum Report</h1>
            <p style="color: #9ca3af;">${new Date().toLocaleDateString()}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
            <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #7c3aed;">${totalQuizzes}</div>
              <div style="color: #6b7280; font-size: 12px;">Quizzes Taken</div>
            </div>
            <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #00C9A7;">${avgScore}%</div>
              <div style="color: #6b7280; font-size: 12px;">Avg Score</div>
            </div>
            <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #fbbf24;">${totalPoints}</div>
              <div style="color: #6b7280; font-size: 12px;">Total Points</div>
            </div>
          </div>

          ${bestScore > 0 ? `
            <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0;">🏆 Best Score</p>
              <p style="font-size: 28px; font-weight: bold; color: #fbbf24; margin: 5px 0;">${bestScore}%</p>
            </div>
          ` : ''}

          ${recentQuizzes.length > 0 ? `
            <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #9ca3af; margin: 0 0 10px 0; font-weight: bold;">📊 Recent Activity</p>
              ${recentQuizzes.map(q => `
                <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #2d2d44;">
                  <span style="color: #d1d5db; font-size: 14px;">${q.category || 'Quiz'}</span>
                  <span style="color: ${q.percentage >= 70 ? '#00C9A7' : '#fbbf24'}; font-size: 14px; font-weight: bold;">${q.percentage}%</span>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <p style="color: #9ca3af;">You haven't taken any quizzes yet this week.</p>
              <p style="color: #6b7280; font-size: 14px;">Start your learning journey today! 🚀</p>
            </div>
          `}

          <div style="text-align: center; margin: 20px 0;">
            <a href="https://cerebrum.vercel.app/dashboard" 
               style="background: #7c3aed; color: #fff; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">
              🚀 Continue Learning
            </a>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <a href="https://cerebrum.vercel.app/leaderboard" 
               style="color: #7c3aed; text-decoration: none; font-size: 14px; margin: 0 10px;">
              📊 Leaderboard
            </a>
            <a href="https://cerebrum.vercel.app/categories" 
               style="color: #7c3aed; text-decoration: none; font-size: 14px; margin: 0 10px;">
              📚 Categories
            </a>
          </div>

          <div style="border-top: 1px solid #374151; padding-top: 20px; color: #6b7280; font-size: 12px; text-align: center;">
            <p>You're receiving this weekly report because you're a Cerebrum member.</p>
            <p>© 2024 Cerebrum. All rights reserved.</p>
          </div>
        </div>
      `;

      try {
        await apiInstance.sendTransacEmail({
          sender: { email: 'test@brevosend.com', name: 'Cerebrum' },
          to: [{ email: user.email }],
          subject: `📊 Your Weekly Cerebrum Report - ${new Date().toLocaleDateString()}`,
          htmlContent: emailHtml,
        });
        sentCount++;
      } catch (error) {
        errors.push({ email: user.email, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      sentCount,
      errors,
    });

  } catch (error) {
    console.error('Weekly report error:', error);
    res.status(500).json({ error: error.message });
  }
}