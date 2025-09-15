"use client"

import { notFound } from "next/navigation"
import { Suspense, useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import SortDropdown from "@modules/store/components/sort-dropdown"
import LoadMoreProductsTemplate from "@modules/store/templates/loadmore-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Breadcrumb, { BreadcrumbItem } from "@modules/common/components/breadcrumb"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  categories,
  sortBy,
  countryCode,
}: {
  categories: HttpTypes.StoreProductCategory[]
  sortBy?: SortOptions
  countryCode: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sort = sortBy || "created_at"

  const category = categories[categories.length - 1]
  const parents = categories.slice(0, categories.length - 1)

  if (!category || !countryCode) notFound()

  // Build breadcrumb items - memoized to prevent re-renders
  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => [
    { label: "Trang chủ", href: "/" },
    ...parents.map((parent) => ({
      label: parent.name,
      href: `/categories/${parent.handle}`,
    })),
    { label: category.name }, // Current category (no href)
  ], [parents, category.name])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = useCallback(
    (name: string, value: string) => {
      const query = createQueryString(name, value)
      router.push(`${pathname}?${query}`)
    },
    [createQueryString, router, pathname]
  )

  return (
    <div className="py-6 content-container" data-testid="category-container">
      <div className="w-full">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="flex flex-col small:flex-row small:items-center small:justify-between mb-8 gap-4">
          <h1 className="text-2xl-semi" data-testid="category-page-title">
            {category.name}
          </h1>
          <SortDropdown 
            sortBy={sort as SortOptions} 
            setQueryParams={setQueryParams}
            data-testid="sort-by-container" 
          />
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense fallback={<SkeletonProductGrid />}>
          <LoadMoreProductsTemplate
            sortBy={sort}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
