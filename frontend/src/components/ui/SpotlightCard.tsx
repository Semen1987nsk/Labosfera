'use client';

import React, { useRef, useState, MouseEvent } from 'react';
import { clsx } from 'clsx';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export const SpotlightCard = ({ children, className }: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      className={clsx(
        "group relative overflow-hidden rounded-xl border border-white/10 p-8 bg-deep-blue/60 backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        "hover:border-electric-blue/30 hover:shadow-lg hover:shadow-electric-blue/20",
        className
      )}
    >
      {/* Слой с эффектом подсветки */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-all duration-500"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(58, 134, 255, 0.25), transparent 40%)`,
        }}
      />
      {/* Фоновое свечение */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent" />
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent" />
      </div>
      {/* Контент */}
      <div className="relative z-10 transition-transform duration-300 group-hover:scale-[1.02]">
        {children}
      </div>
    </div>
  );
};