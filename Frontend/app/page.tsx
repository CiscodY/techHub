'use client'

import { useState } from 'react'
import Header from '@/components/header'
import CarouselProducts from '@/components/carousel-products'
import SearchAndFilters from '@/components/search-and-filters'
import ProductsGrid from '@/components/products-grid'

export default function Home() {
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CarouselProducts />
        <SearchAndFilters onFiltered={setFilteredProducts} />
        <ProductsGrid products={filteredProducts} />
      </div>
    </main>
  )
}
