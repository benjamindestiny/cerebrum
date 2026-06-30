import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#1A1A3E]/95 p-4 border-b border-white/10">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-[#6C2BD9]" />
          <span className="text-xl font-bold text-white">Cerebrum</span>
        </Link>
        <nav className="flex gap-4">
          <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
          <Link to="/categories" className="text-gray-400 hover:text-white">Categories</Link>
          <Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
