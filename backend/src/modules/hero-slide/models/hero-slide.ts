import { model } from "@medusajs/framework/utils"

const HeroSlide = model.define("hero_slide", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text().nullable(),
  image: model.text(), // Image URL
  link: model.text().nullable(), // CTA link
  cta_text: model.text().nullable(), // Call-to-action button text
  rank: model.number().default(0), // Display order
  is_active: model.boolean().default(true), // Active/inactive toggle
})

export default HeroSlide
