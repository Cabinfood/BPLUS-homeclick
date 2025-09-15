"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { getProductsList, getProductsListWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import LoadMoreButton from "@modules/store/components/loadmore-button"

const PRODUCT_LIMIT = 12

type LoadMoreProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

interface LoadMoreProductsProps {
  sortBy?: SortOptions
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  initialProducts: HttpTypes.StoreProduct[]
  initialCount: number
  region: HttpTypes.StoreRegion
}

export default function LoadMoreProducts({
  sortBy,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  initialProducts,
  initialCount,
  region,
}: LoadMoreProductsProps) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(initialCount)

  // Memoize query params to prevent unnecessary re-renders
  const queryParams: LoadMoreProductsParams = useMemo(() => {
    const params: LoadMoreProductsParams = {
      limit: PRODUCT_LIMIT,
    }

    if (collectionId) {
      params["collection_id"] = [collectionId]
    }

    if (categoryId) {
      params["category_id"] = [categoryId]
    }

    if (productsIds) {
      params["id"] = productsIds
    }

    if (sortBy === "created_at") {
      params["order"] = "created_at"
    }
    
    // Note: MedusaJS doesn't support price sorting via order parameter
    // We'll handle price sorting client-side for now
    if (sortBy === "price_asc" || sortBy === "price_desc") {
      // Don't set order parameter for price sorting
      delete params["order"]
    }

    return params
  }, [collectionId, categoryId, productsIds, sortBy])

  // Calculate hasMore based on current products length
  const hasMore = useMemo(() => {
    return products.length < totalCount
  }, [products.length, totalCount])

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    
    try {
      const nextPage = currentPage + 1
      
      const result = sortBy === "price_asc" || sortBy === "price_desc" 
        ? await getProductsListWithSort({
            page: nextPage,
            queryParams,
            sortBy,
            countryCode,
          })
        : await getProductsList({
            pageParam: nextPage,
            queryParams,
            countryCode,
          })

      const newProducts = result.response.products
      
      if (newProducts.length > 0) {
        setProducts(prev => [...prev, ...newProducts])
        setCurrentPage(nextPage)
        setTotalCount(result.response.count)
      }
    } catch (error) {
      console.error("Error loading more products:", error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, currentPage, sortBy, queryParams, countryCode])

  // Update products when initial data changes (only when sorting changes)
  useEffect(() => {
    if (JSON.stringify(products) !== JSON.stringify(initialProducts)) {
      setProducts(initialProducts)
      setCurrentPage(1)
      setTotalCount(initialCount)
    }
  }, [initialProducts, initialCount])

  // Separate effect for sortBy changes to prevent unnecessary resets
  useEffect(() => {
    if (products.length > initialProducts.length) {
      // If we have loaded more products, reset to initial state when sort changes
      setProducts(initialProducts)
      setCurrentPage(1)
      setTotalCount(initialCount)
    }
  }, [sortBy, initialProducts, initialCount])

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
