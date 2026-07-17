import { supabase } from "./supabase";

// ============================================
// EMAIL SERVICE - LOGGING MODE
// ============================================

export const emailTemplates = {
  welcome: (name) => ({
    subject: "🎉 Welcome to Cerebrum!",
    html: `
      <h1>Welcome to Cerebrum, ${name}! 🧠</h1>
      <p>We're thrilled to have you join our community of learners.</p>
      <p>Here's what you can do:</p>
      <ul>
        <li>📝 Take quizzes on various topics</li>
        <li>🧩 Solve challenging riddles</li>
        <li>📚 Read educational articles</li>
        <li>🏆 Compete on the leaderboard</li>
      </ul>
      <p>Start your learning journey now!</p>
      <a href="${import.meta.env.VITE_APP_URL || 'https://cerebrum-three.vercel.app'}/categories" 
         style="background: #3B82F6; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
        Start Learning
      </a>
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        Happy learning,<br>The Cerebrum Team
      </p>
    `,
  }),
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📧 [LOG MODE] Email would be sent to:", to);
    console.log("📧 Subject:", subject);
    console.log("📧 Body preview:", html.substring(0, 100) + "...");

    // ✅ FIX: Use correct column name 'recipient_email'
    try {
      await supabase.from("email_logs").insert({
        recipient_email: to,
        subject: subject,
        body: html,
        status: "logged",
        sent_at: new Date().toISOString(),
      });
    } catch (dbError) {
      console.error("Error logging email to DB:", dbError);
      // If table doesn't exist, just log to console
      console.log("📧 Email logged to console only:", { to, subject });
    }

    return { success: true, logged: true };

  } catch (error) {
    console.error("❌ Email service error:", error);
    return { success: false, error: error.message };
  }
};

export const sendBulkEmail = async ({ recipients, subject, body, variables = [] }) => {
  try {
    let logged = 0;

    for (const recipient of recipients) {
      try {
        let personalizedBody = body;
        let personalizedSubject = subject;

        variables.forEach((varName) => {
          const value = recipient.data?.[varName] || recipient[varName] || `{{${varName}}}`;
          const regex = new RegExp(`{{${varName}}}`, "g");
          personalizedBody = personalizedBody.replace(regex, value);
          personalizedSubject = personalizedSubject.replace(regex, value);
        });

        personalizedBody = personalizedBody
          .replace(/{{name}}/g, recipient.name || "User")
          .replace(/{{email}}/g, recipient.email || "")
          .replace(/{{site_url}}/g, import.meta.env.VITE_APP_URL || "https://cerebrum-three.vercel.app");

        personalizedSubject = personalizedSubject
          .replace(/{{name}}/g, recipient.name || "User")
          .replace(/{{site_url}}/g, import.meta.env.VITE_APP_URL || "https://cerebrum-three.vercel.app");

        console.log(`📧 [LOG MODE] Email to ${recipient.email}: ${personalizedSubject}`);

        // ✅ FIX: Use correct column name 'recipient_email'
        try {
          await supabase.from("email_logs").insert({
            recipient_email: recipient.email,
            subject: personalizedSubject,
            body: personalizedBody,
            status: "logged",
            sent_at: new Date().toISOString(),
          });
        } catch (dbError) {
          console.error("Error logging email to DB:", dbError);
        }

        logged++;

      } catch (error) {
        console.error("Error logging email for:", recipient.email, error);
      }
    }

    return {
      success: true,
      logged,
      total: recipients.length,
      message: `✅ ${logged} emails logged`,
    };
  } catch (error) {
    console.error("❌ Bulk email error:", error);
    return {
      success: false,
      error: error.message,
      logged: 0,
      total: recipients.length,
    };
  }
};

export default {
  sendEmail,
  sendBulkEmail,
  emailTemplates,
};
