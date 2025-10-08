"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"
import { getProductsWithPagination } from "@lib/data/products"

interface UseProductsParams {
  regionId: string
  limit?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  categoryIds?: string[]
  collectionIds?: string[]
  tags?: string[]
  types?: string[]
}

export function useProducts({
  regionId,
  limit = 12,
  queryParams,
  categoryIds,
  collectionIds,
  tags,
  types,
}: UseProductsParams) {
  // Build query params with filters
  const buildQueryParams = (): HttpTypes.FindParams & HttpTypes.StoreProductParams => {
    const params: any = { ...queryParams }

    if (categoryIds && categoryIds.length > 0) {
      params.category_id = categoryIds
    }

    if (collectionIds && collectionIds.length > 0) {
      params.collection_id = collectionIds
    }

    if (tags && tags.length > 0) {
      params.tags = tags
    }

    if (types && types.length > 0) {
      params.type_id = types
    }

    return params
  }

  const finalQueryParams = buildQueryParams()

  return useInfiniteQuery({
    queryKey: ["products", regionId, limit, finalQueryParams, categoryIds, collectionIds, tags, types],
    queryFn: async ({ pageParam = 0 }) => {
      return getProductsWithPagination({
        limit,
        offset: pageParam,
        regionId,
        queryParams: finalQueryParams,
      })
    },
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit
      return nextOffset < lastPage.count ? nextOffset : undefined
    },
    initialPageParam: 0,
    enabled: !!regionId,
  })
}
