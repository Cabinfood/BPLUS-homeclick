import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { HERO_SLIDE_MODULE } from "../../../../modules/hero-slide"
import HeroSlideModuleService from "../../../../modules/hero-slide/service"

type ReorderSlidesBody = {
  slides: Array<{ id: string; rank: number }>
}

export async function POST(req: MedusaRequest<ReorderSlidesBody>, res: MedusaResponse): Promise<void> {
  const svc: HeroSlideModuleService = req.scope.resolve(HERO_SLIDE_MODULE)
  const { slides } = req.body

  if (!Array.isArray(slides)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "slides must be an array of { id, rank }"
    )
  }

  try {
    const updates = slides.map((s: any) => ({
      id: s.id,
      rank: s.rank,
    }))
    await (svc as any).updateHeroSlides(updates)
    res.json({ success: true })
  } catch (e) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Failed to reorder hero slides"
    )
  }
}
