import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { CartSlideOut } from '@/components/ui/CartSlideOut';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'ЛАБОСФЕРА - Учебное оборудование для ОГЭ/ГИА',
    template: '%s | ЛАБОСФЕРА'
  },
  description: 'Производитель учебного оборудования для подготовки к ОГЭ/ГИА по физике и химии. Лабораторные комплексы для школ.',
  keywords: ['учебное оборудование', 'ОГЭ', 'ГИА', 'лаборатория физика', 'химия', 'школьное оборудование'],
  authors: [{ name: 'ЛАБОСФЕРА' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ЛАБОСФЕРА',
    title: 'ЛАБОСФЕРА - Учебное оборудование',
    description: 'Производитель учебного оборудования для ОГЭ/ГИА'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-deep-blue text-light-grey`}>
        <ToastProvider>
          <CartProvider>
            <ScrollProgress />
            <Header />
            <main>{children}</main>
            <Footer />
            <CartSlideOut />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}