import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
import { api } from '@/lib/api';

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([
    api.getCategories(),
    api.getProducts()
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Каталог оборудования</h1>

      <h2 className="text-2xl font-semibold mb-6">Категории</h2>
      {(categories && categories.length > 0) ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/catalog/${category.slug}`}
              className="block bg-dark-blue p-4 rounded-lg text-center transition-all duration-300 hover:bg-electric-blue/20 hover:-translate-y-1"
            >
              <h3 className="font-semibold text-light-grey">{category.name}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-light-grey/70">Категории не найдены или не удалось загрузить.</p>
      )}

      <h2 className="text-2xl font-semibold mt-16 mb-6">Все товары</h2>
      {(products && products.length > 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-light-grey/70">Товары не найдены или не удалось загрузить.</p>
      )}
    </div>
  );
}