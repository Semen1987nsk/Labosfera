'use client';

import { ProductCard } from './ProductCard';
import { Product } from '@/lib/api';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProductShowcaseProps {
  products: Product[];
  variant?: 'marquee' | 'stagger' | 'grid';
}

export const ProductShowcase = ({ products, variant = 'marquee' }: ProductShowcaseProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (variant === 'marquee') {
    // Дублируем продукты для бесконечной прокрутки
    const duplicatedProducts = [...products, ...products];
    
    return (
      <div className="relative overflow-hidden">
        <div className="flex gap-6 animate-marquee hover:pause-marquee">
          {duplicatedProducts.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-80"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: (index % products.length) * 0.1,
                duration: 0.6,
                ease: "easeOut"
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
        {/* Градиентные маски по краям */}
        <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-dark-blue to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-dark-blue to-transparent pointer-events-none z-10" />
      </div>
    );
  }

  if (variant === 'stagger') {
    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 60,
                rotateX: -15,
                scale: 0.9
              },
              visible: { 
                opacity: 1, 
                y: 0,
                rotateX: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  duration: 0.8
                }
              }
            }}
            whileHover={{
              y: -10,
              transition: { duration: 0.2 }
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Default grid variant
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};