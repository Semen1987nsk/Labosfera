import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { CartSlideOut } from '@/components/ui/CartSlideOut';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'ЛАБОСФЕРА - Учебное оборудование',
  description: 'Производитель учебного оборудования для ОГЭ/ГИА'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-deep-blue text-light-grey`}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartSlideOut />
        </CartProvider>
      </body>
    </html>
  );
}