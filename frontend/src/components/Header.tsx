'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { MegaMenu } from '@/components/MegaMenu'; // Этот путь ВЕРНЫЙ
import { CartIcon } from '@/components/ui/CartIcon';

export const Header = () => {
  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-dark-blue/50 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-light-grey">
          ЛАБО<span className="text-electric-blue">СФЕРА</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <MegaMenu />
          <Link href="/production" className="text-base font-semibold leading-6 text-light-grey/80 hover:text-white">
            О производстве
          </Link>
          <Link href="/certificates" className="text-base font-semibold leading-6 text-light-grey/80 hover:text-white">
            Сертификаты
          </Link>
          <Link href="/technical-task" className="text-base font-semibold leading-6 text-light-grey/80 hover:text-white">
            Техническое задание
          </Link>
          <Link href="/contacts" className="text-base font-semibold leading-6 text-light-grey/80 hover:text-white">
            Контакты
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
    </header>
  );
};