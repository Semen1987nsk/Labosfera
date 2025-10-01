// Компонент превью корзины при наведении
'use client';

import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const ShoppingBagIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

export const CartPreview = () => {
  const { state, toggleCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={toggleCart}
        className="relative p-2 text-light-grey/80 hover:text-white transition-colors"
        aria-label={`Корзина (${state.totalItems} товаров)`}
      >
        <ShoppingBagIcon className="w-6 h-6" />
        
        {/* Счетчик */}
        {state.totalItems > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-electric-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {state.totalItems > 99 ? '99+' : state.totalItems}
          </motion.div>
        )}
      </button>

      {/* Превью при наведении */}
      <AnimatePresence>
        {isHovered && state.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-dark-blue/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl z-50"
          >
            {/* Стрелка указатель */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-dark-blue/95 border-l border-t border-white/20 rotate-45" />
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">В корзине</h3>
                <span className="text-xs text-light-grey/60">{state.totalItems} товаров</span>
              </div>

              {/* Список товаров (максимум 3, потом "еще X товаров") */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {state.items.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-2 bg-deep-blue/50 rounded-lg">
                    {/* Мини изображение */}
                    <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <img 
                          src={item.product.images[0].image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span className="text-light-grey/40 text-xs">📦</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white line-clamp-2 leading-tight">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-electric-blue font-medium">
                          {item.product.price && `${parseFloat(item.product.price).toLocaleString('ru-RU')} ₽`}
                        </span>
                        <span className="text-xs text-light-grey/60">
                          {item.quantity} шт.
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Показать "еще X товаров" если их больше 3 */}
                {state.items.length > 3 && (
                  <div className="text-center py-2">
                    <span className="text-xs text-light-grey/60">
                      и еще {state.items.length - 3} товаров
                    </span>
                  </div>
                )}
              </div>

              {/* Кнопка оформления заказа */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={toggleCart}
                  className="w-full py-2 px-4 bg-electric-blue/20 hover:bg-electric-blue/30 border border-electric-blue/50 text-electric-blue rounded-lg transition-colors text-sm font-medium"
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Пустая корзина при наведении */}
      <AnimatePresence>
        {isHovered && state.items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 bg-dark-blue/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl z-50"
          >
            {/* Стрелка указатель */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-dark-blue/95 border-l border-t border-white/20 rotate-45" />
            
            <div className="p-4 text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBagIcon className="w-6 h-6 text-light-grey/40" />
              </div>
              <p className="text-sm text-light-grey/60 mb-3">Корзина пуста</p>
              <p className="text-xs text-light-grey/40">
                Добавьте товары из каталога
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};