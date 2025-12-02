"use client"

import { useState, useEffect, useCallback } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProductSearch } from "@/hooks/use-product-search"

interface SearchAndFiltersProps {
  onFiltered: (products: any[]) => void
}

export default function SearchAndFilters({ onFiltered }: SearchAndFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [showSaleOnly, setShowSaleOnly] = useState(false)
  
  const { products, loading, error, search } = useProductSearch()

  // Debounce para evitar llamadas excesivas a la API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        search(searchTerm)
      } else {
        onFiltered([])
      }
    }, 500) // 500ms de delay

    return () => clearTimeout(timer)
  }, [searchTerm, search, onFiltered])

  // Cuando cambian los productos de la búsqueda, aplicar filtros locales
  useEffect(() => {
    if (products.length > 0) {
      applyLocalFilters(products)
    } else {
      onFiltered([])
    }
  }, [products, sortBy, selectedCategory, showSaleOnly])

  const applyLocalFilters = useCallback((productsToFilter: any[]) => {
    let filtered = [...productsToFilter]

    if (selectedCategory !== "todos") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (showSaleOnly) {
      filtered = filtered.filter((p) => p.onSale || (p.discount && p.discount > 0))
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "relevance":
      default:
        // Mantener el orden de la API (relevancia)
        break
    }

    onFiltered(filtered)
  }, [selectedCategory, showSaleOnly, sortBy, onFiltered])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleSort = (value: string) => {
    setSortBy(value)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSaleFilter = (checked: boolean) => {
    setShowSaleOnly(checked)
  }

  // Extraer categorías únicas de los productos obtenidos
  const categories = ["todos", ...new Set(products.map(p => p.category).filter(Boolean))]

  const handleClearFilters = () => {
    setSearchTerm("")
    setSortBy("relevance")
    setSelectedCategory("todos")
    setShowSaleOnly(false)
    onFiltered([])
  }

  return (
    <section className="mb-12">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar productos (ej: iPhone, laptop, tablet...)"
            className="pl-12 py-3 rounded-lg transition-all duration-300 ease-out focus:shadow-lg"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        <div className="mt-2 min-h-6">
          {loading && (
            <p className="text-sm text-muted-foreground">Buscando productos...</p>
          )}
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          {!loading && !error && searchTerm && products.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Encontrados {products.length} productos para "{searchTerm}"
            </p>
          )}
          
          {!loading && !error && searchTerm && products.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No se encontraron productos para "{searchTerm}"
            </p>
          )}
        </div>
      </div>

      {/* Filters Row - Solo mostrar si hay productos */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out hover:shadow-md"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out hover:shadow-md"
            >
              <option value="relevance">Relevancia</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
              <option value="rating">Mejor calificados</option>
            </select>
          </div>

          {/* Sale Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Filtros</label>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted cursor-pointer transition-all duration-300 ease-out hover:shadow-md">
              <input
                type="checkbox"
                checked={showSaleOnly}
                onChange={(e) => handleSaleFilter(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-foreground">Solo en oferta</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground invisible">.</label>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="w-full transition-all duration-300 ease-out hover:shadow-md hover:scale-105 bg-transparent"
            >
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}