'use client';

import { InputHTMLAttributes, useState } from 'react';

interface FloatingLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingLabel = ({
  label,
  error,
  id,
  className = '',
  ...props
}: FloatingLabelProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const inputId = id || `input-${label.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div className="relative">
      <input
        id={inputId}
        className={`peer w-full px-4 pt-6 pb-2 bg-white/5 border ${
          error ? 'border-red-500' : 'border-white/20'
        } rounded-lg text-white placeholder-transparent focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 transition-all ${className}`}
        placeholder={label}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== '');
        }}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isFocused || hasValue || props.value
            ? 'top-2 text-xs text-electric-blue'
            : 'top-4 text-base text-light-grey/60'
        }`}
      >
        {label}
        {props.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};
