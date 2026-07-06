import React from 'react';
import { Shield, Lock, Eye, FileText, Users, Database, Mail } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: 'We collect information you provide directly, such as when you create an account, take quizzes, or contact us. This includes your name, email address, and quiz performance data.'
    },
    {
      icon: Database,
      title: 'How We Use Your Data',
      content: 'Your data is used to personalize your quiz experience, track your progress, and improve our platform. We never sell your personal information to third parties.'
    },
    {
      icon: Eye,
      title: 'Data Security',
      content: 'We implement industry-standard security measures to protect your data. All communications are encrypted using SSL/TLS technology.'
    },
    {
      icon: Users,
      title: 'Third-Party Services',
      content: 'We use trusted third-party services for analytics and authentication. These services have their own privacy policies and data handling practices.'
    },
    {
      icon: Mail,
      title: 'Contact Us',
      content: 'If you have any questions about this Privacy Policy, please contact us at support@cerebrum.com'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <Shield className="w-16 h-16 text-[#6C2BD9] mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="text-gray-400 mt-2">Last updated: July 2025</p>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          At Cerebrum, we take your privacy seriously. This policy describes how we collect, 
          use, and protect your personal information.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="glass-card p-6 hover:border-[#6C2BD9]/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#6C2BD9]/20 rounded-lg">
                <section.icon className="w-6 h-6 text-[#6C2BD9]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{section.title}</h2>
                <p className="text-gray-400 leading-relaxed">{section.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 border border-yellow-400/20 bg-yellow-400/5">
        <div className="flex items-start gap-4">
          <Lock className="w-6 h-6 text-yellow-400 mt-1" />
          <div>
            <h3 className="text-white font-semibold">Your Rights</h3>
            <p className="text-gray-400 text-sm mt-1">
              You have the right to access, modify, or delete your personal data at any time. 
              To exercise these rights, please contact us through the provided channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
