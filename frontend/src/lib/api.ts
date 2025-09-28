// Определяем новый тип для пагинированного ответа
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Определяем типы данных в одном месте
export interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string | null;
  description: string;
  category: number;
  category_name?: string;
  slug: string;
}

// Наш "мост" к API
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  // Теперь request может работать и с обычными ответами, и с пагинированными
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        return null;
      }

      return response.json();

    } catch (error) {
      console.error('Network or parsing error:', error);
      return null;
    }
  }

  // --- Методы для работы с API ---

  // ИЗМЕНЕНО: Теперь эти методы ожидают пагинированный ответ
  // и возвращают только массив `results`.
  public async getCategories(): Promise<Category[] | null> {
    const response = await this.request<PaginatedResponse<Category>>('/api/v1/categories/');
    return response ? response.results : null;
  }

  public async getProducts(): Promise<Product[] | null> {
    const response = await this.request<PaginatedResponse<Product>>('/api/v1/products/');
    return response ? response.results : null;
  }
  
  // Детальные запросы не пагинируются, их оставляем как есть
  public getCategoryDetail(slug: string) {
    return this.request<Category>(`/api/v1/categories/${slug}/`);
  }
  
  public getProductDetail(id: string) {
    return this.request<Product>(`/api/v1/products/${id}/`);
  }
}

// Создаем единственный экземпляр клиента для всего приложения
export const api = new ApiClient();