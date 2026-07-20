import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Logo = ({ 
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizes = {
    sm: { icon: 'w-5 h-5', text: 'text-base' },
    md: { icon: 'w-7 h-7', text: 'text-xl' },
    lg: { icon: 'w-9 h-9', text: 'text-2xl' },
    xl: { icon: 'w-12 h-12', text: 'text-4xl' },
  };

  const sizeClasses = sizes[size] || sizes.md;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Brain className={`${sizeClasses.icon} text-[#2A1535]`} />
      {showText && (
        <span className={`font-bold ${sizeClasses.text} text-[#2A1535]`}>
          Cerebrum
        </span>
      )}
    </div>
  );
};

export const LogoLink = ({ to = '/', size = 'md', showText = true }) => {
  return (
    <Link to={to} className="flex items-center gap-2 hover:opacity-80 transition-opacity no-underline">
      <Logo size={size} showText={showText} />
    </Link>
  );
};

export default Logo;
