'use client';
import React from 'react';
import clsx from 'clsx';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { children: React.ReactNode; variant?: 'primary' | 'secondary'; className?: string; }
export const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deep-blue';
  const variantStyles = {
    primary: 'text-white bg-gradient-to-r from-action-orange to-electric-blue hover:opacity-90 shadow-lg shadow-electric-blue/20',
    secondary: 'text-electric-blue border-2 border-electric-blue bg-transparent hover:bg-electric-blue hover:text-white',
  };
  return <button className={clsx(baseStyles, variantStyles[variant], className)} {...props}>{children}</button>;
};