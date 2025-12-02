'use client'

import { useState, useCallback } from 'react';
import { ProductsApi, Product } from '@/lib/products-api';
import { useToast } from './use-toast';

export const useProductSearch = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const { toast } = useToast();

  const search = useCallback(async (query: string) => {
    console.log('🔍 Hook: Iniciando búsqueda con query:', query);
    
    if (!query.trim()) {
      console.log('⚠️ Hook: Query vacío, limpiando productos');
      setProducts([]);
      setLastQuery('');
      return;
    }

    setLoading(true);
    setError(null);
    setLastQuery(query);
    
    console.log('🔄 Hook: Estado loading = true');

    try {
      console.log('🌐 Hook: Llamando a ProductsApi.search...');
      const results = await ProductsApi.search(query);
      
      console.log('✅ Hook: Resultados recibidos:', results);
      console.log('📊 Hook: Cantidad de productos:', results.length);
      
      setProducts(results);
      
      if (results.length === 0) {
        toast({
          title: "No se encontraron productos",
          description: `No hay resultados para "${query}"`,
          variant: "default",
        });
      } else {
        toast({
          title: "Búsqueda exitosa",
          description: `Se encontraron ${results.length} productos`,
          variant: "default",
        });
      }
      
    } catch (err: any) {
      console.error('❌ Hook: Error en la búsqueda:', err);
      
      const errorMessage = err?.body || err?.message || 'Error desconocido al buscar productos';
      console.error('❌ Hook: Mensaje de error:', errorMessage);
      
      setError(errorMessage);
      setProducts([]);
      
      toast({
        title: "Error en la búsqueda",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.log('🔄 Hook: Estado loading = false');
      setLoading(false);
    }
  }, [toast]);

  const clearSearch = useCallback(() => {
    console.log('🧹 Hook: Limpiando búsqueda');
    setProducts([]);
    setError(null);
    setLastQuery('');
  }, []);

  return {
    products,
    loading,
    error,
    lastQuery,
    search,
    clearSearch,
  };
};