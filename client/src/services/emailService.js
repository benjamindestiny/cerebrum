import { supabase } from "./supabase";

// ============================================
// EMAIL SERVICE - SENDGRID FALLBACK
// ============================================

// Try SendGrid first, fallback to logging
const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY || "";
const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

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
    // Try SendGrid first
    if (SENDGRID_API_KEY && SENDGRID_API_KEY !== "") {
      console.log("📧 Sending via SendGrid to:", to);
      
      const response = await fetch(SENDGRID_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: "benjamindestiny449@gmail.com", name: "Cerebrum Team" },
          subject: subject,
          content: [{ type: "text/html", value: html }],
        }),
      });

      if (response.ok) {
        console.log(`✅ Email sent to ${to}`);
        return { success: true, method: 'sendgrid' };
      } else {
        const errorData = await response.json();
        console.error("❌ SendGrid Error:", errorData);
        
        // If SendGrid fails, fallback to logging
        console.log("📧 [FALLBACK] Email logged only:", { to, subject });
        return { success: true, fallback: true };
      }
    }

    // Fallback: Log it
    console.log("📧 [LOG MODE] Email would be sent:", { to, subject });
    return { success: true, fallback: true };

  } catch (error) {
    console.error("❌ Email service error:", error);
    return { success: true, fallback: true };
  }
};

export const sendBulkEmail = async ({ recipients, subject, body, variables = [] }) => {
  try {
    let sent = 0;

    for (const recipient of recipients) {
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

      const result = await sendEmail({
        to: recipient.email,
        subject: personalizedSubject,
        html: personalizedBody,
      });

      if (result.success) sent++;
    }

    return {
      success: true,
      sent,
      total: recipients.length,
    };
  } catch (error) {
    console.error("❌ Bulk email error:", error);
    return { success: false, error: error.message };
  }
};

export default {
  sendEmail,
  sendBulkEmail,
  emailTemplates,
};
