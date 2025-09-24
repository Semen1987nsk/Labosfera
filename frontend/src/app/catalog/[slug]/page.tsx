import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
interface Product { id: number; name: string; price: string; image: string | null; }
interface CategoryDetail { id: number; name: string; slug: string; products: Product[]; }

const BACKEND_URL = 'https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev';

export async function generateStaticParams() {
  const apiUrl = `${BACKEND_URL}/api/v1/categories/`;
  try {
    const res = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return [];
    const categories: { slug: string }[] = await res.json();
    return categories.map((category) => ({ slug: category.slug }));
  } catch (error) { return []; }
}

async function getCategoryDetail(slug: string): Promise<CategoryDetail | null> {
  const apiUrl = `${BACKEND_URL}/api/v1/categories/${slug}/`;
  try {
    const res = await fetch(apiUrl, { cache: 'no-store', headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) { return null; }
}

export default async function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryDetail(params.slug);
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Категория не найдена</h1>
        <Link href="/catalog" className="mt-8 inline-block bg-electric-blue text-white px-6 py-3 rounded-lg">Вернуться в каталог</Link>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-sm text-light-grey/70 mb-4"><Link href="/catalog" className="hover:text-white">Каталог</Link> / {category.name}</div>
      <h1 className="text-4xl font-bold mb-8">{category.name}</h1>
      {category.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {category.products.map((product) => (<ProductCard key={product.id} product={product} />))}
        </div>
      ) : <p>В этой категории пока нет товаров.</p>}
    </div>
  );
}