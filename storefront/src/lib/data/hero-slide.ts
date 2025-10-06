import { cache } from "react"
import { sdk } from "@lib/config"

export type HeroSlide = {
  id: string
  title: string
  description: string | null
  image: string
  link: string | null
  cta_text: string | null
  rank: number
  is_active: boolean
}

export type HeroSlidesResponse = {
  data: HeroSlide[]
  count: number
}

export const getHeroSlides = cache(async function (): Promise<HeroSlidesResponse> {
  const response = await sdk.client.fetch(`/store/hero-slide`)
  return response as HeroSlidesResponse
})
