'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Tilt from 'react-parallax-tilt';
import { Product } from '@/lib/api'; // Импортируем наш обновленный тип
import { useCart } from '@/contexts/CartContext';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

const BACKEND_URL = 'https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev';

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };
  // --- НОВАЯ ЛОГИКА ПОИСКА ГЛАВНОГО ИЗОБРАЖЕНИЯ ---
  // 1. Ищем изображение, у которого стоит галочка "Главное изображение".
  // 2. Если такого нет, берем просто первое изображение из списка.
  // 3. Если и его нет, mainImage будет undefined.
  const mainImage = product.images?.find(img => img.is_main) || product.images?.[0];

  // Формируем полный URL для найденного изображения
  const imageUrl = mainImage?.image
    ? (mainImage.image.startsWith('/') ? `${BACKEND_URL}${mainImage.image}` : mainImage.image)
    : null;

  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={2000}
      glareEnable={true}
      glareMaxOpacity={0.2}
      glarePosition="all"
      scale={1.02}
      transitionSpeed={1500}
      className="h-full transition-all duration-500 ease-out animate-fade-in group"
    >
      <div className="bg-dark-blue rounded-lg overflow-hidden flex flex-col h-full border border-white/10 relative">
        {/* Добавляем эффект свечения по краям */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-electric-blue/0 via-electric-blue/0 to-electric-blue/0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" />
        
        <Link href={`/product/${product.slug}`} className="block relative group/image">
          <div className="relative w-full aspect-[4/3] bg-white overflow-hidden">
            {imageUrl ? (
              <>
                {/* Добавляем эффект блика */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/image:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="transition-all duration-500 ease-out p-3 sm:p-4 group-hover/image:scale-[1.02] group-hover/image:filter group-hover/image:brightness-105"
                />
                
                {/* Кнопка быстрого просмотра */}
                <button
                  onClick={handleQuickView}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-2 opacity-0 group-hover/image:opacity-100 transition-all duration-300 text-white z-10"
                  title="Быстрый просмотр"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-light-grey/50">Нет изображения</span>
              </div>
            )}
          </div>
        </Link>

        <div className="p-6 flex flex-col flex-grow relative z-10">
          <h3 className="font-semibold text-lg leading-snug text-balance hyphens-auto line-clamp-2 md:line-clamp-3">
            <Link 
              href={`/product/${product.slug}`} 
              className="hover:text-electric-blue transition-all duration-300 hover:tracking-wide"
            >
              {product.name}
            </Link>
          </h3>
          
          <div className="mt-auto pt-2 flex flex-col gap-3">
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-blue-400 group-hover:to-purple-500 transition-all duration-500">
              {parseFloat(product.price).toLocaleString('ru-RU')} ₽
            </p>
            
            <button 
              className="relative w-full overflow-hidden"
              onClick={handleAddToCart}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue via-blue-500 to-electric-blue bg-[length:200%_100%] group-hover:bg-[100%_100%] transition-all duration-700" />
              <span className="relative block bg-electric-blue text-white py-3 px-6 rounded-lg group-hover:bg-transparent transition-colors duration-300">
                В корзину
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно быстрого просмотра */}
      {imageUrl && (
        <QuickViewModal
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          imageSrc={imageUrl}
          productName={product.name}
        />
      )}
    </Tilt>
  );
};