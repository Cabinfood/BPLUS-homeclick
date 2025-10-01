import { model } from "@medusajs/framework/utils"

const ContentBlock = model.define("content_block", {
  id: model.id().primaryKey(),
  title: model.text().nullable(),
  description: model.text().nullable(),
  block_type: model.text().nullable(), // 'text' | 'media' | 'hero' | 'bento_grid' | 'features' | 'testimonials' | 'cta'
  block_data: model.json().nullable(),
  rank: model.number().nullable(),
  product_id: model.text().nullable(),
})

export default ContentBlock