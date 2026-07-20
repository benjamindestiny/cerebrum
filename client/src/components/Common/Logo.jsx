import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ 
  variant = 'default',
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-base' },
    md: { icon: 'w-8 h-8', text: 'text-xl' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl' },
    xl: { icon: 'w-14 h-14', text: 'text-4xl' },
  };

  const sizeClasses = sizes[size] || sizes.md;
  
  // ✅ Use your logo image
  const logoSrc = '/logo.png'; // Change to your actual logo path
  const logoSrcDark = '/logo-dark.png'; // Optional: dark mode version
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoSrc} 
        alt="Cerebrum" 
        className={`${sizeClasses.icon} object-contain`}
      />
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
    <Link to={to} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <Logo size={size} showText={showText} />
    </Link>
  );
};

export default Logo;
