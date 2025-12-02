import { apiFetch } from './api';

export interface ProductSearchResult {
  title: string;
  price: string;
  source: string;
  thumbnail: string;
  productApiId: string;
  link: string;
  snippet: string;
  rating: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  onSale: boolean;
  discount?: number;
  source?: string;
  link?: string;
  snippet?: string;
  originalPrice?: number;
}

export class ProductsApi {
  static async search(query: string): Promise<Product[]> {
    console.log('🔍 Buscando productos con query:', query);
    
    if (!query.trim()) {
      console.log('⚠️ Query vacío, retornando array vacío');
      return [];
    }

    try {
      console.log('🌐 Llamando a API:', `/api/search?query=${encodeURIComponent(query)}`);
      
      const data: ProductSearchResult[] = await apiFetch(`/api/search?query=${encodeURIComponent(query)}`);
      
      console.log('✅ Respuesta de la API:', data);
      console.log('📊 Cantidad de productos recibidos:', data.length);
      
      // Transformar los datos de la API al formato que espera el frontend
      const transformed = data.map((item, index) => {
        const transformedProduct = {
          id: item.productApiId || `product-${index}`,
          name: item.title || 'Producto sin nombre',
          price: this.parsePrice(item.price),
          rating: this.parseRating(item.rating),
          image: item.thumbnail || '/placeholder.svg',
          category: item.source || 'Electrónica',
          onSale: false,
          discount: this.calculateDiscount(item.price),
          source: item.source,
          link: item.link,
          snippet: item.snippet,
          originalPrice: this.calculateOriginalPrice(item.price),
        };
        
        console.log(`📦 Producto ${index + 1}:`, transformedProduct);
        return transformedProduct;
      });
      
      console.log('🎯 Productos transformados totales:', transformed.length);
      return transformed;
      
    } catch (error: any) {
      console.error('❌ Error en la búsqueda de productos:', error);
      console.error('📝 Detalles del error:', error.message);
      throw error;
    }
  }

  private static parsePrice(priceString: string): number {
    if (!priceString) {
      console.warn('⚠️ Precio vacío, usando 0');
      return 0;
    }
    
    // Convertir strings como "$1,299.00" a número 1299.00
    const numericString = priceString.replace(/[^0-9.]/g, '');
    const price = parseFloat(numericString);
    
    if (isNaN(price)) {
      console.warn(`⚠️ No se pudo parsear el precio: "${priceString}"`);
      return 0;
    }
    
    console.log(`💰 Parseando precio: "${priceString}" -> ${price}`);
    return price;
  }

  private static parseRating(ratingString: string): number {
    if (!ratingString) {
      console.warn('⚠️ Rating vacío, usando 4.0');
      return 4.0;
    }
    
    // Convertir rating de string a número
    const rating = parseFloat(ratingString);
    const result = isNaN(rating) || rating > 5 ? 4.0 : rating;
    
    console.log(`⭐ Parseando rating: "${ratingString}" -> ${result}`);
    return result;
  }

  private static calculateDiscount(priceString: string): number {
    // Simular un descuento aleatorio para algunos productos (30% de probabilidad)
    const hasDiscount = Math.random() < 0.3;
    if (hasDiscount) {
      const discount = Math.floor(Math.random() * 30) + 5; // 5% a 35% de descuento
      console.log(`🎁 Aplicando descuento del ${discount}%`);
      return discount;
    }
    return 0;
  }

  private static calculateOriginalPrice(priceString: string): number {
    const price = this.parsePrice(priceString);
    // Simular un precio original 10-30% más alto
    const multiplier = 1 + (Math.random() * 0.2 + 0.1); // 1.1 a 1.3
    const originalPrice = Math.round(price * multiplier);
    
    console.log(`🏷️ Precio original calculado: ${price} * ${multiplier.toFixed(2)} = ${originalPrice}`);
    return originalPrice;
  }

  static async getRandomProducts(count: number = 4): Promise<Product[]> {
    try {
      console.log('🎯 Obteniendo productos aleatorios');
      
      // Términos de búsqueda comunes para productos tecnológicos
      const techTerms = [
        "smartphone", "laptop", "tablet", "camera", 
        "headphones", "smartwatch", "gaming console", "monitor",
        "keyboard", "mouse", "printer", "router", "speaker"
      ];
      
      // Elegir un término aleatorio
      const randomTerm = techTerms[Math.floor(Math.random() * techTerms.length)];
      console.log(`🔍 Término aleatorio seleccionado: ${randomTerm}`);
      
      // Buscar productos con ese término
      const data: ProductSearchResult[] = await apiFetch(`/api/search?query=${encodeURIComponent(randomTerm)}&num=10`);
      
      console.log(`📦 Productos obtenidos para carrusel: ${data.length}`);
      
      // Si hay suficientes productos, seleccionar 4 al azar
      if (data.length >= count) {
        // Mezclar array y tomar los primeros 'count' elementos
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count);
        
        return selected.map((item, index) => ({
          id: item.productApiId || `carousel-${index}`,
          name: item.title || 'Producto sin nombre',
          price: this.parsePrice(item.price),
          rating: this.parseRating(item.rating),
          image: item.thumbnail || '/placeholder.svg',
          category: item.source || 'Electrónica',
          onSale: Math.random() > 0.5, // 50% de probabilidad de estar en oferta
          discount: this.calculateDiscount(item.price),
          source: item.source,
          link: item.link,
          snippet: item.snippet,
          originalPrice: this.calculateOriginalPrice(item.price),
        }));
      } else {
        // Si no hay suficientes productos, usar todos los disponibles
        return data.map((item, index) => ({
          id: item.productApiId || `carousel-${index}`,
          name: item.title || 'Producto sin nombre',
          price: this.parsePrice(item.price),
          rating: this.parseRating(item.rating),
          image: item.thumbnail || '/placeholder.svg',
          category: item.source || 'Electrónica',
          onSale: Math.random() > 0.5,
          discount: this.calculateDiscount(item.price),
          source: item.source,
          link: item.link,
          snippet: item.snippet,
          originalPrice: this.calculateOriginalPrice(item.price),
        }));
      }
      
    } catch (error) {
      console.error('❌ Error obteniendo productos aleatorios:', error);
      // Retornar array vacío en caso de error
      return [];
    }
  }
  
  // También puedes agregar un método para productos más populares si quieres
  static async getFeaturedProducts(count: number = 4): Promise<Product[]> {
    try {
      console.log('⭐ Obteniendo productos destacados');
      
      // Buscar productos populares
      const popularTerms = ["iphone", "samsung", "laptop", "gaming"];
      const randomPopularTerm = popularTerms[Math.floor(Math.random() * popularTerms.length)];
      
      const data: ProductSearchResult[] = await apiFetch(`/api/search?query=${encodeURIComponent(randomPopularTerm)}&num=8`);
      
      console.log(`📊 Productos destacados obtenidos: ${data.length}`);
      
      // Ordenar por rating (si está disponible) y tomar los mejores
      const sorted = [...data].sort((a, b) => {
        const ratingA = this.parseRating(a.rating);
        const ratingB = this.parseRating(b.rating);
        return ratingB - ratingA; // Descendente
      });
      
      const selected = sorted.slice(0, count);
      
      return selected.map((item, index) => {
        const price = this.parsePrice(item.price);
        const originalPrice = this.calculateOriginalPrice(item.price);
        const discount = originalPrice > price ? 
          Math.round((1 - price / originalPrice) * 100) : 
          this.calculateDiscount(item.price);
        
        return {
          id: item.productApiId || `featured-${index}`,
          name: item.title || 'Producto sin nombre',
          price: price,
          rating: this.parseRating(item.rating),
          image: item.thumbnail || '/placeholder.svg',
          category: item.source || 'Electrónica',
          onSale: discount > 0,
          discount: discount,
          source: item.source,
          link: item.link,
          snippet: item.snippet,
          originalPrice: originalPrice,
          store: item.source || 'Tienda online' // Agregamos store para el carrusel
        };
      });
      
    } catch (error) {
      console.error('❌ Error obteniendo productos destacados:', error);
      return [];
    }
  }
}
