import { Button } from '@/components/Button'; // <-- ИСПРАВЛЕННЫЙ ПУТЬ
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link';

// --- Тип данных для товара ---
interface Product {
  id: number;
  name: string;
  price: string;
  image: string | null;
}

// --- ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ ТОВАРОВ С API (с вашим новым URL) ---
async function getPopularProducts(): Promise<Product[]> {
  const apiUrl = 'https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev/api/v1/products/';
  try {
    const res = await fetch(apiUrl, { 
      next: { revalidate: 3600 }, // Кэшируем на 1 час
      headers: {
        'Accept': 'application/json',
      }
    });
    if (!res.ok) {
      console.error("Failed to fetch popular products:", res.status);
      return [];
    }
    const products = await res.json();
    return products.slice(0, 4); // Берем только первые 4 товара для главной
  } catch (error) {
    console.error("Failed to fetch popular products:", error);
    return [];
  }
}

// --- Временные данные для "Готовых решений" ---
const readySolutions = [
  { title: 'Кабинет химии "Стандарт"', description: 'Полный комплект оборудования по ФГОС' },
  { title: 'Лаборатория физики "Профи"', description: 'Для углубленного изучения предмета' },
  { title: 'Кабинет биологии "Цифровой"', description: 'С интерактивными микроскопами' },
  { title: 'IT-полигон и робототехника', description: 'Современное оснащение для будущих инженеров' },
];

// --- КОМПОНЕНТ СТРАНИЦЫ ---
export default async function HomePage() {
  const popularProducts = await getPopularProducts();

  return (
    <main>
      {/* === Блок 1: Первый экран (Hero) === */}
      <div className="relative text-center py-32 md:py-48 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-electric-blue/20 rounded-full blur-3xl animate-pulse" />
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold">
            Учебное оборудование от производителя <span className="text-electric-blue">ЛАБОСФЕРА</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-light-grey/80">
            Комплексное оснащение школ по всей России в соответствии с ФГОС. Собственное производство и прямая заводская гарантия.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button>Смотреть каталог</Button>
            </Link>
            <Link href="/production">
              <Button variant="secondary">О производстве</Button>
            </Link>
          </div>
        </Container>
      </div>

      {/* === Блок 2: Наше производство === */}
      <section className="py-20 bg-dark-blue">
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
      
      {/* === Блок 3: Популярные товары === */}
      <section className="py-20 bg-dark-blue">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold">Популярные товары</h2>
          </div>
          {popularProducts.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-light-grey/70">Не удалось загрузить популярные товары.</p>
          )}
        </Container>
      </section>

      {/* === Блок 4: Готовые решения === */}
      <section className="py-20">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold">Готовые решения для ваших задач</h2>
            <p className="mt-4 max-w-2xl mx-auto text-light-grey/70">Мы уже продумали все за вас. Выберите готовый комплект для оснащения кабинета.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {readySolutions.map((solution) => (
              <div key={solution.title} className="p-6 bg-dark-blue rounded-lg text-center transition-transform hover:-translate-y-1">
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