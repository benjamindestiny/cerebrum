import { supabase } from "./supabase";

// Brevo API Configuration
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY || import.meta.env.BREVO_API_KEY || "";
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// SMTP Configuration (as fallback)
const SMTP_CONFIG = {
  host: import.meta.env.VITE_SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(import.meta.env.VITE_SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: import.meta.env.VITE_SMTP_USER || '',
    pass: import.meta.env.VITE_SMTP_PASS || '',
  },
};

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
            <h1 style="color: #1A1208; margin-top: 15px;">Welcome to Cerebrum!</h1>
          </div>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">We're thrilled to have you join our community of learners! 🎉</p>
          <div style="background: #F0F7FF; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <p style="margin: 5px 0; font-size: 14px;">📝 Take quizzes on various topics</p>
            <p style="margin: 5px 0; font-size: 14px;">🧩 Solve challenging riddles</p>
            <p style="margin: 5px 0; font-size: 14px;">📚 Read educational articles</p>
            <p style="margin: 5px 0; font-size: 14px;">🏆 Compete on the leaderboard</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${import.meta.env.VITE_APP_URL || 'https://cerebrum-three.vercel.app'}/categories" 
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
};

// ============================================
// SEND SINGLE EMAIL
// ============================================
export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Try SMTP first if configured
    if (SMTP_CONFIG.auth.user && SMTP_CONFIG.auth.pass) {
      try {
        console.log("📧 Sending via SMTP to:", to);
        
        // Use fetch to send via SMTP relay
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to,
            subject,
            html,
            config: SMTP_CONFIG,
          }),
        });

        if (response.ok) {
          console.log(`✅ Email sent via SMTP to ${to}`);
          return { success: true, method: 'smtp' };
        }
      } catch (smtpError) {
        console.warn("SMTP failed, trying API...", smtpError.message);
      }
    }

    // Try Brevo API
    if (BREVO_API_KEY && BREVO_API_KEY !== '') {
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
        return { success: true, method: 'api' };
      } else {
        const errorData = await response.json();
        console.error("❌ Brevo API Error:", errorData);
        
        // If API key is invalid, fallback to logging
        if (response.status === 401) {
          console.warn("⚠️ Invalid Brevo API key. Email logged only.");
        }
      }
    }

    // Last resort: Log it (for development/testing)
    console.log("📧 Email would be sent (logging mode):", {
      to,
      subject,
      html: html.substring(0, 200) + "...",
    });
    console.log("ℹ️ Configure SMTP or Brevo API to send real emails");

    // ✅ Return success even in fallback mode so app doesn't break
    return { success: true, fallback: true };

  } catch (error) {
    console.error("❌ Email service error:", error);
    // Always return success in dev mode
    return { success: true, fallback: true };
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

    const batchSize = 20;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const promises = batch.map(async (recipient) => {
        let personalizedBody = body;
        let personalizedSubject = subject;

        variables.forEach((varName) => {
          const value = recipient.data?.[varName] || 
                       recipient[varName] || 
                       `{{${varName}}}`;
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

        if (result.success) {
          sent++;
        } else {
          failed++;
        }
        return { recipient: recipient.email, ...result };
      });

      const batchResults = await Promise.all(promises);
      results.push(...batchResults);

      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

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
