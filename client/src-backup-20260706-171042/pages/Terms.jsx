import React from 'react';
import { FileText, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      icon: Shield,
      title: 'Acceptance of Terms',
      content: 'By using Cerebrum, you agree to these terms and conditions. If you do not agree, please do not use our platform.'
    },
    {
      icon: CheckCircle,
      title: 'User Responsibilities',
      content: 'You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.'
    },
    {
      icon: AlertCircle,
      title: 'Content Guidelines',
      content: 'Users must not post or share inappropriate content. All quiz content is moderated to ensure quality and appropriateness.'
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      content: 'All content on Cerebrum is protected by copyright. Users retain ownership of their quiz results and progress data.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <FileText className="w-16 h-16 text-[#6C2BD9] mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
        <p className="text-gray-400 mt-2">Effective: July 2025</p>
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
        <p className="text-sm text-gray-400">
          Last updated: July 2025. These terms may be updated periodically. 
          We will notify users of any significant changes.
        </p>
      </div>
    </div>
  );
};

export default Terms;
