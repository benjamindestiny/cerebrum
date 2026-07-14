// services/emailService.js
import { supabase } from "./supabase";

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY || "";
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Email templates (default fallbacks)
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
      <a href="${import.meta.env.VITE_APP_URL}/categories" style="background: #7c3aed; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
        Start Learning
      </a>
    `,
  }),

  quizResults: (name, category, score, points) => ({
    subject: `📊 Your Quiz Results: ${category}`,
    html: `
      <h1>Quiz Results 🎯</h1>
      <p>Hi ${name},</p>
      <p>You scored <strong>${score}%</strong> on the "${category}" quiz!</p>
      <p>You earned <strong>${points} points</strong>.</p>
      <p>Keep up the great work!</p>
      <a href="${import.meta.env.VITE_APP_URL}/dashboard" style="background: #7c3aed; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
        View Dashboard
      </a>
    `,
  }),

  achievement: (name, achievement) => ({
    subject: `🏆 Achievement Unlocked: ${achievement}`,
    html: `
      <h1>🏆 Achievement Unlocked!</h1>
      <p>Congratulations ${name}!</p>
      <p>You've earned the <strong>${achievement}</strong> achievement.</p>
      <p>Keep going to unlock more achievements!</p>
      <a href="${import.meta.env.VITE_APP_URL}/profile" style="background: #7c3aed; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
        View Profile
      </a>
    `,
  }),
};

// ============================================
// SEND SINGLE EMAIL
// ============================================
export const sendEmail = async ({ to, subject, html, from = "Cerebrum" }) => {
  try {
    // Try Brevo first
    if (BREVO_API_KEY) {
      const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: "Cerebrum Team",
            email: "no-reply@cerebrum.app",
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html,
        }),
      });

      if (response.ok) {
        console.log(`✅ Email sent to ${to}`);
        return { success: true };
      }
    }

    // Fallback: Log the email
    console.log("📧 Email would be sent:", {
      to,
      subject,
      html,
    });
    console.log("ℹ️ Set BREVO_API_KEY in .env to send real emails");

    return { success: true, fallback: true };
  } catch (error) {
    console.error("❌ Email service error:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// SEND BULK EMAIL
// ============================================
export const sendBulkEmail = async ({ recipients, subject, body, variables = [] }) => {
  try {
    let sent = 0;
    let failed = 0;
    const results = [];

    // Process in batches of 50 to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const promises = batch.map(async (recipient) => {
        let personalizedBody = body;
        let personalizedSubject = subject;

        // Replace variables
        variables.forEach((varName) => {
          const value = recipient.data?.[varName] || 
                       recipient[varName] || 
                       `{{${varName}}}`;
          
          const regex = new RegExp(`{{${varName}}}`, "g");
          personalizedBody = personalizedBody.replace(regex, value);
          personalizedSubject = personalizedSubject.replace(regex, value);
        });

        // Also replace common variables
        personalizedBody = personalizedBody
          .replace(/{{name}}/g, recipient.name || "User")
          .replace(/{{email}}/g, recipient.email || "")
          .replace(/{{site_url}}/g, import.meta.env.VITE_APP_URL || "");

        personalizedSubject = personalizedSubject
          .replace(/{{name}}/g, recipient.name || "User")
          .replace(/{{site_url}}/g, import.meta.env.VITE_APP_URL || "");

        const result = await sendEmail({
          to: recipient.email,
          subject: personalizedSubject,
          html: personalizedBody,
        });

        if (result.success) {
          sent++;
        } else {
          failed++;
        }

        return { recipient: recipient.email, ...result };
      });

      const batchResults = await Promise.all(promises);
      results.push(...batchResults);

      // Small delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Log the sent emails
    await supabase.from("email_logs").insert({
      subject: subject,
      recipients: recipients.map((r) => r.email).join(", "),
      sent_count: sent,
      failed_count: failed,
      sent_at: new Date().toISOString(),
    });

    return {
      success: true,
      sent,
      failed,
      total: recipients.length,
      results,
    };
  } catch (error) {
    console.error("❌ Bulk email error:", error);
    return {
      success: false,
      error: error.message,
      sent: 0,
      failed: recipients.length,
      total: recipients.length,
    };
  }
};

// ============================================
// GET TEMPLATE FROM DATABASE
// ============================================
export const getTemplate = async (templateId) => {
  try {
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching template:", error);
    return null;
  }
};

// ============================================
// SAVE TEMPLATE
// ============================================
export const saveTemplate = async (template) => {
  try {
    const { data, error } = await supabase
      .from("email_templates")
      .upsert({
        ...template,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving template:", error);
    throw error;
  }
};

export default {
  sendEmail,
  sendBulkEmail,
  emailTemplates,
  getTemplate,
  saveTemplate,
};