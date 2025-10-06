import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { HERO_SLIDE_MODULE } from "../../../modules/hero-slide"
import HeroSlideModuleService from "../../../modules/hero-slide/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const heroSlideModuleService: HeroSlideModuleService = req.scope.resolve(HERO_SLIDE_MODULE)

    // Fetch only active slides for storefront
    const slides = await (heroSlideModuleService as any).listHeroSlides(
      { is_active: true },
      {
        order: {
          rank: "asc",
        },
      }
    )

    const data = Array.isArray(slides) ? slides : (slides ? [slides] : [])

    res.json({
      data: data,
      count: data.length
    })

  } catch (error) {
    console.error("Error fetching hero slides for storefront:", error)
    // Return empty array instead of throwing error
    res.json({
      data: [],
      count: 0
    })
  }
}
