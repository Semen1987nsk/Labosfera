// Определяем новый тип для пагинированного ответа
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Определяем типы данных в одном месте
export interface ProductImage {
  id: number;
  image: string;
  is_main: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  images: ProductImage[];
  description: string;
  category: number;
  category_name?: string;
}

// Типы для заявок
export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface OrderData {
  name: string;
  phone: string;
  email: string;
  organization: string;
  items: OrderItem[];
}

export interface ContactData {
  name: string;
  phone: string;
  email: string;
  request_type: string;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  order_id?: number;
  request_id?: number;
  errors?: any;
}

// Наш "мост" к API
class ApiClient {
  private baseUrl: string;

  constructor() {
    // Читаем URL из переменных окружения.
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

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
        console.error(`API Error: ${response.status} ${response.statusText} for ${this.baseUrl}${endpoint}`);
        return null;
      }

      return response.json();

    } catch (error) {
      console.error(`Network or parsing error for ${this.baseUrl}${endpoint}:`, error);
      return null;
    }
  }

  // --- Методы для работы с API ---

  public async getCategories(): Promise<Category[] | null> {
    const response = await this.request<PaginatedResponse<Category>>('/api/v1/categories/');
    return response ? response.results : null;
  }

  public async getProducts(): Promise<Product[] | null> {
    const response = await this.request<PaginatedResponse<Product>>('/api/v1/products/');
    return response ? response.results : null;
  }
  
  public getCategoryDetail(slug: string) {
    return this.request<Category>(`/api/v1/categories/${slug}/`);
  }
  
  public async getProductDetail(slug: string): Promise<Product | null> {
    console.log('Fetching product details for slug:', slug);
    const response = await this.request<Product>(`/api/v1/products/${slug}/`);
    console.log('API response:', response);
    return response;
  }

  // Методы для заявок
  public async createOrder(orderData: OrderData): Promise<ApiResponse | null> {
    return this.request<ApiResponse>('/api/v1/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
  }

  public async createContactRequest(contactData: ContactData): Promise<ApiResponse | null> {
    return this.request<ApiResponse>('/api/v1/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
  }
}

export const api = new ApiClient();