'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchSuggestion {
  id: number;
  name: string;
  category?: string;
  slug: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  showSuggestions?: boolean;
  className?: string;
  suggestions?: SearchSuggestion[];
}

export const SearchBar = ({
  placeholder = 'Поиск...',
  onSearch,
  showSuggestions = true,
  className = '',
  suggestions = [],
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  const filteredSuggestions = showSuggestions
    ? suggestions.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleClear = () => {
    setQuery('');
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative flex items-center bg-white/5 border rounded-xl transition-all duration-300 ${
          isFocused
            ? 'border-electric-blue ring-2 ring-electric-blue/20 shadow-lg shadow-electric-blue/10'
            : 'border-white/10'
        }`}
      >
        {/* Search Icon */}
        <div className="absolute left-4 text-light-grey/50">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full px-12 py-3 bg-transparent text-white placeholder-light-grey/50 focus:outline-none"
        />

        {/* Clear Button */}
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-4 text-light-grey/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showResults && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-dark-blue/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50"
          >
            <div className="p-2">
              {filteredSuggestions.slice(0, 8).map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`/product/${item.slug}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 bg-electric-blue/10 rounded-lg flex items-center justify-center group-hover:bg-electric-blue/20 transition-colors">
                    <svg
                      className="w-5 h-5 text-electric-blue"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white group-hover:text-electric-blue transition-colors">
                      {item.name}
                    </p>
                    {item.category && (
                      <p className="text-sm text-light-grey/60">{item.category}</p>
                    )}
                  </div>
                  <svg
                    className="w-5 h-5 text-light-grey/30 group-hover:text-electric-blue transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.a>
              ))}
            </div>

            {filteredSuggestions.length > 8 && (
              <div className="p-3 border-t border-white/10 text-center">
                <p className="text-sm text-light-grey/60">
                  Показано 8 из {filteredSuggestions.length} результатов
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
