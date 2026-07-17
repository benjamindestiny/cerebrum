import { supabase } from "./supabase";

// ============================================
// EMAIL SERVICE - API ROUTE
// ============================================

export const emailTemplates = {
  welcome: (name) => ({
    subject: "🎉 Welcome to Cerebrum!",
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: Arial, sans-serif; background-color: #0C0C1A; color: #FFFFFF; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; padding: 40px; border: 1px solid #2A2A2A;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; display: inline-block; padding: 15px; background: #1E1E3A; border-radius: 50%;">🧠</div>
            <h1 style="color: #FFFFFF; margin-top: 20px;">Welcome to Cerebrum, ${name}! 🎉</h1>
          </div>
          <p style="color: #94A3B8; font-size: 16px;">We're thrilled to have you join our community of learners!</p>
          <div style="background: #1E1E3A; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <p style="color: #E2E8F0; margin: 8px 0;">📝 Take quizzes on various topics</p>
            <p style="color: #E2E8F0; margin: 8px 0;">🧩 Solve challenging riddles</p>
            <p style="color: #E2E8F0; margin: 8px 0;">📚 Read educational articles</p>
            <p style="color: #E2E8F0; margin: 8px 0;">🏆 Compete on the leaderboard</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${import.meta.env.VITE_APP_URL || 'https://cerebrum-three.vercel.app'}/categories" 
               style="background: #3B82F6; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-block;">
              Start Learning Now
            </a>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #64748B; font-size: 12px; border-top: 1px solid #2A2A2A; padding-top: 20px;">
            Cerebrum - Your Brain Training Platform
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// ============================================
// SEND SINGLE EMAIL - Via API Route
// ============================================
export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Try sending via the API route (server-side)
    console.log("📧 Sending via API route to:", to);
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html }),
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Email sent via API route to ${to}`);
      // Log to database
      await supabase.from("email_logs").insert({
        recipient_email: to,
        subject: subject,
        body: html,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });
      return { success: true, method: result.method || 'api' };
    } else {
      console.error("❌ API Error:", result.error);
      // Fallback to logging
      return await logEmail(to, subject, html);
    }

  } catch (error) {
    console.error("❌ Email service error:", error);
    // Fallback to logging
    return await logEmail(to, subject, html);
  }
};

// ============================================
// LOG EMAIL TO DATABASE (Fallback)
// ============================================
const logEmail = async (to, subject, html) => {
  console.log("📧 [LOG MODE] Email logged only:", { to, subject });
  
  try {
    await supabase.from("email_logs").insert({
      recipient_email: to,
      subject: subject,
      body: html,
      status: 'logged',
      sent_at: new Date().toISOString(),
    });
  } catch (dbError) {
    console.error("Error logging email to DB:", dbError);
  }
  
  return { success: true, method: 'logged' };
};

// ============================================
// SEND BULK EMAIL
// ============================================
export const sendBulkEmail = async ({ recipients, subject, body, variables = [] }) => {
  try {
    let sent = 0;
    let logged = 0;
    let failed = 0;

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

      if (result.success) {
        if (result.method === 'logged') {
          logged++;
        } else {
          sent++;
        }
      } else {
        failed++;
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
      success: true,
      sent,
      logged,
      failed,
      total: recipients.length,
      message: `✅ ${sent} sent, ${logged} logged, ${failed} failed`,
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
