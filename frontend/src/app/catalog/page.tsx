'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/SkeletonCard';
import { api } from '@/lib/api';
import type { Product, Category } from '@/lib/api';

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          api.getCategories(),
          api.getProducts(sortBy === 'default' ? undefined : sortBy)
        ]);
        
        if (categoriesData) setCategories(categoriesData);
        if (productsData) setProducts(productsData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sortBy]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Каталог оборудования</h1>
        
        <h2 className="text-2xl font-semibold mb-6">Категории</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/5 h-16 rounded-lg animate-pulse" />
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-6">Все товары</h2>
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Каталог оборудования</h1>

      <h2 className="text-2xl font-semibold mb-6">Категории</h2>
      {categories.length > 0 ? (
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

      <div className="flex flex-col sm:flex-row justify-between items-center mt-16 mb-6">
        <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Все товары</h2>
        
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-light-grey font-medium">
            Сортировка:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-dark-blue border border-electric-blue/30 rounded-lg px-4 py-2 text-light-grey focus:outline-none focus:border-electric-blue transition-colors"
          >
            <option value="default">По умолчанию</option>
            <option value="name">По названию (А-Я)</option>
            <option value="-name">По названию (Я-А)</option>
            <option value="price">По цене (возрастание)</option>
            <option value="-price">По цене (убывание)</option>
            <option value="-id">Сначала новые</option>
            <option value="id">Сначала старые</option>
          </select>
        </div>
      </div>

      {products.length > 0 ? (
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