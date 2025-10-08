import { Metadata } from "next"

import { getRegion } from "@lib/data/regions"
import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import StoreClient from "./store-client"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: {
    sortBy?: string
    categoryIds?: string
    collectionIds?: string
    page?: string
  }
  params: {
    countryCode: string
  }
}

export default async function StorePage({ searchParams, params }: Params) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    return (
      <div className="content-container py-6">
        <p className="text-gray-600">Không thể tải thông tin khu vực.</p>
      </div>
    )
  }

  // Fetch categories and collections for filters
  const [categoriesData, collectionsData] = await Promise.all([
    getCategoriesList(0, 100),
    getCollectionsList(0, 100),
  ])

  return (
    <div className="content-container py-6">
      <StoreClient
        region={region}
        categories={categoriesData.product_categories || []}
        collections={collectionsData.collections || []}
        initialSearchParams={searchParams}
      />
    </div>
  )
}
