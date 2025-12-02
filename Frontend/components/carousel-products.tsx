"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProductsApi, Product } from "@/lib/products-api"

export default function CarouselProducts() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        setLoading(true)
        setError(null)
        console.log('🔄 Cargando productos para carrusel...')
        
        // Usar el método para obtener productos destacados
        const products = await ProductsApi.getFeaturedProducts(4)
        console.log('✅ Productos cargados para carrusel:', products.length)
        
        if (products.length > 0) {
          setFeaturedProducts(products)
        } else {
          setError("No se pudieron cargar productos para el carrusel")
        }
      } catch (err) {
        console.error('❌ Error cargando productos del carrusel:', err)
        setError("Error al cargar los productos")
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  // Auto-rotación del carrusel
  useEffect(() => {
    if (featuredProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [featuredProducts])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1))
  }

  const handleProductClick = () => {
    if (featuredProducts.length > 0 && featuredProducts[currentIndex]) {
      const product = featuredProducts[currentIndex]
      console.log('🖱️ Clic en producto del carrusel:', product.id)
      router.push(`/product?id=${product.id}`)
    }
  }

  // Estados de carga y error
  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Productos Más Populares</h2>
        <div className="relative rounded-lg overflow-hidden bg-card border border-border h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando productos destacados...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Productos Más Populares</h2>
        <div className="relative rounded-lg overflow-hidden bg-card border border-border h-64 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-red-500 mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm text-primary hover:underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return null
  }

  const product = featuredProducts[currentIndex]

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Productos Más Populares</h2>
        <div className="text-sm text-muted-foreground">
          {featuredProducts.length} productos • Auto-rotación cada 5 segundos
        </div>
      </div>

      <div
        className="relative rounded-lg overflow-hidden bg-card border border-border cursor-pointer group"
        onClick={handleProductClick}
      >
        <div className="relative w-full h-96 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-all duration-500 ease-out"
          />

          {/* Overlay de información del producto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 transition-all duration-500 ease-out">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {product.category}
                </span>
                {product.onSale && product.discount && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500 text-white">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-accent mb-1">
                    ${product.price.toFixed(2)}
                  </p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-sm text-gray-300 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </p>
                  )}
                  <p className="text-sm text-gray-300">
                    {product.source || 'Tienda online'}
                  </p>
                </div>
                
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-white font-medium">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              
              {product.snippet && (
                <p className="text-sm text-gray-300 mt-3 line-clamp-2">
                  {product.snippet}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Botones de navegación */}
        {featuredProducts.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevSlide()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                nextSlide()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicadores de puntos */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
                  className={`rounded-full transition-all duration-300 ease-out ${
                    index === currentIndex 
                      ? "bg-accent w-8 h-3" 
                      : "bg-white/50 hover:bg-white/70 w-3 h-3"
                  }`}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Contador de productos */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {featuredProducts.length}
          </div>
        </div>
      </div>

      {/* Miniaturas de todos los productos en el carrusel */}
      {featuredProducts.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {featuredProducts.map((prod, index) => (
            <div
              key={prod.id}
              className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                index === currentIndex 
                  ? 'border-primary scale-105 shadow-lg' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="aspect-video bg-muted">
                <img
                  src={prod.image || "/placeholder.svg"}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-xs font-medium text-white truncate">
                  {prod.name}
                </p>
                <p className="text-xs font-bold text-accent">
                  ${prod.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}