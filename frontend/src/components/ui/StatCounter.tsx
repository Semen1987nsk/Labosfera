'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

interface StatCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  label: string;
  className?: string;
}

export const StatCounter = ({
  end,
  duration = 2000,
  suffix = '',
  label,
  className = '',
}: StatCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
  });
  
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      motionValue.set(end);
    }
  }, [isInView, hasAnimated, end, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <motion.div
      ref={ref}
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-electric-blue to-cyan-400 bg-clip-text text-transparent">
        {displayValue}
        {suffix}
      </div>
      <div className="mt-2 text-lg text-light-grey/70">{label}</div>
    </motion.div>
  );
};

interface StatsGridProps {
  stats: Array<{
    end: number;
    suffix?: string;
    label: string;
  }>;
  className?: string;
}

export const StatsGrid = ({ stats, className = '' }: StatsGridProps) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 py-16 ${className}`}>
      {stats.map((stat, index) => (
        <StatCounter key={index} {...stat} />
      ))}
    </div>
  );
};
