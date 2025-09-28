import { revalidateTag } from 'next/cache';
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { cache } from "react"
import { getRegion } from "./regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sortProducts } from "@lib/util/sort-products"

export const getProductsById = cache(async function ({
  ids,
  regionId,
}: {
  ids: string[]
  regionId: string
}) {
  return sdk.store.product
    .list(
      {
        id: ids,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity,+variants.metadata",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products)
})

export const getProductByHandle = cache(async function (
  handle: string,
  regionId: string
) {
  revalidateTag("products")
  return sdk.store.product
    .list(
      {
        handle,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity,+variants.metadata,+metadata",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products[0])
})

// Create a more specific cache key based on query parameters
const createCacheKey = (params: any) => {
  return JSON.stringify({
    ...params,
    // Sort keys for consistent cache keys
    ...(params.category_id && { 
      category_id: Array.isArray(params.category_id) 
        ? params.category_id.sort() 
        : [params.category_id].sort() 
    }),
    ...(params.collection_id && { 
      collection_id: Array.isArray(params.collection_id) 
        ? params.collection_id.sort() 
        : [params.collection_id].sort() 
    }),
  })
}

export const getProductsList = cache(async function ({
  pageParam = 1,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 12
  const validPageParam = Math.max(pageParam, 1);
  const offset = (validPageParam - 1) * limit
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const cacheKey = createCacheKey({ 
    limit, 
    offset, 
    region_id: region.id, 
    ...queryParams 
  })

  return sdk.store.product
    .list(
      {
        limit,
        offset,
        region_id: region.id,
        fields: "*variants.calculated_price,+variants.inventory_quantity,+variants.metadata",
        ...queryParams,
      },
      { 
        next: { 
          tags: ["products", `products-${cacheKey}`]
        } 
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
})

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const getProductsListWithSort = cache(async function ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 12
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  // Fetch products with full pricing data to avoid N+1 queries
  const { products, count } = await sdk.store.product
    .list(
      {
        limit: 100,
        offset: 0,
        region_id: region.id,
        fields: "*variants.calculated_price,+variants.inventory_quantity,+variants.metadata",
        ...queryParams,
      },
      { next: { tags: ["products"] } }
    )

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit
  const nextPage = count > pageParam + limit ? page + 1 : null
  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
})

/**
 * Fetch products by category ID with sorting and pagination support using MedusaJS v2 SDK
 * This function filters products by category_id and applies client-side sorting
 */
export const getProductsListWithSortByCategoryId = cache(async function ({
  categoryId,
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  categoryId: string
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 12
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  // Create cache key for category-specific caching
  const cacheKey = createCacheKey({ 
    category_id: categoryId,
    region_id: region.id,
    sortBy,
    ...queryParams 
  })

  try {
    // Calculate offset for server-side pagination
    const offset = (page - 1) * limit

    // For sorting that MedusaJS supports natively, use server-side sorting
    let orderParam: string | undefined
    if (sortBy === "created_at") {
      orderParam = "created_at"
    }
    // For price sorting, we'll need client-side sorting since MedusaJS doesn't support it

    if (sortBy === "price_asc" || sortBy === "price_desc") {
      // For price sorting, fetch more products and sort client-side
      const { products, count } = await sdk.store.product
        .list(
          {
            category_id: [categoryId],
            offset: 0,
            region_id: region.id,
            fields: "*variants.calculated_price,+variants.inventory_quantity,+variants.metadata",
            ...queryParams,
          },
          { 
            next: { 
              tags: ["products", `products-category-${categoryId}`, `products-${cacheKey}`]
            } 
          }
        )

      // Apply client-side sorting for price
      const sortedProducts = sortProducts(products, sortBy)
      const paginatedProducts = sortedProducts.slice(offset, offset + limit)

      return {
        response: {
          products: paginatedProducts,
          count,
        },
        nextPage: count > offset + limit ? page + 1 : null,
        queryParams,
      }
    } else {
      // For other sorting, use server-side pagination
      const { products, count } = await sdk.store.product
        .list(
          {
            category_id: [categoryId],
            limit,
            offset,
            region_id: region.id,
            fields: "*variants.calculated_price,+variants.inventory_quantity,+variants.metadata",
            ...(orderParam && { order: orderParam }),
            ...queryParams,
          },
          { 
            next: { 
              tags: ["products", `products-category-${categoryId}`, `products-${cacheKey}`]
            } 
          }
        )

      return {
        response: {
          products,
          count,
        },
        nextPage: count > offset + limit ? page + 1 : null,
        queryParams,
      }
    }
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error)
    return {
      response: { products: [], count: 0 },
      nextPage: null,
      queryParams,
    }
  }
})


