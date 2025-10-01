// framework
import { revalidateTag } from 'next/cache';
import { cache } from "react"

// shared
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getRegion } from "./regions"
import { ContentBlocksResponse } from "../../types/content-block"

export const getContentBlock = cache(async function (id: string) {
  return sdk.client.fetch(`/api/store/content-block/${id}`)
})

export const getContentBlocks = cache(async function (productId: string) {
  return sdk.client.fetch(`/store/content-block?product_id=${productId}`)
})


export const getContentBlocksByProductId = cache(async function (productId: string): Promise<ContentBlocksResponse> {
  const response = await sdk.client.fetch(`/store/content-block?product_id=${productId}`)
  return response as ContentBlocksResponse
})

// Landing blocks functions
export const getLandingBlocks = cache(async function (): Promise<ContentBlocksResponse> {
  const response = await sdk.client.fetch(`/store/content-block?block_type=hero,bento_grid,features,testimonials,cta`)
  return response as ContentBlocksResponse
})

export const getGlobalBlocks = cache(async function (): Promise<ContentBlocksResponse> {
  const response = await sdk.client.fetch(`/store/content-block?block_type=hero,bento_grid,features,testimonials,cta`)
  return response as ContentBlocksResponse
})