'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Star, ChevronLeft, ExternalLink, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import PriceChart from '@/components/price-chart'
import ReviewsSection from '@/components/reviews-section'
import { ProductsApi, Product } from '@/lib/products-api'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [stores, setStores] = useState<Array<{name: string, price: number, available: boolean}>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('');
      
      console.log('🔄 Cargando producto con ID:', params.id);
      
      let debugLog = `🔄 Iniciando carga para ID: ${params.id}\n`;
      
      // Verificar si estamos en el navegador
      if (typeof window !== 'undefined') {
        debugLog += `🌐 window disponible: Sí\n`;
        debugLog += `📋 localStorage disponible: ${!!window.localStorage}\n`;
        
        // Ver todas las claves en localStorage
        debugLog += `🗂️ Claves en localStorage (${localStorage.length}):\n`;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key);
            debugLog += `  • ${key}: ${value?.substring(0, 80)}...\n`;
          }
        }
        
        // Intentar obtener del localStorage
        const productKey = `product_${params.id}`;
        const productNameKey = `product_${params.id}_name`;
        const currentProductKey = 'current_product';
        
        debugLog += `\n🔍 Buscando claves:\n`;
        debugLog += `  • ${productKey}: ${localStorage.getItem(productKey) ? 'Encontrado' : 'No encontrado'}\n`;
        debugLog += `  • ${productNameKey}: ${localStorage.getItem(productNameKey) ? 'Encontrado' : 'No encontrado'}\n`;
        debugLog += `  • ${currentProductKey}: ${localStorage.getItem(currentProductKey) ? 'Encontrado' : 'No encontrado'}\n`;
        
        let loadedProduct: Product | null = null;
        
        // Primero intentar con la clave específica
        const specificProduct = localStorage.getItem(productKey);
        if (specificProduct) {
          try {
            loadedProduct = JSON.parse(specificProduct);
            debugLog += `✅ Producto cargado desde ${productKey}\n`;
          } catch (e) {
            debugLog += `❌ Error parseando ${productKey}: ${e}\n`;
          }
        }
        
        // Si no, intentar con current_product
        if (!loadedProduct) {
          const currentProduct = localStorage.getItem(currentProductKey);
          if (currentProduct) {
            try {
              const parsed = JSON.parse(currentProduct);
              if (parsed.id === params.id) {
                loadedProduct = parsed;
                debugLog += `✅ Producto cargado desde ${currentProductKey}\n`;
              } else {
                debugLog += `⚠️ current_product tiene ID diferente (${parsed.id} vs ${params.id})\n`;
              }
            } catch (e) {
              debugLog += `❌ Error parseando ${currentProductKey}: ${e}\n`;
            }
          }
        }
        
        // Si aún no, intentar solo con el nombre
        if (!loadedProduct) {
          const productName = localStorage.getItem(productNameKey);
          if (productName) {
            debugLog += `🔍 Intentando buscar por nombre: ${productName}\n`;
            loadedProduct = await ProductsApi.getProductById(params.id, productName);
            if (loadedProduct) {
              debugLog += `✅ Producto encontrado por nombre\n`;
            }
          }
        }
        
        setDebugInfo(debugLog);
        
        if (!loadedProduct) {
          debugLog += `⚠️ Producto no encontrado en localStorage\n`;
          
          // Intentar buscar con un término genérico basado en el ID
          const searchTerms = ['laptop', 'smartphone', 'tablet', 'camera', 'headphones'];
          const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
          
          debugLog += `🔍 Intentando búsqueda genérica: ${randomTerm}\n`;
          
          try {
            // Buscar productos y tomar el primero
            const results = await ProductsApi.search(randomTerm);
            if (results.length > 0) {
              loadedProduct = results[0];
              loadedProduct.id = params.id; // Mantener el ID original
              debugLog += `✅ Usando primer resultado de búsqueda genérica\n`;
            }
          } catch (searchError) {
            debugLog += `❌ Error en búsqueda genérica: ${searchError}\n`;
          }
        }
        
        if (!loadedProduct) {
          debugLog += `❌ No se pudo cargar ningún producto\n`;
          setError('No se pudieron cargar los detalles del producto. Por favor, busca el producto nuevamente y haz clic en él.');
          
          loadedProduct = {
            id: params.id,
            name: 'Producto Tecnológico',
            price: 299.99,
            rating: 4.0,
            image: '/placeholder.svg',
            category: 'Electrónica',
            onSale: false,
            discount: 0,
            source: 'Varias tiendas',
            link: '#',
            snippet: 'Para ver los detalles completos, busca el producto en la página principal y haz clic en él.',
            originalPrice: 349.99,
          };
        }
        
        console.log('📦 Producto cargado:', loadedProduct);
        setProduct(loadedProduct);
        
        // Cargar tiendas para este producto
        debugLog += `\n🏪 Cargando tiendas para: ${loadedProduct.name}\n`;
        const productStores = await ProductsApi.getStoresForProduct(loadedProduct.name);
        
        if (productStores.length > 0) {
          setStores(productStores);
          debugLog += `✅ Tiendas cargadas: ${productStores.length}\n`;
        } else {
          debugLog += `⚠️ No se encontraron tiendas específicas, usando tiendas por defecto\n`;
          setStores([
            { name: 'Amazon', price: loadedProduct.price * 0.95, available: true },
            { name: 'Best Buy', price: loadedProduct.price * 0.98, available: true },
            { name: 'Walmart', price: loadedProduct.price, available: true },
          ]);
        }
        
        setDebugInfo(debugLog);
        console.log(debugLog);
        
      } else {
        setDebugInfo('❌ window no está disponible (Server-side Rendering)');
        setError('Error de renderizado. Recarga la página.');
      }
      
    } catch (err: any) {
      console.error('❌ Error completo cargando producto:', err);
      setError(`Error al cargar los detalles: ${err.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  // Especificaciones técnicas genéricas basadas en categoría
  const getSpecs = () => {
    if (!product) return []
    
    const baseSpecs = [
      { label: 'Categoría', value: product.category },
      { label: 'Puntuación', value: `${product.rating.toFixed(1)} / 5.0` },
      { label: 'Precio', value: `$${product.price.toFixed(2)}` },
    ]
    
    if (product.source) {
      baseSpecs.push({ label: 'Fuente', value: product.source })
    }
    
    // Agregar información adicional si está disponible
    if (product.snippet && product.snippet.length < 100) {
      baseSpecs.push({ label: 'Descripción', value: product.snippet });
    }
    
    return baseSpecs
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors w-fit"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al catálogo
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando detalles del producto...</p>
            <p className="text-xs text-muted-foreground mt-2">ID: {params.id}</p>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors w-fit"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al catálogo
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">Producto no encontrado</p>
            <div className="space-y-4">
              <Link href="/">
                <Button variant="default">Volver al catálogo</Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="ml-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors w-fit"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">
                  {error}
                </p>
                <div className="mt-2">
                  <Link href="/" className="text-sm text-primary hover:underline mr-4">
                    ← Buscar producto
                  </Link>
                  <button 
                    onClick={loadProduct}
                    className="text-sm text-primary hover:underline"
                  >
                    <RefreshCw className="w-3 h-3 inline mr-1" />
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="bg-gray-900 text-gray-100 p-4 text-xs font-mono overflow-auto max-h-64 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Debug Info</span>
            <button 
              onClick={() => setDebugInfo('')}
              className="text-gray-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>
          <pre className="whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Product Image and Basic Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div className="relative rounded-lg overflow-hidden bg-muted aspect-square">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.onSale && product.discount && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {/* Prices from different stores */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-foreground">
                    Precios en tiendas
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {stores.length} tiendas
                  </span>
                </div>
                <div className="space-y-2">
                  {stores.map((store, index) => (
                    <div
                      key={`${store.name}-${index}`}
                      className="flex items-center justify-between text-sm p-2 rounded border border-border hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{store.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                          ${store.price.toFixed(2)}
                        </span>
                        {store.available ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Disponible
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Agotado
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buy Button */}
              <Button 
                size="lg" 
                className="w-full rounded-lg"
                onClick={() => {
                  if (product.link && product.link !== '#') {
                    window.open(product.link, '_blank');
                  } else {
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(product.name)}`, '_blank');
                  }
                }}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {product.link && product.link !== '#' ? 'Ver en tienda' : 'Buscar en Google'}
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Title and Rating */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {product.category}
                  </p>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                    {product.name}
                  </h1>
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {product.id}
                </div>
              </div>

              {/* Rating and Reviews */}
              {product.rating > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-accent text-accent'
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {product.rating.toFixed(1)} de 5
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Basado en múltiples reseñas
                    </p>
                  </div>
                </div>
              )}

              {/* Price Section */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Precio actual
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="text-xl line-through text-muted-foreground">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        {product.discount && (
                          <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                            -{product.discount}%
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.snippet && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Descripción
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.snippet}
                  </p>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Información del producto
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getSpecs().map((spec) => (
                  <div
                    key={spec.label}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {spec.label}
                    </p>
                    <p className="font-semibold text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Price History Chart */}
        <div className="bg-card border border-border rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Historial de precios
          </h2>
          <PriceChart />
        </div>

        {/* Reviews Section */}
        <ReviewsSection productId={params.id} />
      </div>
    </main>
  )
}