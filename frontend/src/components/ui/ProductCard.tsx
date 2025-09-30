'use client';

import Image from 'next/image';
import Link from 'next/link';
import Tilt from 'react-parallax-tilt';
import { Product } from '@/lib/api'; // Импортируем наш обновленный тип

interface ProductCardProps {
  product: Product;
}

const BACKEND_URL = 'https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev';

export const ProductCard = ({ product }: ProductCardProps) => {
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
          <div className="relative w-full h-48 bg-deep-blue overflow-hidden">
            {imageUrl ? (
              <>
                {/* Добавляем эффект блика */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/image:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-all duration-500 ease-out group-hover/image:scale-110 group-hover/image:filter group-hover/image:brightness-110"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-light-grey/50">Нет изображения</span>
              </div>
            )}
          </div>
        </Link>

        <div className="p-6 flex flex-col flex-grow relative z-10">
          <h3 className="font-semibold text-lg h-14 flex-grow">
            <Link 
              href={`/product/${product.slug}`} 
              className="hover:text-electric-blue transition-all duration-300 hover:tracking-wide"
            >
              {product.name}
            </Link>
          </h3>
          
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-blue-400 group-hover:to-purple-500 transition-all duration-500">
              {parseFloat(product.price).toLocaleString('ru-RU')} ₽
            </p>
            
            <button className="relative w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue via-blue-500 to-electric-blue bg-[length:200%_100%] group-hover:bg-[100%_100%] transition-all duration-700" />
              <span className="relative block bg-electric-blue text-white py-3 px-6 rounded-lg group-hover:bg-transparent transition-colors duration-300">
                В корзину
              </span>
            </button>
          </div>
        </div>
      </div>
    </Tilt>
  );
};