'use client';

import React from 'react';

const contactItems = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: 'Телефон',
    content: '8 800 456 4554',
    subtitle: 'Звоните в рабочие часы',
    href: 'tel:88004564554'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Email',
    content: 'info@labosfera.ru',
    subtitle: 'Ответим в течение 24 часов',
    href: 'mailto:info@labosfera.ru'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Адрес производства',
    content: 'г. Новосибирск, ул. Королева, д. 40',
    subtitle: 'Производственная площадка',
    href: null
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Режим работы',
    content: 'Пн-Пт: 9:00 - 18:00',
    subtitle: 'Сб-Вс: выходные',
    href: null
  }
];

export const ContactInfo = () => {
  return (
    <div className="bg-deep-blue rounded-2xl p-8 border border-white/10">
      <h3 className="text-2xl font-semibold mb-6">Контактная информация</h3>
      <div className="space-y-6">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-electric-blue/20 rounded-lg flex items-center justify-center text-electric-blue">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-medium text-white mb-1">{item.title}</h4>
              {item.href ? (
                <a 
                  href={item.href} 
                  className="text-electric-blue hover:text-electric-blue/80 transition-colors font-medium"
                >
                  {item.content}
                </a>
              ) : (
                <p className="text-light-grey font-medium">{item.content}</p>
              )}
              <p className="text-light-grey/60 text-sm mt-1">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};