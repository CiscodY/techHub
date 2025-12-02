'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Star, ChevronLeft, TrendingDown, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import PriceChart from '@/components/price-chart'
import ReviewsSection from '@/components/reviews-section'

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = {
    id: params.id,
    name: 'iPhone 15 Pro Max',
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 2450,
    image: '/placeholder.svg?height=500&width=500',
    category: 'Celulares',
    onSale: true,
    discount: 15,
    stores: [
      { name: 'Apple Store', price: 1299, available: true },
      { name: 'Best Buy', price: 1279, available: true },
      { name: 'Amazon', price: 1289, available: true },
    ],
    specs: [
      { label: 'Pantalla', value: '6.7" Super Retina XDR' },
      { label: 'Procesador', value: 'Apple A17 Pro' },
      { label: 'Cámara', value: '48MP Principal' },
      { label: 'Batería', value: 'Hasta 29 horas' },
      { label: 'Almacenamiento', value: '256GB - 1TB' },
      { label: 'Conectividad', value: '5G, Wi-Fi 7' },
    ],
    description:
      'El iPhone 15 Pro Max es el smartphone más avanzado jamás creado. Con el chip A17 Pro, cámara de 48MP, pantalla ProMotion 120Hz y duración de batería excepcional.',
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
                {product.onSale && (
                  <div className="badge-sale">-{product.discount}%</div>
                )}
              </div>

              {/* Prices from different stores */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">
                  Precios en tiendas
                </h3>
                <div className="space-y-2">
                  {product.stores.map((store) => (
                    <div
                      key={store.name}
                      className="flex items-center justify-between text-sm p-2 rounded border border-border hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{store.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                          ${store.price}
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
              <Button size="lg" className="w-full rounded-lg">
                Comparar precios y comprar
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
              </div>

              {/* Rating and Reviews */}
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
                    {product.rating} de 5
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Basado en {product.reviews} reseñas
                  </p>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Precio actual
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <span className="text-xl line-through text-muted-foreground">
                      ${product.originalPrice}
                    </span>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      -{product.discount}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Descripción
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Especificaciones técnicas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.specs.map((spec) => (
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
