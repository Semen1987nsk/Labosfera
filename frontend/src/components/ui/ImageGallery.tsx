'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ImageGalleryProps {
  images: Array<{
    id: number;
    image: string;
    is_main: boolean;
  }>;
  productName: string;
  backendUrl: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  productName, 
  backendUrl 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    images.length > 0 
      ? (images.find(img => img.is_main) || images[0]).image 
      : null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция для получения полного URL изображения
  const getFullImageUrl = (imagePath: string) => {
    return imagePath.startsWith('/') ? `${backendUrl}${imagePath}` : imagePath;
  };

  // Открытие модального окна
  const openModal = (imagePath: string) => {
    setSelectedImage(imagePath);
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Переключение на следующее изображение
  const nextImage = () => {
    if (!selectedImage || images.length <= 1) return;
    
    const currentIndex = images.findIndex(img => img.image === selectedImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex].image);
  };

  // Переключение на предыдущее изображение
  const prevImage = () => {
    if (!selectedImage || images.length <= 1) return;
    
    const currentIndex = images.findIndex(img => img.image === selectedImage);
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setSelectedImage(images[prevIndex].image);
  };

  // Обработка клавиш
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedImage]);

  if (!selectedImage) {
    return (
      <div className="relative aspect-square bg-deep-blue rounded-lg flex items-center justify-center">
        <span className="text-light-grey/50">Нет изображения</span>
      </div>
    );
  }

  const fullSelectedImageUrl = getFullImageUrl(selectedImage);

  return (
    <>
      {/* Основное изображение */}
      <div className="relative">
        <div 
          className="relative aspect-square bg-deep-blue rounded-lg cursor-zoom-in hover:shadow-lg transition-all duration-300"
          onClick={() => openModal(selectedImage)}
        >
          <Image 
            src={fullSelectedImageUrl} 
            alt={productName} 
            fill 
            style={{ objectFit: 'contain' }} 
            className="p-8 rounded-lg" 
          />
          
          {/* Иконка увеличения */}
          <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
        
        {/* Миниатюры */}
        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-4">
            {images.map(img => {
              const thumbUrl = getFullImageUrl(img.image);
              return (
                <button 
                  key={img.id} 
                  onClick={() => setSelectedImage(img.image)} 
                  className={`relative aspect-square rounded-md overflow-hidden ring-2 transition-all hover:scale-105 ${
                    selectedImage === img.image 
                      ? 'ring-electric-blue' 
                      : 'ring-transparent hover:ring-electric-blue/50'
                  }`}
                >
                  <Image 
                    src={thumbUrl} 
                    alt="thumbnail" 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Модальное окно */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          >
            {/* Контейнер изображения */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={fullSelectedImageUrl}
                alt={productName}
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg"
              />
              
              {/* Кнопка закрытия */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Навигация по изображениям */}
              {images.length > 1 && (
                <>
                  {/* Предыдущее изображение */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Следующее изображение */}
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    </button>

                  {/* Индикатор текущего изображения */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-4 py-2 text-white">
                    {images.findIndex(img => img.image === selectedImage) + 1} / {images.length}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};