import React, { useState } from 'react';
import { sendEmail } from '../services/emailService';
import { toast } from 'react-toastify';

const TestEmail = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);

  const handleSendTest = async () => {
    if (!email) {
      toast.warning('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const response = await sendEmail({
        to: email,
        subject: '🧠 Cerebrum Test Email',
        html: `
          <h1>🧠 Cerebrum Test Email</h1>
          <p>If you're reading this, your email system is working perfectly!</p>
          <p>Here's what you can do on Cerebrum:</p>
          <ul>
            <li>📝 Take quizzes on various topics</li>
            <li>🧩 Solve challenging riddles</li>
            <li>📚 Read educational articles</li>
            <li>🏆 Compete on the leaderboard</li>
          </ul>
          <p>Keep up the great work!</p>
          <a href="https://cerebrum-three.vercel.app/dashboard" 
             style="background: #3B82F6; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            Go to Dashboard
          </a>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            The Cerebrum Team 🧠
          </p>
        `
      });

      if (response.success) {
        toast.success('✅ Test email sent successfully!');
        setResult({ success: true });
      } else {
        toast.error('❌ Failed to send email: ' + (response.error || 'Unknown error'));
        setResult({ success: false, error: response.error });
      }
    } catch (error) {
      console.error('Email error:', error);
      toast.error('❌ Failed to send email');
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">📧 Test Email Sending</h2>
      <p className="text-gray-400 text-sm mb-4">
        Send a test email to verify your email configuration is working.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 block mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="w-full px-4 py-2 bg-[#262626] rounded-lg border border-white/10 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <button
          onClick={handleSendTest}
          disabled={loading}
          className="w-full btn-primary py-3"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </div>
          ) : (
            'Send Test Email'
          )}
        </button>

        {result && (
          <div className={`p-3 rounded-lg ${result.success ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {result.success ? '✅ Email sent successfully!' : `❌ Error: ${result.error}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestEmail;
