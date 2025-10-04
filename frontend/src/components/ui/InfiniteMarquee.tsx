'use client';

import { ReactNode } from 'react';

interface InfiniteMarqueeProps {
  children: ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  reverse?: boolean;
}

export const InfiniteMarquee = ({
  children,
  speed = 30,
  pauseOnHover = true,
  className = '',
  reverse = false,
}: InfiniteMarqueeProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`flex gap-8 ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animation: `scroll ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
        }}
      >
        {/* Duplicate content for seamless loop */}
        <div className="flex gap-8 shrink-0">{children}</div>
        <div className="flex gap-8 shrink-0">{children}</div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
