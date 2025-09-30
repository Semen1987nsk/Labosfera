'use client';

import React, { useRef, useState, MouseEvent } from 'react';
import { clsx } from 'clsx';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export const SpotlightCard = ({ children, className }: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateX = ((y - rect.height / 2) / rect.height) * -5;
    const rotateY = ((x - rect.width / 2) / rect.width) * 5;

    setPosition({ x, y });
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={clsx(
        "group relative overflow-hidden rounded-xl border border-white/10 p-8",
        "bg-deep-blue hover:bg-deep-blue/95",
        "hover:border-electric-blue/30 hover:shadow-[0_0_20px_-5px] hover:shadow-electric-blue/20",
        "transition-all duration-300",
        className
      )}
    >
      {/* Простой эффект подсветки без размытия */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(58, 134, 255, 0.1), transparent 70%)`
        }}
      />
      
      {/* Градиентные границы */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent" />
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent" />
      </div>

      {/* Контент без дополнительных трансформаций */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
