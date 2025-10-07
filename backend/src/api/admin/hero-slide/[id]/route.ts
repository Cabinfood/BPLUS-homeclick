import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { HERO_SLIDE_MODULE } from "../../../../modules/hero-slide"
import HeroSlideModuleService from "../../../../modules/hero-slide/service"
import { UpdateHeroSlideSchema } from "../validators"

type UpdateHeroSlideBody = z.infer<typeof UpdateHeroSlideSchema>

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const svc: HeroSlideModuleService = req.scope.resolve(HERO_SLIDE_MODULE)
  const { id } = req.params

  try {
    const slide = await (svc as any).retrieveHeroSlide(id)
    if (!slide) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Hero slide not found")
    }
    res.json({ data: slide })
  } catch (e: any) {
    if (e instanceof MedusaError) throw e
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Failed to retrieve hero slide"
    )
  }
}

export async function PUT(req: MedusaRequest<UpdateHeroSlideBody>, res: MedusaResponse): Promise<void> {
  const svc: HeroSlideModuleService = req.scope.resolve(HERO_SLIDE_MODULE)
  const { id } = req.params

  // Validate using Zod schema
  const validationResult = UpdateHeroSlideSchema.safeParse(req.body)
  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map(issue => issue.message).join(", ")
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid request: ${errorMessages}`
    )
  }

  const updates = validationResult.data

  try {
    const updated = await (svc as any).updateHeroSlides([{
      id,
      ...updates,
    }])
    const slide = Array.isArray(updated) ? updated[0] : updated
    res.json({ data: slide })
  } catch (e) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Failed to update hero slide"
    )
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const svc: HeroSlideModuleService = req.scope.resolve(HERO_SLIDE_MODULE)
  const { id } = req.params

  try {
    await (svc as any).softDeleteHeroSlides([id])
    res.json({ success: true })
  } catch (e) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Failed to delete hero slide"
    )
  }
}
