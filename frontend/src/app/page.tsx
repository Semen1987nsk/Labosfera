import { Button } from '@/components/Button';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link';
import { api, Product } from '@/lib/api'; // <-- ИМПОРТИРУЕМ НАШ API-КЛИЕНТ И ТИП

// --- Временные данные для "Готовых решений" ---
const readySolutions = [
  { title: 'Кабинет химии "Стандарт"', description: 'Полный комплект оборудования по ФГОС' },
  { title: 'Лаборатория физики "Профи"', description: 'Для углубленного изучения предмета' },
  { title: 'Кабинет биологии "Цифровой"', description: 'С интерактивными микроскопами' },
  { title: 'IT-полигон и робототехника', description: 'Современное оснащение для будущих инженеров' },
];

export default async function HomePage() {
  // Получаем наши продукты через централизованный API-клиент
  const ourProducts = await api.getProducts() || [];

  return (
    <main>
      {/* === Блок 1: Первый экран (Hero) с новым позиционированием === */}
      <div className="relative text-center py-32 md:py-48 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-electric-blue/20 rounded-full blur-3xl animate-pulse" />
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold">
            Оборудование для ОГЭ по физике и химии<br /> от производителя <span className="text-electric-blue">ЛАБОСФЕРА</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-light-grey/80">
            Полное оснащение кабинетов для проведения лабораторных работ ГИА в соответствии со спецификацией КИМ.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button>Смотреть продукцию</Button>
            </Link>
            <Link href="/production">
              <Button variant="secondary">О производстве</Button>
            </Link>
          </div>
        </Container>
      </div>

      {/* === Блок 2: Наша продукция (вместо "Популярные товары") === */}
      <section className="py-20 bg-dark-blue">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold">Наша продукция</h2>
            <p className="mt-4 max-w-2xl mx-auto text-light-grey/70">Мы производим и поставляем всё необходимое для успешной сдачи практической части экзамена.</p>
          </div>
          {ourProducts.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {ourProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-light-grey/70">Не удалось загрузить продукцию. Попробуйте обновить страницу.</p>
          )}
        </Container>
      </section>

      {/* === Блок 3: Наше производство === */}
      <section className="py-20">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold">Собственное производство — гарантия качества</h2>
            <p className="mt-4 max-w-2xl mx-auto text-light-grey/70">Мы не просто продаем, мы создаем. Это позволяет нам контролировать каждый этап и предлагать уникальные решения.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-64 bg-deep-blue rounded-lg flex items-center justify-center text-light-grey/50">Цех сборки</div>
            <div className="h-64 bg-deep-blue rounded-lg flex items-center justify-center text-light-grey/50">Лаборатория контроля</div>
            <div className="h-64 bg-deep-blue rounded-lg flex items-center justify-center text-light-grey/50">Склад готовой продукции</div>
          </div>
        </Container>
      </section>
      
      {/* === Блок 4: Готовые решения === */}
      <section className="py-20 bg-dark-blue">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold">Готовые решения для ваших задач</h2>
            <p className="mt-4 max-w-2xl mx-auto text-light-grey/70">Мы уже продумали все за вас. Выберите готовый комплект для оснащения кабинета.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {readySolutions.map((solution) => (
              <div key={solution.title} className="p-6 bg-deep-blue rounded-lg text-center transition-transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold">{solution.title}</h3>
                <p className="mt-2 text-sm text-light-grey/60">{solution.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}