'use client';

import { motion } from 'framer-motion';

interface ShippingProgressProps {
  current: number;
  target: number;
  className?: string;
  message?: string;
}

export const ShippingProgress = ({
  current,
  target,
  className = '',
  message = 'До бесплатной доставки',
}: ShippingProgressProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);
  const isComplete = current >= target;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-light-grey/80">
          {isComplete ? (
            <span className="flex items-center gap-2 text-green-400 font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Бесплатная доставка!
            </span>
          ) : (
            `${message} осталось`
          )}
        </span>
        <span className="font-bold text-electric-blue">
          {isComplete ? '0' : remaining.toLocaleString('ru-RU')} ₽
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* Progress Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full relative ${
            isComplete
              ? 'bg-gradient-to-r from-green-500 to-emerald-400'
              : 'bg-gradient-to-r from-electric-blue to-cyan-400'
          }`}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>

        {/* Milestone markers */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {[0, 25, 50, 75, 100].map((mark) => (
            <div
              key={mark}
              className={`w-0.5 h-2 rounded-full transition-colors ${
                percentage >= mark ? 'bg-white/40' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Target Amount */}
      <div className="flex items-center justify-between text-xs text-light-grey/60">
        <span>{current.toLocaleString('ru-RU')} ₽</span>
        <span>{target.toLocaleString('ru-RU')} ₽</span>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};
