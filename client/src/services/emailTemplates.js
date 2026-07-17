// Email Templates for Cerebrum

export const emailTemplates = {
  // ============================================
  // "We Miss You" Campaign
  // ============================================
  weMissYou: (name, streak, points) => ({
    subject: `👋 We Miss You, ${name || 'Learner'}! Your Brain is Waiting!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background-color: #0C0C1A; color: #FFFFFF; padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; padding: 40px; border: 1px solid #2A2A2A; }
          .header { text-align: center; margin-bottom: 30px; }
          .brain-icon { font-size: 48px; display: inline-block; padding: 15px; background: #1E1E3A; border-radius: 50%; }
          h1 { color: #FFFFFF; margin-top: 20px; font-size: 28px; }
          .subtitle { color: #94A3B8; font-size: 16px; margin-top: 10px; }
          .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin: 30px 0; }
          .stat-card { background: #262626; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #3A3A3A; }
          .stat-number { font-size: 24px; font-weight: bold; color: #3B82F6; }
          .stat-label { font-size: 12px; color: #94A3B8; margin-top: 4px; }
          .cta-button { display: inline-block; background: #3B82F6; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .cta-button:hover { background: #2563EB; }
          .features { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
          .feature { background: #262626; padding: 12px; border-radius: 8px; font-size: 14px; color: #E2E8F0; }
          .feature-icon { margin-right: 8px; }
          .footer { text-align: center; margin-top: 30px; color: #64748B; font-size: 12px; border-top: 1px solid #2A2A2A; padding-top: 20px; }
          .unsubscribe { color: #64748B; text-decoration: underline; }
          @media (max-width: 480px) {
            .container { padding: 20px; }
            .stats-grid { grid-template-columns: 1fr 1fr; }
            .features { grid-template-columns: 1fr; }
            h1 { font-size: 22px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brain-icon">🧠</div>
            <h1>We Miss You, ${name || 'Learner'}! 👋</h1>
            <p class="subtitle">Your brain is waiting for a workout! Come back and challenge yourself.</p>
          </div>

          ${streak > 0 ? `
          <div style="background: #1E1E3A; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 20px; border: 1px solid #F59E0B/20;">
            <div style="font-size: 32px;">🔥</div>
            <div style="color: #F59E0B; font-weight: bold; font-size: 18px;">You had a ${streak}-day streak!</div>
            <div style="color: #94A3B8; font-size: 14px;">Don't let it go to waste. Come back and continue your streak!</div>
          </div>
          ` : ''}

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${points || 0}</div>
              <div class="stat-label">Points Earned</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${streak || 0}</div>
              <div class="stat-label">Day Streak</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">⚡</div>
              <div class="stat-label">Ready to Learn</div>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="https://cerebrum-three.vercel.app/dashboard" class="cta-button">🚀 Continue Learning</a>
          </div>

          <div class="features">
            <div class="feature"><span class="feature-icon">📝</span> Take Quizzes</div>
            <div class="feature"><span class="feature-icon">🧩</span> Solve Riddles</div>
            <div class="feature"><span class="feature-icon">📚</span> Read & Test</div>
            <div class="feature"><span class="feature-icon">🏆</span> Compete on Leaderboard</div>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <a href="https://cerebrum-three.vercel.app/categories" style="color: #60A5FA; text-decoration: none; font-size: 14px;">
              Browse Categories →
            </a>
          </div>

          <div class="footer">
            <p>Cerebrum - Your Brain Training Platform</p>
            <p style="margin-top: 8px;">
              <a href="#" class="unsubscribe">Unsubscribe</a> • 
              <a href="https://cerebrum-three.vercel.app/privacy" class="unsubscribe">Privacy Policy</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // ============================================
  // "New Features" Announcement
  // ============================================
  newFeatures: (name) => ({
    subject: `🚀 New Features on Cerebrum! Check Them Out!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background-color: #0C0C1A; color: #FFFFFF; padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; padding: 40px; border: 1px solid #2A2A2A; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #FFFFFF; font-size: 28px; }
          .feature-card { background: #262626; border-radius: 12px; padding: 16px; margin: 12px 0; border: 1px solid #3A3A3A; }
          .feature-title { font-size: 18px; font-weight: bold; color: #3B82F6; }
          .feature-desc { color: #94A3B8; font-size: 14px; margin-top: 4px; }
          .cta-button { display: inline-block; background: #3B82F6; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748B; font-size: 12px; border-top: 1px solid #2A2A2A; padding-top: 20px; }
          @media (max-width: 480px) { .container { padding: 20px; } h1 { font-size: 22px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 48px;">🚀</div>
            <h1>New Features on Cerebrum!</h1>
          </div>

          <p style="color: #94A3B8; font-size: 16px;">Hey ${name || 'Learner'}! We've been busy building awesome new features for you.</p>

          <div class="feature-card">
            <div class="feature-title">⚡ Quick Fire Mode</div>
            <div class="feature-desc">15-second questions for fast learning! Perfect for quick breaks.</div>
          </div>

          <div class="feature-card">
            <div class="feature-title">🧠 Brain Break Games</div>
            <div class="feature-desc">Speed Math, Memory Match, and Quick Trivia to refresh your mind.</div>
          </div>

          <div class="feature-card">
            <div class="feature-title">🔥 Streak Freeze</div>
            <div class="feature-desc">Never lose your streak again! Freeze your streak for 24 hours.</div>
          </div>

          <div style="text-align: center;">
            <a href="https://cerebrum-three.vercel.app/dashboard" class="cta-button">🎮 Try New Features</a>
          </div>

          <div class="footer">
            <p>Cerebrum - Your Brain Training Platform</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // ============================================
  // "Come Back" Challenge
  // ============================================
  comebackChallenge: (name) => ({
    subject: `🏆 Come Back Challenge: Win 100 Bonus Points!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background-color: #0C0C1A; color: #FFFFFF; padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; padding: 40px; border: 1px solid #2A2A2A; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #FFFFFF; font-size: 28px; }
          .challenge-box { background: #1E1E3A; border-radius: 12px; padding: 24px; text-align: center; border: 2px solid #F59E0B; margin: 20px 0; }
          .challenge-text { color: #F59E0B; font-size: 20px; font-weight: bold; }
          .cta-button { display: inline-block; background: #3B82F6; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748B; font-size: 12px; border-top: 1px solid #2A2A2A; padding-top: 20px; }
          @media (max-width: 480px) { .container { padding: 20px; } h1 { font-size: 22px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 48px;">🏆</div>
            <h1>Come Back Challenge!</h1>
          </div>

          <p style="color: #94A3B8; font-size: 16px;">Hey ${name || 'Learner'}! We challenge you to come back and earn <strong style="color: #F59E0B;">100 bonus points</strong>!</p>

          <div class="challenge-box">
            <div class="challenge-text">🎯 Complete 3 Quizzes Today</div>
            <div style="color: #94A3B8; margin-top: 8px;">and earn 100 bonus points!</div>
          </div>

          <div style="text-align: center;">
            <a href="https://cerebrum-three.vercel.app/categories" class="cta-button">🎯 Accept Challenge</a>
          </div>

          <div class="footer">
            <p>Cerebrum - Your Brain Training Platform</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // ============================================
  // "Missing You" Simple Version
  // ============================================
  simpleMissYou: (name) => ({
    subject: `🧠 ${name || 'Hey'}! Your Brain Misses You!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background-color: #0C0C1A; color: #FFFFFF; padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; padding: 40px; border: 1px solid #2A2A2A; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #FFFFFF; font-size: 28px; }
          .cta-button { display: inline-block; background: #3B82F6; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748B; font-size: 12px; border-top: 1px solid #2A2A2A; padding-top: 20px; }
          @media (max-width: 480px) { .container { padding: 20px; } h1 { font-size: 22px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 48px;">🧠</div>
            <h1>Your Brain Misses You!</h1>
            <p style="color: #94A3B8; font-size: 16px;">Come back and give your brain a workout!</p>
          </div>

          <div style="text-align: center;">
            <a href="https://cerebrum-three.vercel.app/dashboard" class="cta-button">👋 Come Back Now</a>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #64748B; font-size: 14px;">
            <p>🧩 Solve riddles • 📝 Take quizzes • 📚 Read & Test</p>
          </div>

          <div class="footer">
            <p>Cerebrum - Your Brain Training Platform</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),
};

export default emailTemplates;
