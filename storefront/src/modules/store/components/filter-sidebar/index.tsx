"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FilterSidebarProps {
  categories: HttpTypes.StoreProductCategory[]
  collections: HttpTypes.StoreCollection[]
  selectedFilters: {
    categoryIds: string[]
    collectionIds: string[]
    types: string[]
    tags: string[]
  }
  onFilterChange: (filters: {
    categoryIds: string[]
    collectionIds: string[]
    types: string[]
    tags: string[]
  }) => void
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  )
}

export default function FilterSidebar({
  categories,
  collections,
  selectedFilters,
  onFilterChange,
}: FilterSidebarProps) {
  const handleCategoryChange = (categoryId: string) => {
    const newCategoryIds = selectedFilters.categoryIds.includes(categoryId)
      ? selectedFilters.categoryIds.filter((id) => id !== categoryId)
      : [...selectedFilters.categoryIds, categoryId]

    onFilterChange({
      ...selectedFilters,
      categoryIds: newCategoryIds,
    })
  }

  const handleCollectionChange = (collectionId: string) => {
    const newCollectionIds = selectedFilters.collectionIds.includes(collectionId)
      ? selectedFilters.collectionIds.filter((id) => id !== collectionId)
      : [...selectedFilters.collectionIds, collectionId]

    onFilterChange({
      ...selectedFilters,
      collectionIds: newCollectionIds,
    })
  }

  const handleClearAll = () => {
    onFilterChange({
      categoryIds: [],
      collectionIds: [],
      types: [],
      tags: [],
    })
  }

  const hasActiveFilters =
    selectedFilters.categoryIds.length > 0 ||
    selectedFilters.collectionIds.length > 0 ||
    selectedFilters.types.length > 0 ||
    selectedFilters.tags.length > 0

  return (
    <div className="w-full small:w-[280px] bg-white rounded-2xl border border-gray-200 p-6 sticky top-4 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Categories Filter */}
      {categories && categories.length > 0 && (
        <FilterSection title="Danh mục">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedFilters.categoryIds.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {category.name}
              </span>
            </label>
          ))}
        </FilterSection>
      )}

      {/* Collections Filter */}
      {collections && collections.length > 0 && (
        <FilterSection title="Bộ sưu tập">
          {collections.map((collection) => (
            <label
              key={collection.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedFilters.collectionIds.includes(collection.id)}
                onChange={() => handleCollectionChange(collection.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {collection.title}
              </span>
            </label>
          ))}
        </FilterSection>
      )}
    </div>
  )
}
