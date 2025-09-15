import { getProductsList, getProductsListWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LoadMoreProducts from "@modules/store/components/loadmore-products"

const PRODUCT_LIMIT = 12

type LoadMoreProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function LoadMoreProductsTemplate({
  sortBy,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: LoadMoreProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }
  
  // Note: MedusaJS doesn't support price sorting via order parameter
  // We'll handle price sorting client-side for now
  if (sortBy === "price_asc" || sortBy === "price_desc") {
    // Don't set order parameter for price sorting
    delete queryParams["order"]
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Fetch initial products (first page)
  const {
    response: { products, count },
  } = sortBy === "price_asc" || sortBy === "price_desc" 
    ? await getProductsListWithSort({
        page: 1,
        queryParams,
        sortBy,
        countryCode,
      })
    : await getProductsList({
        pageParam: 1,
        queryParams,
        countryCode,
      })

  return (
    <LoadMoreProducts
      sortBy={sortBy}
      collectionId={collectionId}
      categoryId={categoryId}
      productsIds={productsIds}
      countryCode={countryCode}
      initialProducts={products}
      initialCount={count}
      region={region}
    />
  )
}
