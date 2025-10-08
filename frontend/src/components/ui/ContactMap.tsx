'use client';

import React, { useState } from 'react';

export const ContactMap = () => {
  const [mapType, setMapType] = useState<'satellite' | 'roadmap'>('roadmap');

  // Координаты для Новосибирска, ул. Королева, д. 40
  const coordinates = {
    lat: 54.8463,
    lng: 83.0957
  };

  const toggleMapType = () => {
    setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');
  };

  const openInMaps = () => {
    // Открываем в картах по умолчанию
    const url = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Контролы карты */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={toggleMapType}
            className="px-3 py-1 text-sm bg-electric-blue/20 hover:bg-electric-blue/30 rounded-lg text-electric-blue transition-colors"
          >
            {mapType === 'roadmap' ? 'Спутник' : 'Схема'}
          </button>
          <button
            onClick={openInMaps}
            className="px-3 py-1 text-sm bg-electric-blue/20 hover:bg-electric-blue/30 rounded-lg text-electric-blue transition-colors"
          >
            Открыть в картах
          </button>
        </div>
      </div>

      {/* Iframe с картой */}
      <div className="relative h-64 bg-dark-blue rounded-lg overflow-hidden border border-white/10">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Королева+40+Новосибирск&zoom=15&maptype=${mapType}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
        />
        
        {/* Оверлей для темного стиля */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/20 to-transparent pointer-events-none" />
      </div>

      {/* Информация о местоположении */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-light-grey/80">Промышленная зона</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-light-grey/80">Производственное здание</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-1M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-3" />
          </svg>
          <span className="text-light-grey/80">Есть парковка</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-light-grey/80">Предварительная запись</span>
        </div>
      </div>

      {/* Инструкции для посетителей */}
      <div className="bg-electric-blue/10 rounded-lg p-4 border border-electric-blue/20">
        <h4 className="font-medium text-electric-blue mb-2">Как добраться:</h4>
        <ul className="text-sm text-light-grey/80 space-y-1">
          <li>• Новосибирск, ул. Королева, д. 40</li>
          <li>• На автомобиле: доступна бесплатная парковка на территории</li>
          <li>• Общественный транспорт: остановка «Королева» (автобусы, маршрутки)</li>
          <li>• Посещение производства по предварительной записи</li>
        </ul>
      </div>
    </div>
  );
};