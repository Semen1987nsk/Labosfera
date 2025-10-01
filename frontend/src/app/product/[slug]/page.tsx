'use client'; // <-- ВАЖНО! Эта страница теперь клиентская

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import { api, Product } from "@/lib/api";
import { useEffect, useState } from "react"; // <-- Импортируем хуки
import { useCart } from '@/contexts/CartContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev';

// Убираем generateStaticParams, так как страница теперь динамическая
// export async function generateStaticParams() { ... }

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Состояния для хранения данных, выбранной картинки и статуса загрузки
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching product with slug:', params.slug);
        const productData = await api.getProductDetail(params.slug);
        console.log('Received product data:', productData);
        
        if (productData) {
          setProduct(productData);
          if (productData.images && productData.images.length > 0) {
            const mainImage = productData.images.find(img => img.is_main) || productData.images[0];
            setSelectedImage(mainImage.image);
          }
        } else {
          console.error('Product not found or API error');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  // Пока идет загрузка, показываем заглушку
  if (isLoading) {
    return <Container className="py-20 text-center"><h1>Загрузка...</h1></Container>;
  }

  // Если товар не найден или ошибка API
  if (!product) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Товар не найден</h1>
        <p className="text-light-grey/70 mb-8">Возможно, товар был удален или перемещен</p>
        <pre className="bg-deep-blue p-4 rounded mb-8 text-left">
          Запрашиваемый URL: {params.slug}
        </pre>
        <Link href="/catalog"><Button className="mt-4">Вернуться в каталог</Button></Link>
      </Container>
    );
  }

  // Формируем полный URL для главного (выбранного) изображения
  const fullSelectedImageUrl = selectedImage
    ? (selectedImage.startsWith('/') ? `${BACKEND_URL}${selectedImage}` : selectedImage)
    : null;

  return (
    <div className="bg-dark-blue py-12 md:py-20">
      <Container>
        <div className="text-sm text-light-grey/70 mb-4">
          <Link href="/catalog" className="hover:text-white">Каталог</Link> / 
          {product.category_name && (
            <Link href={`/catalog/${product.category_name.toLowerCase()}`} className="hover:text-white"> {product.category_name} </Link>
          )}
          / {product.name}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Левая колонка: Галерея */}
          <div>
            <div className="relative aspect-square bg-deep-blue rounded-lg">
              {fullSelectedImageUrl ? (
                <Image src={fullSelectedImageUrl} alt={product.name} fill style={{ objectFit: 'contain' }} className="p-8" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><span className="text-light-grey/50">Нет изображения</span></div>
              )}
            </div>
            {/* Миниатюры */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-4">
                {product.images.map(img => {
                  const thumbUrl = img.image.startsWith('/') ? `${BACKEND_URL}${img.image}` : img.image;
                  return (
                    <button 
                      key={img.id} 
                      onClick={() => setSelectedImage(img.image)} 
                      className={`relative aspect-square rounded-md overflow-hidden ring-2 transition-all ${selectedImage === img.image ? 'ring-electric-blue' : 'ring-transparent hover:ring-electric-blue/50'}`}
                    >
                      <Image src={thumbUrl} alt="thumbnail" fill style={{ objectFit: 'cover' }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Правая колонка: Информация */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            <p className="text-3xl font-bold text-electric-blue mt-4">
              {parseFloat(product.price).toLocaleString('ru-RU')} ₽
            </p>
            <div className="mt-8 prose prose-invert max-w-none text-light-grey/80"
              dangerouslySetInnerHTML={{ __html: product.description || 'Подробное описание товара скоро появится.' }}
            />
            <div className="mt-8">
              <Button 
                className="w-full md:w-auto"
                onClick={() => product && addItem(product)}
              >
                Добавить в корзину
              </Button>
            </div>
            <div className="mt-8 border-t border-white/10 pt-4 text-sm text-light-grey/60">
              <p>Артикул: LBS-{product.id.toString().padStart(6, '0')}</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}