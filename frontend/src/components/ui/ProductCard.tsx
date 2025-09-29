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
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={1500}
      glareEnable={true}
      glareMaxOpacity={0.15}
      glarePosition="all"
      scale={1.02}
      transitionSpeed={2000}
      className="h-full transition-all duration-500 ease-out animate-fade-in hover:animate-glow"
    >
      <div className="bg-dark-blue rounded-lg overflow-hidden group flex flex-col h-full border border-white/10">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative w-full h-48 bg-deep-blue">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-light-grey/50">Нет изображения</span>
              </div>
            )}
          </div>
        </Link>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg h-14 flex-grow">
            <Link href={`/product/${product.slug}`} className="hover:text-electric-blue transition-colors">{product.name}</Link>
          </h3>
          <p className="text-xl font-bold text-electric-blue mt-2">
            {parseFloat(product.price).toLocaleString('ru-RU')} ₽
          </p>
          <button className="mt-4 w-full bg-electric-blue text-white py-2 rounded-lg hover:opacity-90 transition-opacity">
            В корзину
          </button>
        </div>
      </div>
    </Tilt>
  );
};