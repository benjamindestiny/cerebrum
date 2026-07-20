import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B82F6]" />
            <span className="text-xs sm:text-sm text-gray-400">Cerebrum &copy; 2024</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-gray-500">
            <Link to="/about" className="hover:text-gray-300 transition-colors">About</Link>
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/testimonials" className="hover:text-gray-300 transition-colors">Testimonials</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
