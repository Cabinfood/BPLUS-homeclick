"use client"

import { useState, useCallback, useEffect } from "react"
import { getProductsListWithSortByCategoryId } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import LoadMoreButton from "@modules/store/components/loadmore-button"

interface LoadMoreProductsProps {
  sortBy?: SortOptions
  categoryId: string
  countryCode: string
  initialProducts: HttpTypes.StoreProduct[]
  initialCount: number
  region: HttpTypes.StoreRegion
}

export default function LoadMoreProducts({
  sortBy = "created_at",
  categoryId,
  countryCode,
  initialProducts,
  initialCount,
  region,
}: LoadMoreProductsProps) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(initialCount)

  const hasMore = products.length < totalCount

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    
    try {
      const nextPage = currentPage + 1
      
      const result = await getProductsListWithSortByCategoryId({
        categoryId,
        page: nextPage,
        sortBy,
        countryCode,
        queryParams: { limit: 12 }
      })

      const newProducts = result.response.products
      
      if (newProducts.length > 0) {
        setProducts(prev => {
          // Filter out duplicate products by ID
          const existingIds = new Set(prev.map(p => p.id))
          const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id))
          
          return [...prev, ...uniqueNewProducts]
        })
        setCurrentPage(nextPage)
        setTotalCount(result.response.count)
      }
    } catch (error) {
      console.error("Error loading more products:", error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, currentPage, sortBy, categoryId, countryCode, products.length, totalCount])

  // Reset products when initial data changes (e.g., sorting)
  useEffect(() => {
    setProducts(initialProducts)
    setCurrentPage(1)
    setTotalCount(initialCount)
  }, [initialProducts, initialCount, sortBy]) // Reset when sortBy changes

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
        
        {/* Show loading skeletons for new products being loaded */}
        {loading && Array.from({ length: 6 }).map((_, index) => (
          <li key={`skeleton-${index}`} className="animate-pulse">
            <div className="aspect-square bg-ui-bg-subtle rounded-lg mb-4"></div>
            <div className="h-4 bg-ui-bg-subtle rounded mb-2"></div>
            <div className="h-4 bg-ui-bg-subtle rounded w-3/4"></div>
          </li>
        ))}
      </ul>
      
      <LoadMoreButton
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMoreProducts}
        productsCount={products.length}
      />
    </>
  )
}
