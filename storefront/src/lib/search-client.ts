import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"

const endpoint =
  process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://127.0.0.1:7700"

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

// OPTIMIZED: Configure search client with memory-efficient settings
export const searchClient = instantMeiliSearch(endpoint, apiKey, {
  // Enable caching but with limits
  keepZeroFacets: false, // Don't keep facets with 0 results
  // Optimize query parameters
  primaryKey: 'id',
  // Reduce the number of placeholders
  placeholderSearch: false, // Don't search on empty query
  // Limit results
  finitePagination: true, // Enable finite pagination
  paginationTotalHits: 1000, // Match backend limit
})

export const SEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_INDEX_NAME || "products"

// If you want to use Algolia instead then uncomment the following lines, and delete the above lines
// you should also install algoliasearch - yarn add algoliasearch

// import algoliasearch from "algoliasearch/lite"

// const appId = process.env.NEXT_PUBLIC_SEARCH_APP_ID || "test_app_id"

// const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

// export const searchClient = algoliasearch(appId, apiKey)

// export const SEARCH_INDEX_NAME =
//   process.env.NEXT_PUBLIC_INDEX_NAME || "products"
