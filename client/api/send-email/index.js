const brevo = require("@getbrevo/brevo");

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, subject, html } = req.body;

    // Validate
    if (!to || !subject || !html) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Initialize Brevo
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );

    // Send email
    const sendSmtpEmail = {
      sender: { email: "test@brevosend.com", name: "Cerebrum" },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: error.message });
  }
}
