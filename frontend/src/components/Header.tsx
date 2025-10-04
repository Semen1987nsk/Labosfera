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

        <div className="hidden md:flex items-center gap-4">
          <CartIcon />
          <Button variant="secondary" onClick={handleContactClick}>
            Связаться с нами
          </Button>
        </div>
        
        <div className="md:hidden">{/* Burger menu placeholder */}</div>
      </div>
    </motion.header>
  );
};