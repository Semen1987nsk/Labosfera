'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Certificate {
  id: number;
  title: string;
  description: string;
  image: string;
  issueDate: string;
  validUntil: string;
  issuer: string;
  category: string;
}

interface CertificateGalleryProps {
  certificates: Certificate[];
}

export const CertificateGallery = ({ certificates }: CertificateGalleryProps) => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Все сертификаты' },
    { id: 'physics', name: 'Физика' },
    { id: 'chemistry', name: 'Химия' }
  ];

  const filteredCertificates = filter === 'all' 
    ? certificates 
    : certificates.filter(cert => cert.category === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Фильтры */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setFilter(category.id)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === category.id
                ? 'bg-electric-blue text-white'
                : 'bg-deep-blue border border-white/10 text-light-grey hover:bg-electric-blue/20'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Галерея сертификатов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCertificates.map((certificate) => (
          <div
            key={certificate.id}
            className="group bg-deep-blue rounded-xl border border-white/10 overflow-hidden hover:border-electric-blue/30 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedCertificate(certificate)}
          >
            <div className="relative h-64 bg-gradient-to-br from-dark-blue to-deep-blue flex items-center justify-center">
              {/* Иконка PDF сертификата */}
              <div className="w-full h-full bg-gradient-to-br from-electric-blue/10 to-electric-blue/5 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-electric-blue mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-electric-blue text-sm font-medium">PDF Сертификат</p>
                  <p className="text-electric-blue/70 text-xs mt-1">Нажмите для просмотра</p>
                </div>
              </div>
              
              {/* Оверлей при наведении */}
              <div className="absolute inset-0 bg-electric-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-electric-blue transition-colors">
                {certificate.title}
              </h3>
              <p className="text-light-grey/70 text-sm mb-4 line-clamp-2">
                {certificate.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-light-grey/60">
                  <span>Выдан:</span>
                  <span>{formatDate(certificate.issueDate)}</span>
                </div>
                <div className="flex justify-between text-light-grey/60">
                  <span>Действует до:</span>
                  <span>{formatDate(certificate.validUntil)}</span>
                </div>
                <div className="flex justify-between text-light-grey/60">
                  <span>Орган:</span>
                  <span className="text-right">{certificate.issuer}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для детального просмотра */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-deep-blue rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedCertificate.title}</h2>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PDF сертификата */}
                <div className="bg-gradient-to-br from-electric-blue/10 to-electric-blue/5 rounded-xl h-96 flex items-center justify-center">
                  <div className="text-center w-full h-full">
                    {selectedCertificate.image.endsWith('.pdf') ? (
                      <div className="w-full h-full flex flex-col">
                        <iframe
                          src={selectedCertificate.image}
                          className="w-full flex-1 rounded-xl border-none"
                          title={selectedCertificate.title}
                        />
                        <a
                          href={selectedCertificate.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-electric-blue/80 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Открыть PDF в новой вкладке
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg className="w-24 h-24 text-electric-blue/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-electric-blue/50">Изображение сертификата</p>
                        <p className="text-light-grey/50 text-sm mt-2">
                          Загрузите фото в папку<br />
                          /public/images/certificates/
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Информация о сертификате */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Описание</h3>
                    <p className="text-light-grey/80">{selectedCertificate.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-dark-blue/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Дата выдачи</h4>
                      <p className="text-electric-blue">{formatDate(selectedCertificate.issueDate)}</p>
                    </div>
                    
                    <div className="bg-dark-blue/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Действует до</h4>
                      <p className="text-electric-blue">{formatDate(selectedCertificate.validUntil)}</p>
                    </div>
                    
                    <div className="bg-dark-blue/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Выдан организацией</h4>
                      <p className="text-light-grey/80">{selectedCertificate.issuer}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <a
                      href={selectedCertificate.image}
                      download
                      className="flex-1 bg-electric-blue hover:bg-electric-blue/80 text-white py-3 px-6 rounded-lg transition-colors text-center"
                    >
                      Скачать PDF
                    </a>
                    <button className="flex-1 border border-electric-blue text-electric-blue hover:bg-electric-blue/10 py-3 px-6 rounded-lg transition-colors">
                      Поделиться
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Информация о сертификатах */}
      <div className="mt-12 bg-electric-blue/10 rounded-xl p-6 border border-electric-blue/20">
        <h3 className="text-lg font-semibold text-electric-blue mb-3">✅ Наши сертификаты соответствия:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-light-grey/80">
          <div className="bg-dark-blue/50 rounded-lg p-4">
            <h4 className="text-electric-blue font-medium mb-2">📋 Физика - Оборудование</h4>
            <p className="text-sm mb-2">Комплекты (наборы) для ОГЭ/ГИА по физике торговой марки ЛАБОСФЕРА</p>
            <p className="text-xs text-light-grey/60">Действует: 09.04.2025 - 08.04.2028</p>
            <p className="text-xs text-electric-blue/70">Рег. № РОСС RU.32001.04UBØ1.0CI32.74155</p>
          </div>
          <div className="bg-dark-blue/50 rounded-lg p-4">
            <h4 className="text-electric-blue font-medium mb-2">🧪 Химия - Оборудование</h4>
            <p className="text-sm mb-2">Комплекты оборудования для ОГЭ/ГИА по химии торговой марки ЛАБОСФЕРА</p>
            <p className="text-xs text-light-grey/60">Действует: 09.04.2025 - 08.04.2028</p>
            <p className="text-xs text-electric-blue/70">Рег. № РОСС RU.32001.04ИБФ1.ОСПЗ2.74153</p>
          </div>
          <div className="bg-dark-blue/50 rounded-lg p-4">
            <h4 className="text-electric-blue font-medium mb-2">⚗️ Химия - Реактивы</h4>
            <p className="text-sm mb-2">Комплекты реактивов для ОГЭ/ГИА по химии торговой марки ЛАБОСФЕРА</p>
            <p className="text-xs text-light-grey/60">Действует: 09.04.2025 - 08.04.2028</p>
            <p className="text-xs text-electric-blue/70">Рег. № РОСС RU.32001.04ИБФ1.ОСПЗ2.74154</p>
          </div>
        </div>
        <div className="mt-4 bg-electric-blue/5 rounded-lg p-4">
          <p className="text-light-grey/70 text-sm">
            <strong className="text-electric-blue">Выдавший орган:</strong> Система добровольной сертификации «ПРОМТЕХСТАНДАРТ» (Федеральное агентство по техническому регулированию и метрологии)
          </p>
          <p className="text-light-grey/60 text-xs mt-2">
            Все сертификаты действительны и подтверждают соответствие продукции требованиям технических условий и безопасности.
          </p>
        </div>
      </div>
    </div>
  );
};