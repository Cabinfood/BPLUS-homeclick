// framework
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

// module key
import { CONTENT_BLOCK_MODULE } from "modules/content-block"

// services/models (local)
import ContentBlockModuleService from "../../../modules/content-block/service"

// Constants
const ORDER_BY = {
  ASC: 'asc',
  DESC: 'desc'
} as const

const ERROR_MESSAGES = {
  INVALID_QUERY: 'product_id is required',
  INVALID_DATA: 'Invalid query parameters provided'
} as const

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Resolve service via DI token
    const contentBlockModuleService: ContentBlockModuleService = req.scope.resolve(CONTENT_BLOCK_MODULE)

    // Extract and validate query parameters
    const { product_id } = req.query

    // Validate input parameters
    if (!product_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        ERROR_MESSAGES.INVALID_QUERY
      )
    }

    // Query content blocks by product_id
    const blocks = await contentBlockModuleService.listContentBlocks({
      product_id: product_id as string,
    }, {
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