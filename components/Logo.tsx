
import React, { useState } from 'react';

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  const [imageError, setImageError] = useState(false);

  // Default SVG Logo as fallback
  const SvgLogo = (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="45" fill="#0F8F6D" />
      <path d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C75 95 95 75 95 50 C95 25 75 5 50 5" fill="white" opacity="0.2"/>
      <ellipse cx="50" cy="65" rx="25" ry="20" fill="#14B88D" opacity="0.6" />
      <circle cx="35" cy="45" r="4" fill="#1A1A1A" />
      <circle cx="65" cy="45" r="4" fill="#1A1A1A" />
      <ellipse cx="50" cy="55" rx="6" ry="4" fill="#1A1A1A" />
      <path 
        d="M25 45 C25 35 35 35 40 40 L60 40 C65 35 75 35 75 45 C75 55 65 55 60 50 L40 50 C35 55 25 55 25 45 Z" 
        fill="#7A3EB1" 
        stroke="#4A1A71" 
        strokeWidth="2"
      />
      <line x1="25" y1="45" x2="15" y2="40" stroke="#7A3EB1" strokeWidth="3" />
      <line x1="75" y1="45" x2="85" y2="40" stroke="#7A3EB1" strokeWidth="3" />
      <line x1="30" y1="58" x2="15" y2="55" stroke="#1A1A1A" strokeWidth="1" />
      <line x1="30" y1="62" x2="15" y2="65" stroke="#1A1A1A" strokeWidth="1" />
      <line x1="70" y1="58" x2="85" y2="55" stroke="#1A1A1A" strokeWidth="1" />
      <line x1="70" y1="62" x2="85" y2="65" stroke="#1A1A1A" strokeWidth="1" />
    </svg>
  );

  if (imageError) {
    return SvgLogo;
  }

  return (
    <img 
      src="fotos/FocarGo.png" 
      alt="FocarGo Logo" 
      className={`${className} object-contain`}
      onError={() => setImageError(true)}
    />
  );
};
