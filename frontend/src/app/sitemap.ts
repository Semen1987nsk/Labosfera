import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  try {
    const [products, categories] = await Promise.all([
      api.getProducts(),
      api.getCategories()
    ]);
    
    const productUrls = (products || []).map(p => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }));
    
    const categoryUrls = (categories || []).map(c => ({
      url: `${baseUrl}/catalog/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    }));
    
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${baseUrl}/catalog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${baseUrl}/contacts`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
      },
      {
        url: `${baseUrl}/technical-task`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
      },
      {
        url: `${baseUrl}/certificates`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5
      },
      ...categoryUrls,
      ...productUrls
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [{
      url: baseUrl,
      lastModified: new Date()
    }];
  }
}