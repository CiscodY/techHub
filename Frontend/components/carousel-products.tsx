"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useRouter } from "next/navigation"

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1299,
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400",
    store: "Apple Store",
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    price: 1999,
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
    store: "Best Buy",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    price: 999,
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=400",
    store: "Amazon",
  },
  {
    id: 4,
    name: "iPad Air",
    price: 599,
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=400",
    store: "Apple Store",
  },
]

export default function CarouselProducts() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_PRODUCTS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_PRODUCTS.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? FEATURED_PRODUCTS.length - 1 : prev - 1))
  }

  const handleProductClick = () => {
    router.push(`/product?id=${FEATURED_PRODUCTS[currentIndex].id}`)
  }

  const product = FEATURED_PRODUCTS[currentIndex]

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Productos Más Populares</h2>

      <div
        className="relative rounded-lg overflow-hidden bg-card border border-border cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="relative w-full h-96 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full hover:scale-105 transition-all duration-500 ease-out animate-in fade-in slide-in-from-right-10"
          />

          {/* Product Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-all duration-500 ease-out">
            <h3 className="text-2xl font-bold text-white mb-2 animate-in fade-in">{product.name}</h3>
            <div className="flex items-center justify-between">
              <div className="animate-in fade-in">
                <p className="text-3xl font-bold text-accent mb-1">${product.price}</p>
                <p className="text-sm text-gray-300">{product.store}</p>
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full animate-in fade-in">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-white font-medium">{product.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            prevSlide()
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            nextSlide()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {FEATURED_PRODUCTS.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(index)
              }}
              className={`rounded-full transition-all duration-300 ease-out ${
                index === currentIndex ? "bg-accent w-8 h-3" : "bg-white/50 hover:bg-white/70 w-3 h-3"
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
