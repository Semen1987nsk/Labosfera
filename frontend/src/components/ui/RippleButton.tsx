'use client';

import { useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export const RippleButton = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  ...props
}: RippleButtonProps) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      x,
      y,
      id: Date.now(),
    };
    
    setRipples((prev) => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
    
    onClick?.(e);
  };

  const baseClasses = 'relative overflow-hidden px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-electric-blue to-cyan-500 text-white hover:shadow-lg hover:shadow-electric-blue/50',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/20',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 500, height: 500, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </button>
  );
};
