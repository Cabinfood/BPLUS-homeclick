"use client"

import { useState, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ClientStore from "@modules/store/components/client-store"
import FilterSidebar from "@modules/store/components/filter-sidebar"
import SortDropdown, { SortOptions } from "@modules/store/components/sort-dropdown"
import Breadcrumb from "@modules/store/components/breadcrumb"

interface StoreClientProps {
  region: HttpTypes.StoreRegion
  categories: HttpTypes.StoreProductCategory[]
  collections: HttpTypes.StoreCollection[]
  initialSearchParams: {
    sortBy?: string
    categoryIds?: string
    collectionIds?: string
  }
}

export default function StoreClient({
  region,
  categories,
  collections,
  initialSearchParams,
}: StoreClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse initial filters from URL
  const parseCategoryIds = () => {
    const ids = initialSearchParams.categoryIds
    return ids ? ids.split(",") : []
  }

  const parseCollectionIds = () => {
    const ids = initialSearchParams.collectionIds
    return ids ? ids.split(",") : []
  }

  const [filters, setFilters] = useState({
    categoryIds: parseCategoryIds(),
    collectionIds: parseCollectionIds(),
    types: [] as string[],
    tags: [] as string[],
  })

  const [sortBy, setSortBy] = useState<SortOptions>(
    (initialSearchParams.sortBy as SortOptions) || "best_selling"
  )

  // Update URL when filters or sort change
  const updateURL = useCallback(
    (newFilters: typeof filters, newSortBy: SortOptions) => {
      const params = new URLSearchParams()

      if (newSortBy && newSortBy !== "best_selling") {
        params.set("sortBy", newSortBy)
      }

      if (newFilters.categoryIds.length > 0) {
        params.set("categoryIds", newFilters.categoryIds.join(","))
      }

      if (newFilters.collectionIds.length > 0) {
        params.set("collectionIds", newFilters.collectionIds.join(","))
      }

      const queryString = params.toString()
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    },
    [pathname, router]
  )

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    updateURL(newFilters, sortBy)
  }

  const handleSortChange = (name: string, value: SortOptions) => {
    setSortBy(value)
    updateURL(filters, value)
  }

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Cửa hàng" }]} />

      {/* Main Content */}
      <div className="flex flex-col small:flex-row gap-6">
        {/* Filter Sidebar - Left */}
        <aside className="w-full small:w-[280px] flex-shrink-0">
          <FilterSidebar
            categories={categories}
            collections={collections}
            selectedFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Products Section - Right */}
        <div className="flex-1">
          {/* Header with Sort */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Tất cả sản phẩm
            </h1>
            <SortDropdown
              sortBy={sortBy}
              setQueryParams={handleSortChange}
              data-testid="sort-dropdown"
            />
          </div>

          {/* Product Grid */}
          <ClientStore region={region} filters={filters} sortBy={sortBy} />
        </div>
      </div>
    </>
  )
}
