'use client';

import { ProductShowcase } from './ProductShowcase';
import { Product } from '@/lib/api';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProductSectionProps {
  products: Product[];
}

type ViewMode = 'marquee' | 'stagger' | 'grid';

const viewModes = [
  { id: 'marquee' as ViewMode, name: 'Карусель', icon: '🎠' },
  { id: 'stagger' as ViewMode, name: 'Анимация', icon: '✨' },
  { id: 'grid' as ViewMode, name: 'Сетка', icon: '📱' },
];

export const ProductSection = ({ products }: ProductSectionProps) => {
  const [currentMode, setCurrentMode] = useState<ViewMode>('marquee');

  return (
    <div className="space-y-8">
      {/* Переключатель режимов */}
      <div className="flex justify-center">
        <div className="flex bg-deep-blue/50 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
          {viewModes.map((mode) => (
            <motion.button
              key={mode.id}
              onClick={() => setCurrentMode(mode.id)}
              className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                currentMode === mode.id
                  ? 'text-white bg-electric-blue shadow-lg'
                  : 'text-light-grey/70 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{mode.icon}</span>
              {mode.name}
              {currentMode === mode.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-electric-blue rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Заголовок с анимацией */}
      <motion.div 
        className="text-center"
        key={currentMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-electric-blue to-purple-400 bg-clip-text text-transparent">
          {currentMode === 'marquee' && 'Наша продукция в движении'}
          {currentMode === 'stagger' && 'Откройте для себя наши решения'}
          {currentMode === 'grid' && 'Полный каталог продукции'}
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-light-grey/70">
          {currentMode === 'marquee' && 'Автоматическая карусель с нашими лучшими предложениями'}
          {currentMode === 'stagger' && 'Каждый продукт появляется с уникальной анимацией'}
          {currentMode === 'grid' && 'Классическое отображение в удобной сетке'}
        </p>
      </motion.div>

      {/* Контейнер для продуктов */}
      <motion.div
        key={currentMode}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <ProductShowcase products={products} variant={currentMode} />
      </motion.div>

      {/* Индикаторы для marquee */}
      {currentMode === 'marquee' && (
        <div className="flex justify-center space-x-2 mt-6">
          {products.map((_, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-electric-blue/30 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};