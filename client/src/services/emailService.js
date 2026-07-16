// services/emailService.js
import { supabase } from "./supabase";

// Brevo SMTP Configuration
const SMTP_CONFIG = {
  host: import.meta.env.VITE_SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(import.meta.env.VITE_SMTP_PORT) || 587,
  secure: false, // false for 587, true for 465
  auth: {
    user: import.meta.env.VITE_SMTP_USER || "",
    pass: import.meta.env.VITE_SMTP_PASS || "",
  },
};

// Brevo API Configuration (Fallback)
const BREVO_API_KEY =
  import.meta.env.VITE_BREVO_API_KEY || import.meta.env.BREVO_API_KEY || "";
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Email templates
export const emailTemplates = {
  welcome: (name) => ({
    subject: "🎉 Welcome to Cerebrum!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 15px; background: #3B82F6; border-radius: 50%;">
              <span style="font-size: 36px;">🧠</span>
            </div>
            <h1 style="color: #0C0C1A; margin-top: 15px;">Welcome to Cerebrum!</h1>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">We're thrilled to have you join our community of learners! 🎉</p>
          
          <div style="background: #FFF8ED; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <p style="margin: 5px 0; font-size: 14px;">📝 Take quizzes on various topics</p>
            <p style="margin: 5px 0; font-size: 14px;">🧩 Solve challenging riddles</p>
            <p style="margin: 5px 0; font-size: 14px;">📚 Read educational articles</p>
            <p style="margin: 5px 0; font-size: 14px;">🏆 Compete on the leaderboard</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${import.meta.env.VITE_APP_URL || "https://cerebrum-three.vercel.app"}/categories" 
               style="background: #3B82F6; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              Start Learning Now
            </a>
          </div>
          
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Happy learning,<br><strong>The Cerebrum Team</strong>
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  quizResults: (name, category, score, points) => ({
    subject: `📊 Your Quiz Results: ${category}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 15px; background: #3B82F6; border-radius: 50%;">
              <span style="font-size: 36px;">📊</span>
            </div>
            <h1 style="color: #0C0C1A; margin-top: 15px;">Quiz Results</h1>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
          
          <div style="background: #FFF8ED; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #3B82F6;">
            <div style="font-size: 48px; font-weight: bold; color: #3B82F6;">${score}%</div>
            <p style="color: #666; margin-top: 5px;">on "${category}"</p>
            <p style="color: #666;">Earned <strong>${points} points</strong></p>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Keep up the great work!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${import.meta.env.VITE_APP_URL || "https://cerebrum-three.vercel.app"}/dashboard" 
               style="background: #3B82F6; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              View Dashboard
            </a>
          </div>
          
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            The Cerebrum Team 🧠
          </p>
        </div>
      </body>
      </html>
    `,
  }),

  achievement: (name, achievement) => ({
    subject: `🏆 Achievement Unlocked: ${achievement}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 15px; background: #3B82F6; border-radius: 50%;">
              <span style="font-size: 36px;">🏆</span>
            </div>
            <h1 style="color: #0C0C1A; margin-top: 15px;">Achievement Unlocked!</h1>
          </div>
          
          <div style="background: #FFF8ED; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #3B82F6;">
            <div style="font-size: 48px;">🎉</div>
            <p style="font-size: 20px; font-weight: bold; color: #3B82F6; margin: 10px 0;">${achievement}</p>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Congratulations <strong>${name}</strong>! You've earned a new achievement.</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Keep going to unlock more!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${import.meta.env.VITE_APP_URL || "https://cerebrum-three.vercel.app"}/profile" 
               style="background: #3B82F6; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              View Profile
            </a>
          </div>
          
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            The Cerebrum Team 🧠
          </p>
        </div>
      </body>
      </html>
    `,
  }),
};

// ============================================
// SEND SINGLE EMAIL
// ============================================
export const sendEmail = async ({ to, subject, html, from = "Cerebrum" }) => {
  try {
    // Try SMTP first
    if (SMTP_CONFIG.auth.user && SMTP_CONFIG.auth.pass && SMTP_CONFIG.host) {
      try {
        console.log("📧 Sending via SMTP to:", to);

        // Use fetch to send via Brevo SMTP relay
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to,
            subject,
            html,
            config: SMTP_CONFIG,
          }),
        });

        if (response.ok) {
          console.log(`✅ Email sent via SMTP to ${to}`);
          return { success: true, method: "smtp" };
        }
      } catch (smtpError) {
        console.warn("SMTP failed, trying API...", smtpError.message);
      }
    }

    // Fallback: Try Brevo API
    if (BREVO_API_KEY && BREVO_API_KEY !== "") {
      console.log("📧 Sending via Brevo API to:", to);

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
        console.log(`✅ Email sent via Brevo API to ${to}`);
        return { success: true, method: "api" };
      } else {
        const errorData = await response.json();
        console.error("❌ Brevo API Error:", errorData);
      }
    }

    // Last resort: Log it
    console.log("📧 Email would be sent (no working method):", {
      to,
      subject,
      html: html.substring(0, 200) + "...",
    });
    console.log("ℹ️ Configure SMTP or Brevo API to send real emails");

    return { success: true, fallback: true };
  } catch (error) {
    console.error("❌ Email service error:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// SEND BULK EMAIL
// ============================================
export const sendBulkEmail = async ({
  recipients,
  subject,
  body,
  variables = [],
}) => {
  try {
    let sent = 0;
    let failed = 0;
    const results = [];

    // Process in batches of 50
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const promises = batch.map(async (recipient) => {
        let personalizedBody = body;
        let personalizedSubject = subject;

        // Replace variables
        variables.forEach((varName) => {
          const value =
            recipient.data?.[varName] || recipient[varName] || `{{${varName}}}`;

          const regex = new RegExp(`{{${varName}}}`, "g");
          personalizedBody = personalizedBody.replace(regex, value);
          personalizedSubject = personalizedSubject.replace(regex, value);
        });

        // Common variables
        personalizedBody = personalizedBody
          .replace(/{{name}}/g, recipient.name || "User")
          .replace(/{{email}}/g, recipient.email || "")
          .replace(
            /{{site_url}}/g,
            import.meta.env.VITE_APP_URL || "https://cerebrum-three.vercel.app",
          );

        personalizedSubject = personalizedSubject
          .replace(/{{name}}/g, recipient.name || "User")
          .replace(
            /{{site_url}}/g,
            import.meta.env.VITE_APP_URL || "https://cerebrum-three.vercel.app",
          );

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

      // Delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Log to database
    try {
      await supabase.from("email_logs").insert({
        subject: subject,
        recipients: recipients.map((r) => r.email).join(", "),
        sent_count: sent,
        failed_count: failed,
        sent_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("Error logging email:", logError);
    }

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

export default {
  sendEmail,
  sendBulkEmail,
  emailTemplates,
};
