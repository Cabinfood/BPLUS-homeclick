import HeroSlideModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const HERO_SLIDE_MODULE = "heroSlide"
export default Module(HERO_SLIDE_MODULE, {
  service: HeroSlideModuleService,
})
