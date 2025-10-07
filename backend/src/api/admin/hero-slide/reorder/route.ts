import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { HERO_SLIDE_MODULE } from "../../../../modules/hero-slide"
import HeroSlideModuleService from "../../../../modules/hero-slide/service"
import { ReorderSlidesSchema } from "../validators"

type ReorderSlidesBody = z.infer<typeof ReorderSlidesSchema>

export async function POST(req: MedusaRequest<ReorderSlidesBody>, res: MedusaResponse): Promise<void> {
  const svc: HeroSlideModuleService = req.scope.resolve(HERO_SLIDE_MODULE)

  // Validate using Zod schema
  const validationResult = ReorderSlidesSchema.safeParse(req.body)
  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map(issue => issue.message).join(", ")
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid request: ${errorMessages}`
    )
  }

  const { slides } = validationResult.data

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
