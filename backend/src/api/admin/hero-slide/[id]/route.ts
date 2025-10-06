import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { HERO_SLIDE_MODULE } from "../../../../modules/hero-slide"
import HeroSlideModuleService from "../../../../modules/hero-slide/service"

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

export async function PUT(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const svc: HeroSlideModuleService = req.scope.resolve(HERO_SLIDE_MODULE)
  const { id } = req.params
  const updates = req.body

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
