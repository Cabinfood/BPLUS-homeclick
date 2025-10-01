// framework
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

// module key
import { CONTENT_BLOCK_MODULE } from "modules/content-block"

// services/models (local)
import ContentBlockModuleService from "../../../modules/content-block/service"

// shared utils/constants
import { ContentBlockQuerySchema } from "lib/schemas/content-block"
import { ORDER_BY } from "lib/constants"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Resolve service via DI token
    const contentBlockModuleService: ContentBlockModuleService = req.scope.resolve(CONTENT_BLOCK_MODULE)

    // Validate query parameters
    const { product_id, block_type } = ContentBlockQuerySchema.parse(req.query)

    // Build filters
    const filters: any = {}
    if (product_id) {
      filters.product_id = product_id
    }
    if (block_type) {
      if (typeof block_type === "string" && block_type.includes(",")) {
        const parts = block_type
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        if (parts.length > 0) {
          filters.block_type = { $in: parts }
        }
      } else {
        filters.block_type = block_type
      }
    }

    // Query content blocks
    const blocks = await contentBlockModuleService.listContentBlocks(filters, {
      order: {
        rank: ORDER_BY.ASC,
      },
    })

    // Return standardized response shape
    res.json({ 
      data: blocks,
      count: Array.isArray(blocks) ? blocks.length : 0
    })

  } catch (error) {
    // Handle different error types
    if (error instanceof MedusaError) {
      throw error
    }

    // Handle unexpected errors
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      'An unexpected error occurred while fetching content blocks'
    )
  }
}