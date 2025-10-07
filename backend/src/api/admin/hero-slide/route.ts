import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { HERO_SLIDE_MODULE } from "../../../modules/hero-slide"
import HeroSlideModuleService from "../../../modules/hero-slide/service"
import { CreateHeroSlideSchema } from "./validators"

type CreateHeroSlideBody = z.infer<typeof CreateHeroSlideSchema>

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const svc: HeroSlideModuleService = req.scope.resolve(HERO_SLIDE_MODULE)

  try {
    const slides = await (svc as any).listHeroSlides({}, {
      order: {
        rank: "asc",
      },
    })
    
    const data = Array.isArray(slides) ? slides : (slides ? [slides] : [])
    
    res.json({
      data: data,
      count: data.length
    })
  } catch (e) {
    console.error("Error fetching hero slides:", e)
    // Return empty array instead of throwing error when no data
    res.json({
      data: [],
      count: 0
    })
  }
}

export async function POST(req: MedusaRequest<CreateHeroSlideBody>, res: MedusaResponse): Promise<void> {
  const svc: HeroSlideModuleService = req.scope.resolve(HERO_SLIDE_MODULE)

  // Validate using Zod schema
  const validationResult = CreateHeroSlideSchema.safeParse(req.body)
  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map(issue => issue.message).join(", ")
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid request: ${errorMessages}`
    )
  }

  const { title, description, image, link, cta_text, rank, is_active } = validationResult.data

  try {
    // Get current max rank to auto-increment
    const existingSlides = await (svc as any).listHeroSlides({}, {
      order: { rank: "desc" },
      take: 1,
    })
    const maxRank = existingSlides?.[0]?.rank ?? -1
    
    const created = await (svc as any).createHeroSlides({
      title,
      description: description || null,
      image,
      link: link || null,
      cta_text: cta_text || null,
      rank: rank ?? (maxRank + 1),
      is_active: is_active ?? true,
    })
    const slide = Array.isArray(created) ? created[0] : created
    res.json({ data: slide })
  } catch (e) {
    console.error("Error creating hero slide:", e)
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to create hero slide: ${e.message || e}`
    )
  }
}
