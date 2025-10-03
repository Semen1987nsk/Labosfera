import { api } from '@/lib/api';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await api.getProductDetail(params.slug);
    
    if (!product) {
      return {
        title: 'Товар не найден',
        description: 'Запрашиваемый товар не найден'
      };
    }

    // Очищаем HTML теги из описания для meta description
    const cleanDescription = product.description
      .replace(/<[^>]*>/g, '') // убираем HTML теги
      .substring(0, 160); // обрезаем до 160 символов

    const mainImage = product.images?.find(img => img.is_main) || product.images?.[0];
    const imageUrl = mainImage?.image || null;

    return {
      title: product.name,
      description: cleanDescription || `${product.name} - учебное оборудование от ЛАБОСФЕРА`,
      openGraph: {
        title: product.name,
        description: cleanDescription,
        type: 'website',
        images: imageUrl ? [imageUrl] : [],
      },
      keywords: [
        product.name,
        'учебное оборудование',
        'ОГЭ',
        'ГИА',
        product.category_name || '',
        'ЛАБОСФЕРА'
      ].filter(Boolean)
    };
  } catch (error) {
    return {
      title: 'Товар не найден',
      description: 'Произошла ошибка при загрузке товара'
    };
  }
}