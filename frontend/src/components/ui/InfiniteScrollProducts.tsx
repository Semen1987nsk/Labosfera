'use client';

import { ProductCard } from './ProductCard';
import { Product } from '@/lib/api';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';

interface InfiniteScrollProductsProps {
  products: Product[];
}

export const InfiniteScrollProducts = ({ products }: InfiniteScrollProductsProps) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  
  const PRODUCTS_PER_PAGE = 2; // Показываем по 2 продукта за раз для демонстрации

  // Функция для загрузки следующей порции продуктов
  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Имитируем задержку загрузки
    setTimeout(() => {
      const startIndex = page * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      
      // Создаем бесконечный цикл продуктов
      const newProducts: Product[] = [];
      for (let i = startIndex; i < endIndex; i++) {
        const productIndex = i % products.length;
        const product = products[productIndex];
        if (product) {
          // Просто добавляем продукт (ключ зададим на уровне JSX)
          newProducts.push(product);
        }
      }
      
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setPage(prev => prev + 1);
      setLoading(false);
      
      // Для демонстрации ограничим до 20 элементов
      if (displayedProducts.length + newProducts.length >= 20) {
        setHasMore(false);
      }
    }, 800);
  }, [products, page, loading, hasMore, displayedProducts.length]);

  // Реф для последнего элемента
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProducts();
      }
    }, {
      threshold: 0.1,
      rootMargin: '200px' // Загружаем заранее
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreProducts]);

  // Загружаем первую порцию при монтировании
  useEffect(() => {
    if (products.length > 0) {
      loadMoreProducts();
    }
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-light-grey/70">Продукты не найдены</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Адаптивная сетка */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        layout
      >
        {displayedProducts.map((product, index) => {
          const isLast = index === displayedProducts.length - 1;
          
          return (
            <motion.div
              key={`${product.id}-${index}`}
              ref={isLast ? lastProductElementRef : null}
              initial={{ 
                opacity: 0, 
                y: 60,
                scale: 0.8
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              transition={{
                duration: 0.6,
                delay: (index % PRODUCTS_PER_PAGE) * 0.1,
                ease: "easeOut"
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 }
              }}
              layout
            >
              <ProductCard product={product} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Индикатор загрузки */}
      {loading && (
        <motion.div 
          className="flex justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-electric-blue rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
            <span className="text-light-grey/70 ml-3">Загружаем больше продуктов...</span>
          </div>
        </motion.div>
      )}

      {/* Сообщение об окончании */}
      {!hasMore && !loading && (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-deep-blue/50 backdrop-blur-sm rounded-2xl border border-white/10">
            <span className="text-2xl">✨</span>
            <span className="text-light-grey/80">Вы просмотрели всю нашу продукцию!</span>
          </div>
          <p className="mt-4 text-light-grey/60 text-sm">
            Свяжитесь с нами для получения дополнительной информации
          </p>
        </motion.div>
      )}

      {/* Счетчик продуктов */}
      <motion.div 
        className="fixed bottom-6 right-6 z-30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-electric-blue/90 backdrop-blur-sm text-white px-4 py-2 rounded-2xl shadow-lg border border-white/20">
          <span className="text-sm font-medium">
            Показано: {displayedProducts.length}
          </span>
        </div>
      </motion.div>
    </div>
  );
};