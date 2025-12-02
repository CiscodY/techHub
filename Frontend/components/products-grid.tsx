"use client"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/products-api"

interface ProductsGridProps {
  products: Product[]
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  const router = useRouter()

  console.log('📦 ProductsGrid recibió products:', products);
  console.log('📊 Cantidad de productos recibidos:', products.length);

  // SOLO usar los productos recibidos por props - NO usar mocks
  const displayProducts = products;

  const handleProductClick = (product: Product) => {
    console.log('🖱️ Clic en producto:', product);
    
    // Guardar el producto completo en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`product_${product.id}`, JSON.stringify(product));
      localStorage.setItem(`product_${product.id}_name`, product.name);
      
      // También guardar como producto actual para acceso rápido
      localStorage.setItem('current_product', JSON.stringify(product));
      
      console.log('💾 Producto guardado en localStorage:', product.id);
    }
    
    // Navegar a la página de detalles del producto
    router.push(`/product/${product.id}`);
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8 text-foreground">
        {products.length > 0 ? `Resultados (${products.length} productos)` : "Ingresa un término de búsqueda"}
      </h2>

      {displayProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-lg font-medium text-foreground mb-3">🔍 Busca productos tecnológicos</p>
            <p className="text-muted-foreground mb-6">
              Ingresa palabras clave como "iPhone", "laptop", "tablet", etc. para buscar productos en tiempo real.
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>💡 <span className="font-medium">Ejemplos:</span> "celular samsung", "macbook pro", "cámara digital"</p>
              <p>⚠️ La búsqueda usa la API de Google Shopping a través de SerpAPI</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group cursor-pointer h-full"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300 ease-out h-full flex flex-col">
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Sale Badge */}
                  {(product.onSale || (product.discount && product.discount > 0)) && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {product.discount ? `-${product.discount}%` : 'Oferta'}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-xs font-medium text-muted-foreground mb-2">{product.category}</p>

                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-grow">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-lg font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-xs text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </p>
                    )}
                    {product.source && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Fuente: {product.source}
                      </p>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Button
                    size="sm"
                    className="w-full transition-all duration-300 ease-out hover:shadow-md hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleProductClick(product)
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ver detalles
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}