const brevo = require("@getbrevo/brevo");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Security: Only allow if secret key matches
  const { secret } = req.body;
  if (secret !== process.env.BULK_EMAIL_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get all users from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch users");

    const users = await response.json();
    const activeUsers = users.filter(
      (u) => u.email && !u.email.includes("test"),
    );

    // Initialize Brevo
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );

    // Create email template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f0f1a; color: #fff; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px;">🧠</div>
          <h1 style="color: #a78bfa;">Cerebrum</h1>
          <p style="color: #9ca3af;">Test your knowledge. Compete with friends.</p>
        </div>

        <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #fff;">🏆 Challenge Yourself!</h2>
          <p style="color: #d1d5db;">We've added new quizzes and features. Come test your knowledge!</p>
          <ul style="color: #9ca3af; padding-left: 20px;">
            <li>📚 50+ categories to explore</li>
            <li>🏅 Earn points and climb the leaderboard</li>
            <li>🧩 Daily riddles and challenges</li>
            <li>📊 Track your progress</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://cerebrum.vercel.app/dashboard" 
             style="background: #7c3aed; color: #fff; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">
            🚀 Start Learning Now
          </a>
        </div>

        <div style="border-top: 1px solid #374151; padding-top: 20px; color: #6b7280; font-size: 12px; text-align: center;">
          <p>You're receiving this because you're a Cerebrum member.</p>
          <p>© 2024 Cerebrum. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send emails in batches (Brevo free tier: 300/day)
    const batchSize = 50;
    let sentCount = 0;
    let errors = [];

    for (let i = 0; i < activeUsers.length; i += batchSize) {
      const batch = activeUsers.slice(i, i + batchSize);

      for (const user of batch) {
        try {
          await apiInstance.sendTransacEmail({
            sender: { email: "test@brevosend.com", name: "Cerebrum" },
            to: [{ email: user.email }],
            subject: "🧠 Test Your Knowledge on Cerebrum!",
            htmlContent: emailHtml,
          });
          sentCount++;
          console.log(`✅ Email sent to: ${user.email}`);
        } catch (error) {
          errors.push({ email: user.email, error: error.message });
          console.error(`❌ Failed to send to ${user.email}:`, error.message);
        }
      }

      // Wait a bit between batches to avoid rate limits
      if (i + batchSize < activeUsers.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    res.status(200).json({
      success: true,
      totalUsers: activeUsers.length,
      sentCount,
      errors,
    });
  } catch (error) {
    console.error("Bulk email error:", error);
    res.status(500).json({ error: error.message });
  }
}
