'use client';

import { ProductCard } from './ProductCard';
import { Product } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface InteractiveCarouselProps {
  products: Product[];
}

export const InteractiveCarousel = ({ products }: InteractiveCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [cardsToShow, setCardsToShow] = useState(3);

  // Адаптивное количество карточек
  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else if (window.innerWidth < 1280) setCardsToShow(3);
      else setCardsToShow(4);
    };

    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  const totalSlides = Math.max(0, products.length - cardsToShow + 1);
  const maxIndex = totalSlides - 1;

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-light-grey/70">Продукты не найдены</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Основная карусель */}
      <div className="relative overflow-hidden rounded-2xl">
        <motion.div
          ref={carouselRef}
          className="flex cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{
            left: -(maxIndex * 100),
            right: 0,
          }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            const offset = info.offset.x;
            const velocity = info.velocity.x;
            
            if (Math.abs(offset) > 100 || Math.abs(velocity) > 500) {
              if (offset > 0 || velocity > 500) {
                prevSlide();
              } else {
                nextSlide();
              }
            }
          }}
          animate={{
            x: `${-currentIndex * (100 / cardsToShow)}%`,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
          style={{
            width: `${(products.length / cardsToShow) * 100}%`,
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / products.length}%` }}
              whileHover={!isDragging ? { y: -8 } : {}}
              transition={{ duration: 0.2 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Кнопки навигации */}
        {totalSlides > 1 && (
          <>
            <motion.button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-dark-blue/80 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-electric-blue/80 transition-all duration-300 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-dark-blue/80 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-electric-blue/80 transition-all duration-300 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </>
        )}
      </div>

      {/* Индикаторы точек */}
      {totalSlides > 1 && (
        <motion.div 
          className="flex justify-center mt-8 space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {Array.from({ length: totalSlides }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-electric-blue shadow-lg shadow-electric-blue/50'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </motion.div>
      )}

      {/* Счетчик слайдов */}
      <motion.div 
        className="absolute top-4 right-4 bg-dark-blue/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        {currentIndex + 1} / {totalSlides}
      </motion.div>

      {/* Подсказка для пользователя */}
      <motion.div 
        className="text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-light-grey/60 text-sm">
          💡 Используйте кнопки, точки или перетаскивайте мышью
        </p>
      </motion.div>
    </div>
  );
};