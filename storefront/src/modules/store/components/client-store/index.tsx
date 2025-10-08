"use client"

import { HttpTypes } from "@medusajs/types"
import { useProducts } from "@modules/store/hooks/use-products"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { useMemo } from "react"
import { SortOptions } from "@modules/store/components/sort-dropdown"

interface ClientStoreProps {
  region: HttpTypes.StoreRegion
  filters: {
    categoryIds: string[]
    collectionIds: string[]
    types: string[]
    tags: string[]
  }
  sortBy: SortOptions
}

export default function ClientStore({ region, filters, sortBy }: ClientStoreProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useProducts({
    regionId: region.id,
    limit: 12,
    categoryIds: filters.categoryIds,
    collectionIds: filters.collectionIds,
    tags: filters.tags,
    types: filters.types,
  })

  // Client-side sorting for products
  const allProducts = useMemo(() => {
    const products = data?.pages.flatMap((page) => page.products) ?? []

    // Sort products based on sortBy
    const sortedProducts = [...products]
    
    switch (sortBy) {
      case "price_asc":
        sortedProducts.sort((a, b) => {
          const priceA = a.variants?.[0]?.calculated_price?.calculated_amount ?? 0
          const priceB = b.variants?.[0]?.calculated_price?.calculated_amount ?? 0
          return priceA - priceB
        })
        break
      case "price_desc":
        sortedProducts.sort((a, b) => {
          const priceA = a.variants?.[0]?.calculated_price?.calculated_amount ?? 0
          const priceB = b.variants?.[0]?.calculated_price?.calculated_amount ?? 0
          return priceB - priceA
        })
        break
      case "created_at":
        sortedProducts.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateB - dateA
        })
        break
      // Add more sort options as needed (best_selling, discount)
      default:
        break
    }

    return sortedProducts
  }, [data, sortBy])

  if (isLoading) {
    return <SkeletonProductGrid />
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không thể tải sản phẩm. Vui lòng thử lại.</p>
      </div>
    )
  }

  if (allProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy sản phẩm.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Product Grid */}
      <ul
        className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8 flex-1"
        data-testid="products-list"
      >
        {allProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200"
          >
            {isFetchingNextPage ? "Đang tải..." : "Xem thêm sản phẩm"}
          </button>
        </div>
      )}

      {/* Loading indicator when fetching next page */}
      {isFetchingNextPage && (
        <div className="mt-8">
          <SkeletonProductGrid />
        </div>
      )}
    </div>
  )
}
