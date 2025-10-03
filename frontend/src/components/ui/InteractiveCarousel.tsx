'use client';

import { ProductCard } from './ProductCard';
import { Product } from '@/lib/api';
import { useState, useEffect } from 'react';

interface InteractiveCarouselProps {
  products: Product[];
}

export const InteractiveCarousel = ({ products }: InteractiveCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  // Без лишних логов

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

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-light-grey/70">Продукты не найдены</p>
        <p className="text-light-grey/50 text-sm mt-2">Проверьте подключение к API</p>
      </div>
    );
  }

  // Создаем группы товаров для слайдов
  const slides = [];
  for (let i = 0; i < products.length; i += cardsToShow) {
    slides.push(products.slice(i, i + cardsToShow));
  }
  // ...

  const totalSlides = slides.length;

  // Гарантируем, что индекс текущего слайда не выходит за пределы при ресайзе
  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(Math.max(0, totalSlides - 1));
    }
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Автопрокрутка со стопом на hover/невидимости и уважением reduce-motion
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return; // не крутим, если пользователь просит меньше анимаций
    if (isHovered || totalSlides <= 1) return; // пауза при наведении или если один слайд

    const id = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 5500);

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(id);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isHovered, totalSlides]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={(e) => { setTouchStartX(e.touches[0].clientX); setTouchEndX(null); }}
      onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
      onTouchEnd={() => {
        if (touchStartX !== null && touchEndX !== null) {
          const delta = touchStartX - touchEndX;
          if (Math.abs(delta) > 40) {
            delta > 0 ? nextSlide() : prevSlide();
          }
        }
        setTouchStartX(null);
        setTouchEndX(null);
      }}
      tabIndex={0}
      role="region"
      aria-label="Карусель товаров"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      }}
    >
      {/* Основная карусель */}
      <div className="relative overflow-hidden rounded-2xl min-h-[480px] border border-white/10 shadow-xl shadow-black/20">
        {/* Декоративный фон */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-electric-blue/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-dark-blue/40 backdrop-blur-sm" />
          <div className="shimmer-light" />
        </div>
        {/* Контейнер слайдов */}
        <div 
          className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ 
            transform: `translateX(-${(currentSlide * 100) / totalSlides}%)`,
            width: `${totalSlides * 100}%`
          }}
        >
          {slides.map((slideProducts, slideIndex) => (
            <div 
              key={slideIndex}
              className={`w-full flex-shrink-0 p-6 sm:p-8 flex items-stretch justify-center transition-transform duration-500 ${
                currentSlide === slideIndex ? 'scale-[1.01] shadow-xl shadow-black/20' : 'scale-[0.995] shadow-none'
              }`}
              style={{ width: `${100 / totalSlides}%` }}
            >
              {/* Простая сетка товаров */}
              <div 
                className="grid gap-6 w-full max-w-7xl mx-auto content-stretch" 
                style={{ 
                  gridTemplateColumns: `repeat(${Math.min(cardsToShow, slideProducts.length)}, 1fr)` 
                }}
              >
                {slideProducts.map((product) => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {/* Если нет товаров в слайде - показываем заглушку */}
              {slideProducts.length === 0 && (
                <div className="text-center text-gray-500">
                  <p>Нет товаров в этом слайде</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Кнопки навигации */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="group absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full grid place-items-center z-10 transition-transform duration-300 hover:-translate-x-0.5 active:scale-95"
            >
              <span className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 transition-colors group-hover:bg-black/45" />
              <span className="absolute -inset-1 rounded-full bg-electric-blue/0 blur-lg transition-opacity opacity-0 group-hover:opacity-60" />
              <svg className="relative w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="group absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full grid place-items-center z-10 transition-transform duration-300 hover:translate-x-0.5 active:scale-95"
            >
              <span className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 transition-colors group-hover:bg-black/45" />
              <span className="absolute -inset-1 rounded-full bg-electric-blue/0 blur-lg transition-opacity opacity-0 group-hover:opacity-60" />
              <svg className="relative w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Индикаторы точек */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                currentSlide === index
                  ? 'w-7 bg-electric-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Счетчик слайдов */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/35 backdrop-blur-sm text-white px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium border border-white/10">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Подсказка для пользователя */}
      <div className="text-center mt-4">
        <p className="text-light-grey/60 text-sm">💡 Используйте кнопки или точки для навигации</p>
      </div>
    </div>
  );
};