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
      className={clsx("relative overflow-hidden rounded-lg border border-white/10 p-8 bg-deep-blue", className)}
    >
      {/* Слой с эффектом подсветки. Он будет под контентом. */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(58, 134, 255, 0.15), transparent 40%)`,
        }}
      />
      {/* ИСПРАВЛЕНИЕ: Оборачиваем контент в div, чтобы поднять его НАД слоем подсветки */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};