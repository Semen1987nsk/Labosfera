'use client';

import Link from 'next/link';
import { Button } from '@/components/Button'; // Этот путь ВЕРНЫЙ
import { MegaMenu } from './MegaMenu'; // <-- ИСПРАВЛЕННЫЙ ПУТЬ

export const Header = () => {
  return (
    <header className="bg-dark-blue/50 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold text-light-grey">
          ЛАБО<span className="text-electric-blue">СФЕРА</span>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-8">
          <MegaMenu />
          
          <Link href="/production" className="text-base font-semibold leading-6 text-light-grey/80 hover:text-white">
            О производстве
          </Link>

          <Link href="/certificates" className="text-base font-semibold leading-6 text-light-grey/80 hover:text-white">
            Сертификаты
          </Link>
          
          <Link href="/custom-task" className="text-base font-semibold leading-6 text-light-grey/80 hover:text-white">
            Техническое задание
          </Link>

          <Link href="/contacts" className="text-base font-semibold leading-6 text-light-grey/80 hover:text-white">
            Контакты
          </Link>
        </nav>

        {/* Кнопка связи */}
        <div className="hidden md:block">
          <Button variant="secondary">Связаться с нами</Button>
        </div>
        
        {/* Placeholder для мобильного меню */}
        <div className="md:hidden">
            {/* Здесь будет бургер-меню */}
        </div>

      </div>
    </header>
  );
};