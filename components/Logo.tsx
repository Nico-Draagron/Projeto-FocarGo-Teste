
import React from 'react';

// You can replace the empty string below with your Base64 string: "data:image/png;base64,..."
const BASE64_LOGO = ""; 

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  
  // High quality SVG Logo (Default)
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
      <path d="M25 45 C25 35 35 35 40 40 L60 40 C65 35 75 35 75 45 C75 55 65 55 60 50 L40 50 C35 55 25 55 25 45 Z" fill="#7A3EB1" stroke="#4A1A71" strokeWidth="2" />
    </svg>
  );

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {BASE64_LOGO ? (
        <img 
          src={BASE64_LOGO} 
          alt="FocarGo Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
             // Fallback to SVG if base64 is invalid
             e.currentTarget.style.display = 'none';
             if (e.currentTarget.parentElement) {
                // This logic is handled by the conditional rendering, but as a safety:
                console.warn("Base64 image failed to load");
             }
          }}
        />
      ) : SvgLogo}
    </div>
  );
};
