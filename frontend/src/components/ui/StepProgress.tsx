'use client';

import { motion } from 'framer-motion';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
  className?: string;
}

export const StepProgress = ({
  currentStep,
  totalSteps,
  labels,
  className = '',
}: StepProgressProps) => {
  return (
    <div className={className}>
      {/* Desktop/Tablet: Horizontal */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;

            return (
              <div key={index} className="flex-1 flex items-center">
                {/* Step Circle */}
                <div className="relative flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isCurrent ? 1.1 : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-electric-blue border-electric-blue text-white'
                        : isCurrent
                        ? 'bg-electric-blue/20 border-electric-blue text-electric-blue'
                        : 'bg-white/5 border-white/20 text-light-grey/40'
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </motion.div>

                  {/* Label */}
                  <span
                    className={`mt-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'text-electric-blue'
                        : isCompleted
                        ? 'text-light-grey'
                        : 'text-light-grey/40'
                    }`}
                  >
                    {labels[index] || `Шаг ${stepNumber}`}
                  </span>
                </div>

                {/* Connector Line */}
                {index < totalSteps - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-white/10 relative overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="h-full bg-electric-blue"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical */}
      <div className="sm:hidden space-y-4">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={index} className="flex items-start gap-4">
              {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 flex-shrink-0 ${
                  isCompleted
                    ? 'bg-electric-blue border-electric-blue text-white'
                    : isCurrent
                    ? 'bg-electric-blue/20 border-electric-blue text-electric-blue'
                    : 'bg-white/5 border-white/20 text-light-grey/40'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </motion.div>

              {/* Label */}
              <div className="flex-1">
                <span
                  className={`text-sm font-medium ${
                    isCurrent
                      ? 'text-electric-blue'
                      : isCompleted
                      ? 'text-light-grey'
                      : 'text-light-grey/40'
                  }`}
                >
                  {labels[index] || `Шаг ${stepNumber}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
