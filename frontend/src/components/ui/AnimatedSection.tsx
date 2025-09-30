'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'flipUp' | 'bounce';
  delay?: number;
  duration?: number;
  stagger?: number;
}

const getAnimationValues = (animation: string) => {
  switch (animation) {
    case 'fadeUp':
      return {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 }
      };
    case 'fadeIn':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      };
    case 'slideLeft':
      return {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 }
      };
    case 'slideRight':
      return {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 }
      };
    case 'scaleUp':
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 }
      };
    case 'flipUp':
      return {
        initial: { opacity: 0, rotateX: -90 },
        animate: { opacity: 1, rotateX: 0 }
      };
    case 'bounce':
      return {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0 }
      };
    default:
      return {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 }
      };
  }
};

const getBounceTransition = (duration: number, delay: number) => ({
  type: "spring" as const,
  bounce: 0.4,
  duration: 1.2,
  delay
});

export const AnimatedSection = ({ 
  children, 
  className, 
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  stagger = 0.1
}: AnimatedSectionProps) => {
  const animationValues = getAnimationValues(animation);
  const isChildrenArray = React.Children.count(children) > 1;

  if (isChildrenArray && stagger > 0) {
    return (
      <motion.section
        className={className}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            initial={animationValues.initial}
            whileInView={animationValues.animate}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              animation === 'bounce'
                ? getBounceTransition(duration, delay + (index * stagger))
                : { 
                    duration,
                    delay: delay + (index * stagger),
                    ease: 'easeOut'
                  }
            }
          >
            {child}
          </motion.div>
        ))}
      </motion.section>
    );
  }

  return (
    <motion.section
      className={className}
      initial={animationValues.initial}
      whileInView={animationValues.animate}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        animation === 'bounce'
          ? getBounceTransition(duration, delay)
          : { 
              duration,
              delay,
              ease: 'easeOut'
            }
      }
    >
      {children}
    </motion.section>
  );
};