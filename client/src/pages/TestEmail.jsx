// pages/TestEmail.jsx
import React, { useState } from 'react';
import { sendEmail } from '../services/emailService';

const TestEmail = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testEmail = async () => {
    setLoading(true);
    try {
      const response = await sendEmail({
        to: 'your-email@gmail.com', // Change to your email
        subject: 'Test Email from Cerebrum',
        html: `
          <h1>🧠 Cerebrum Test Email</h1>
          <p>If you're reading this, email sending is working!</p>
          <p>🎉 Congratulations!</p>
        `,
      });
      setResult(response);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 max-w-md mx-auto  text-white border-[#2A2A4A]">
      <h2 className="text-white font-bold mb-4  text-white border-[#2A2A4A]">Test Email</h2>
      <button
        onClick={testEmail}
        disabled={loading}
        className="btn-primary w-full  text-white border-[#2A2A4A]"
      >
        {loading ? 'Sending...' : 'Send Test Email'}
      </button>
      {result && (
        <div className={`mt-4 p-3 rounded-lg ${result.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {result.success ? '✅ Email sent successfully!' : `❌ Error: ${result.error}`}
        </div>
      )}
    </div>
  );
};

export default TestEmail;