'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { MegaMenu } from '@/components/MegaMenu';
import { CartIcon } from '@/components/ui/CartIcon';
import { motion, useScroll } from 'framer-motion';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return unsubscribe;
  }, [scrollY]);

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-blue/95 backdrop-blur-md border-white/20 shadow-lg shadow-electric-blue/5'
          : 'bg-dark-blue/50 backdrop-blur-sm border-white/10'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`container mx-auto px-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}
      >
        <Link
          href="/"
          className="text-2xl font-bold text-light-grey group relative"
        >
          ЛАБО<span className="text-electric-blue">СФЕРА</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue group-hover:w-full transition-all duration-300" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <MegaMenu />
          <Link
            href="/production"
            className="relative text-base font-semibold leading-6 text-light-grey/80 hover:text-white transition-colors group"
          >
            О производстве
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue group-hover:w-full transition-all duration-300" />
          </Link>
          <Link
            href="/certificates"
            className="relative text-base font-semibold leading-6 text-light-grey/80 hover:text-white transition-colors group"
          >
            Сертификаты
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue group-hover:w-full transition-all duration-300" />
          </Link>
          <Link
            href="/technical-task"
            className="relative text-base font-semibold leading-6 text-light-grey/80 hover:text-white transition-colors group"
          >
            Техническое задание
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue group-hover:w-full transition-all duration-300" />
          </Link>
          <Link
            href="/contacts"
            className="relative text-base font-semibold leading-6 text-light-grey/80 hover:text-white transition-colors group"
          >
            Контакты
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue group-hover:w-full transition-all duration-300" />
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          {/* Контактная информация */}
          <div className="flex flex-col gap-1 text-sm">
            <a 
              href="tel:88004564554" 
              className="text-light-grey hover:text-electric-blue transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-semibold">8 800 456 4554</span>
            </a>
            <a 
              href="mailto:info@labosfera.ru" 
              className="text-light-grey/80 hover:text-electric-blue transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@labosfera.ru</span>
            </a>
          </div>
          
          {/* Разделитель */}
          <div className="h-10 w-px bg-white/20"></div>
          
          <CartIcon />
          <Button variant="secondary" onClick={handleContactClick}>
            Связаться с нами
          </Button>
        </div>
        
        {/* Мобильная версия с контактами */}
        <div className="lg:hidden flex items-center gap-3">
          <a 
            href="tel:88004564554" 
            className="text-light-grey hover:text-electric-blue transition-colors"
            title="Позвонить"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
          <CartIcon />
          {/* Burger menu placeholder */}
        </div>
      </div>
    </motion.header>
  );
};