import { Button } from '@/components/Button';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

// --- Иконки для блока "Производство" ---
const WrenchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.83-5.83M11.42 15.17l-4.95-4.95a2.652 2.652 0 0 1 0-3.749l5.25-5.25a2.652 2.652 0 0 1 3.749 0l4.95 4.95M11.42 15.17 7.5 19.125" />
  </svg>
);
const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Z" />
  </svg>
);
const ArchiveBoxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);
// ----------------------------------------------------

// --- Данные для бегущей строки ---

// --- КОМПОНЕНТ ГЛАВНОЙ СТРАНИЦЫ ---
export default async function HomePage() {
  const ourProducts = (await api.getProducts())?.slice(0, 4) || [];

  return (
    <main>
      {/* === Блок 1: Первый экран (Hero) === */}
      <div className="relative text-center py-32 md:py-48 flex items-center justify-center overflow-hidden">
        <AnimatedBackground />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-electric-blue/20 rounded-full blur-3xl animate-pulse" />
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold">
            Учебное оборудование от производителя <span className="text-electric-blue">ЛАБОСФЕРА</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-light-grey/80">
            Поставляем оборудование для ОГЭ по физике/химии в полном соответствии ФИПИ. Собственное производство и прямая заводская гарантия.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog"><Button>Смотреть продукцию</Button></Link>
            <Link href="/production"><Button variant="secondary">О производстве</Button></Link>
          </div>
        </Container>
      </div>

      {/* === Блок 2: Наше производство (Bento Grid + Spotlight) === */}
      <AnimatedSection className="py-20 bg-dark-blue relative overflow-hidden">
        {/* Добавляем плавающие частицы на фон */}
        <div className="absolute inset-0">
          <div className="absolute w-64 h-64 -left-32 -top-32 bg-electric-blue/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute w-96 h-96 -right-48 -bottom-48 bg-electric-blue/5 rounded-full blur-3xl animate-float-slower"></div>
        </div>
        <Container className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-light-grey/80 bg-clip-text text-transparent">
              Собственное производство — гарантия высочайшего качества
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-light-grey/70 animate-fade-in">
              Мы не просто продаем, мы создаем. Это позволяет нам контролировать каждый этап и предлагать качественное оборудование и ПО.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SpotlightCard className="lg:col-span-2 flex flex-col items-center justify-center text-center">
              <WrenchIcon className="w-16 h-16 text-electric-blue mb-4" />
              <h3 className="text-2xl font-semibold">Современное оборудование</h3>
              <p className="mt-2 text-light-grey/60 max-w-md">Используем высокоточные станки с ЧПУ и 3D-печать для производства надежных и долговечных компонентов.</p>
            </SpotlightCard>
            <SpotlightCard className="flex flex-col items-center justify-center text-center">
              <ShieldCheckIcon className="w-12 h-12 text-electric-blue mb-4" />
              <h3 className="text-xl font-semibold">Контроль качества</h3>
              <p className="mt-2 text-light-grey/60">Каждое изделие проходит многоступенчатую проверку.</p>
            </SpotlightCard>
            <SpotlightCard className="lg:col-span-3 flex flex-col items-center justify-center text-center">
              <ArchiveBoxIcon className="w-12 h-12 text-electric-blue mb-4" />
              <h3 className="text-xl font-semibold">Складская программа</h3>
              <p className="mt-2 text-light-grey/60">Поддерживаем наличие популярных комплектов для быстрой отгрузки по всей России.</p>
            </SpotlightCard>
          </div>
        </Container>
      </AnimatedSection>

      {/* === Бегущая строка === */}
      {/* === Блок 3: Наша продукция (с 3D-эффектом) === */}
      <AnimatedSection className="py-20">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold">Наша продукция</h2>
            <p className="mt-4 max-w-2xl mx-auto text-light-grey/70">Мы производим и поставляем всё необходимое для успешной сдачи практической части экзамена.</p>
          </div>
          {ourProducts.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {ourProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-light-grey/70">Не удалось загрузить продукцию.</p>
          )}
        </Container>
      </AnimatedSection>
    </main>
  );
}