// framework
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

// module key
import { CONTENT_BLOCK_MODULE } from "modules/content-block"
// services/models (local)
import ContentBlockModuleService from "../../../modules/content-block/service"
// shared schemas
import {
  ContentBlockQuerySchema,
  ContentBlockRequestBodySchema,
  type ContentBlockQueryType,
  type ContentBlockRequestBodyType,
} from "../../../lib/schemas/content-block";

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const svc: ContentBlockModuleService = req.scope.resolve(CONTENT_BLOCK_MODULE)

  // Validate query parameters
  const queryResult = ContentBlockQuerySchema.safeParse(req.query)
  if (!queryResult.success) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid query parameters: ${queryResult.error.issues.map(i => i.message).join(", ")}`
    )
  }

  const { product_id, block_type }: ContentBlockQueryType = queryResult.data
  const selector: any = {}
  if (product_id) selector.product_id = product_id
  if (block_type) {
    if (typeof block_type === "string" && block_type.includes(",")) {
      const parts = block_type
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      if (parts.length > 0) {
        selector.block_type = { $in: parts }
      }
    } else {
      selector.block_type = block_type
    }
  }

  try {
    const anySvc = svc as any
    const blocks = await anySvc.listContentBlocks(selector, {
      order: {
        rank: "asc",
      },
    })
    res.json({ 
      data: blocks ?? [], 
      count: blocks?.length ?? 0 
    })
  } catch (e) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Failed to retrieve content blocks"
    )
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const svc: ContentBlockModuleService = req.scope.resolve(CONTENT_BLOCK_MODULE)

  // Validate request body
  const bodyResult = ContentBlockRequestBodySchema.safeParse(req.body)
  if (!bodyResult.success) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid request body: ${bodyResult.error.issues.map(i => i.message).join(", ")}`
    )
  }

  const body: ContentBlockRequestBodyType = bodyResult.data

  try {
    // Check if it's bulk mode (has blocks array)
    if ("blocks" in body) {
      // Bulk creation
      const { blocks } = body
      const created = await (svc as any).createContentBlocks(blocks)
      const list = Array.isArray(created) ? created : [created]
      res.json({ 
        data: list, 
        count: list.length 
      })
    } else {
      // Single creation
      const created = await (svc as any).createContentBlocks([body])
      const block = Array.isArray(created) ? created[0] : created
      res.json({ 
        data: block 
      })
    }
  } catch (e) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Failed to create content block(s)"
    )
  }
}