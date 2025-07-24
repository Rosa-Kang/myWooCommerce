import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import axios from 'axios';

// WooCommerce API instance
const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:10033',
  consumerKey: process.env.WC_CONSUMER_KEY || '',
  consumerSecret: process.env.WC_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true
});

// WordPress REST API instance for custom endpoints
const wpApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:10033'}/wp-json`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product interface
export interface Product {
  id: number;
  name: string;
  slug: string;
  type: string;
  status: string;
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  stock_quantity: number;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  extra_fields?: {
    size_guide_url: string;
    material: string;
    care_instructions: string;
    sustainability_info: string;
  };
  gallery_images?: Array<{
    id: number;
    url: string;
    thumbnail: string;
    medium: string;
    alt: string;
  }>;
}

// Category interface
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: {
    id: number;
    src: string;
    alt: string;
  } | null;
  count: number;
}

// Store info interface
export interface StoreInfo {
  name: string;
  description: string;
  currency: string;
  currency_symbol: string;
  country: string;
  timezone: string;
  date_format: string;
  time_format: string;
}

// Cart item interface
export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
}

// API Functions
export const woocommerce = {
  // Get all products
  async getProducts(params?: {
    per_page?: number;
    page?: number;
    category?: number;
    featured?: boolean;
    on_sale?: boolean;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<Product[]> {
    try {
      const response = await api.get('products', params);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  async getProduct(id: number): Promise<Product> {
    try {
      const response = await api.get(`products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await api.get('products', { slug });
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw error;
    }
  },

  // Get categories
  async getCategories(params?: {
    per_page?: number;
    hide_empty?: boolean;
  }): Promise<Category[]> {
    try {
      const response = await api.get('products/categories', params);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      const response = await wpApi.get('/headless/v1/featured-products');
      return response.data.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Fallback to WooCommerce API
      return this.getProducts({ featured: true, per_page: limit });
    }
  },

  // Search products
  async searchProducts(query: string, limit = 20): Promise<Product[]> {
    try {
      const response = await api.get('products', {
        search: query,
        per_page: limit
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId: number, params?: {
    per_page?: number;
    page?: number;
  }): Promise<Product[]> {
    try {
      const response = await api.get('products', {
        category: categoryId,
        ...params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Create order (for checkout)
  async createOrder(orderData: {
    payment_method: string;
    payment_method_title: string;
    set_paid: boolean;
    billing: any;
    shipping: any;
    line_items: Array<{
      product_id: number;
      quantity: number;
    }>;
  }) {
    try {
      const response = await api.post('orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
};

// WordPress custom endpoints
export const wordpress = {
  // Test API connection
  async testConnection(): Promise<any> {
    try {
      const response = await wpApi.get('/headless/v1/test');
      return response.data;
    } catch (error) {
      console.error('Error testing connection:', error);
      throw error;
    }
  },

  // Get store information
  async getStoreInfo(): Promise<StoreInfo> {
    try {
      const response = await wpApi.get('/headless/v1/store-info');
      return response.data;
    } catch (error) {
      console.error('Error fetching store info:', error);
      throw error;
    }
  },

  // Get testimonials
  async getTestimonials(): Promise<any[]> {
    try {
      const response = await wpApi.get('/wp/v2/testimonial');
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  // Get FAQs
  async getFAQs(): Promise<any[]> {
    try {
      const response = await wpApi.get('/wp/v2/faq');
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  }
};

// Helper functions
export const helpers = {
  // Format price for display
  formatPrice(price: string | number, currency = 'CAD'): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '$0.00';
    
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency,
    }).format(numPrice);
  },

  // Check if product is on sale
  isOnSale(product: Product): boolean {
    return product.on_sale && product.sale_price !== '';
  },

  // Get sale percentage
  getSalePercentage(regularPrice: string, salePrice: string): number {
    if (!salePrice || salePrice === '') return 0;
    const regular = parseFloat(regularPrice);
    const sale = parseFloat(salePrice);
    if (regular === 0) return 0;
    return Math.round(((regular - sale) / regular) * 100);
  },

  // Get main product image
  getMainImage(product: Product): string {
    return product.images && product.images.length > 0 
      ? product.images[0].src 
      : '/placeholder-product.jpg';
  },

  // Clean HTML from descriptions
  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  },

  // Generate product URL
  getProductUrl(product: Product): string {
    return `/products/${product.slug}`;
  },

  // Generate category URL
  getCategoryUrl(category: Category): string {
    return `/categories/${category.slug}`;
  },

  // Check if product is in stock
  isInStock(product: Product): boolean {
    return product.stock_status === 'instock';
  },

  // Get stock status text
  getStockStatusText(product: Product): string {
    switch (product.stock_status) {
      case 'instock':
        return 'In Stock';
      case 'outofstock':
        return 'Out of Stock';
      case 'onbackorder':
        return 'On Backorder';
      default:
        return 'Unknown';
    }
  }
};