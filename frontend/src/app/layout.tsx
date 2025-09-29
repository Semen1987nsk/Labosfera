import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'ЛАБОСФЕРА - Учебное оборудование',
  description: 'Производитель учебного оборудования для ОГЭ/ГИА',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="%2314182C"/><text x="16" y="22" font-family="Arial" font-size="20" font-weight="bold" fill="white" text-anchor="middle">Л</text><circle cx="24" cy="8" r="4" fill="%233A86FF"/></svg>'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-deep-blue text-light-grey`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}