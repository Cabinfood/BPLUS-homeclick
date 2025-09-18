import { notFound } from "next/navigation"

import InteractiveLink from "@modules/common/components/interactive-link"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import LoadMoreProducts from "@modules/store/components/loadmore-products"
import { getProductsListWithSortByCategoryId } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  // Get region and initial products data
  const [region, initialProductsData] = await Promise.all([
    getRegion(countryCode),
    getProductsListWithSortByCategoryId({
      categoryId: category.id,
      page: 1,
      sortBy: sort,
      countryCode,
      queryParams: { limit: 12 }
    })
  ])

  if (!region) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} data-testid="sort-by-container" />
      <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
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
        <LoadMoreProducts
          sortBy={sort}
          categoryId={category.id}
          countryCode={countryCode}
          initialProducts={initialProductsData.response.products}
          initialCount={initialProductsData.response.count}
          region={region}
        />
      </div>
    </div>
  )
}