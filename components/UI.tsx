
import React from 'react';

// --- Card Component ---
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => (
  <div 
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in ${props.onClick ? 'cursor-pointer' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

// --- Button Component ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = "", ...props }) => {
  const baseStyles = "font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-teal to-teal-light text-white border-none",
    secondary: "bg-white text-teal border-2 border-teal hover:bg-teal-50",
    outline: "bg-transparent border-2 border-gray-200 text-gray-600 hover:border-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Badge Component ---
export const Badge = ({ level, icon }: { level: number | string, icon?: string }) => (
  <div className="inline-flex items-center gap-2 bg-purple/10 border-2 border-purple/20 rounded-full px-3 py-1 animate-slide-up">
    {icon && <span className="text-lg">{icon}</span>}
    <span className="font-black text-purple text-xs uppercase tracking-wider">Nível {level}</span>
  </div>
);

// --- Section Title ---
export const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6 animate-slide-up">
    <h2 className="text-2xl md:text-3xl font-black text-dark tracking-tight">{title}</h2>
    {subtitle && <p className="text-gray font-medium mt-1">{subtitle}</p>}
  </div>
);
