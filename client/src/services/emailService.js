const API_URL = '/api/send-email';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    const data = await response.json();
    console.log('✅ Email sent:', data);
    return data;
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
};

export const emailTemplates = {
  welcome: (name) => ({
    subject: '🎉 Welcome to Cerebrum!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f0f1a; color: #fff; border-radius: 12px;">
        <h1 style="color: #a78bfa;">🧠 Welcome to Cerebrum!</h1>
        <p>Hi ${name || 'Learner'},</p>
        <p>We're thrilled to have you join the Cerebrum community! 🎉</p>
        <p>Here's what you can do:</p>
        <ul style="color: #9ca3af;">
          <li>📚 Take quizzes in 50+ categories</li>
          <li>🏆 Compete on the leaderboard</li>
          <li>🧩 Solve daily riddles</li>
        </ul>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://cerebrum.app/dashboard" style="background: #7c3aed; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Start Learning
          </a>
        </div>
        <p style="color: #6b7280; font-size: 12px;">— The Cerebrum Team</p>
      </div>
    `,
  }),

  quizResults: (name, category, percentage, points) => ({
    subject: `📊 Your ${category} Quiz Results`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f0f1a; color: #fff; border-radius: 12px;">
        <h1 style="color: #a78bfa;">📊 Quiz Results</h1>
        <p>Hi ${name || 'Learner'},</p>
        <p>You scored <strong style="color: #7c3aed;">${percentage}%</strong> on <strong>${category}</strong>!</p>
        <p>You earned <strong style="color: #00C9A7;">${points} points</strong>.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://cerebrum.app/leaderboard" style="background: #7c3aed; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            View Leaderboard
          </a>
        </div>
        <p style="color: #6b7280; font-size: 12px;">Keep learning! 🚀</p>
      </div>
    `,
  }),
};

export default { sendEmail, emailTemplates };