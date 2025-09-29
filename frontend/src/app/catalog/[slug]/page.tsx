import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
import { api, Category } from '@/lib/api'; // <-- ИСПРАВЛЕНО: импортируем существующий тип Category
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/Button';

const BACKEND_URL = 'https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev';

// Эта функция "подсказывает" Next.js, какие страницы существуют
export async function generateStaticParams() {
  const categories = await api.getCategories();
  if (!categories) return [];
  return categories.map((category) => ({ slug: category.slug }));
}

// --- Функция для получения данных о категории ---
// Она теперь возвращает Promise<Category | null>
async function getCategoryDetail(slug: string): Promise<Category | null> {
  return api.getCategoryDetail(slug);
}

// --- Компонент страницы ---
export default async function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryDetail(params.slug);

  if (!category) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-bold">Категория не найдена</h1>
        <Link href="/catalog"><Button className="mt-8">Вернуться в каталог</Button></Link>
      </Container>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-sm text-light-grey/70 mb-4">
        <Link href="/catalog" className="hover:text-white">Каталог</Link> / {category.name}
      </div>
      <h1 className="text-4xl font-bold mb-8">{category.name}</h1>
      {category.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-light-grey/70 py-10">В этой категории пока нет товаров.</p>
      )}
    </div>
  );
}