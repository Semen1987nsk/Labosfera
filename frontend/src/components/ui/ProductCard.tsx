'use client';

import Image from 'next/image';
import Link from 'next/link';
import Tilt from 'react-parallax-tilt'; // <-- ИМПОРТ ДЛЯ 3D-ЭФФЕКТА

interface Product {
  id: number;
  name: string;
  price: string;
  image: string | null;
  slug: string;
}

interface ProductCardProps {
  product: Product;
}

const BACKEND_URL = 'https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev';

export const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl = product.image 
    ? (product.image.startsWith('/') ? `${BACKEND_URL}${product.image}` : product.image)
    : null;

  return (
    // --- ОБЕРТКА ДЛЯ 3D-ЭФФЕКТА ---
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      perspective={1000}
      glareEnable={true}
      glareMaxOpacity={0.1}
      glarePosition="all"
      className="h-full transition-all duration-300 ease-in-out"
    >
      <div className="bg-dark-blue rounded-lg overflow-hidden group flex flex-col h-full border border-white/10">
        <Link href={`/product/${product.slug || product.id}`} className="block">
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
            <Link href={`/product/${product.slug || product.id}`} className="hover:text-electric-blue transition-colors">{product.name}</Link>
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