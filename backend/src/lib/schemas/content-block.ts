import { z } from "zod"

// Base content block schema
export const ContentBlockSchema = z.object({
  id: z.string().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  block_type: z.string().min(1, "block_type is required"),
  block_data: z.record(z.string(), z.any()).refine(
    (data) => data !== null && typeof data === "object" && !Array.isArray(data),
    {
      message: "block_data must be an object"
    }
  ),
  rank: z.number().int().min(0).nullable().optional(),
  product_id: z.string().min(1).nullable().optional(),
})

// Query parameters schema
export const ContentBlockQuerySchema = z.object({
  product_id: z.string().optional(),
})

// Single content block creation schema
export const CreateContentBlockSchema = ContentBlockSchema.omit({ id: true })

// Bulk content blocks creation schema
export const CreateContentBlocksSchema = z.object({
  blocks: z.array(CreateContentBlockSchema).min(1, "blocks must be a non-empty array"),
})

// Request body union type
export const ContentBlockRequestBodySchema = z.union([
  CreateContentBlockSchema,
  CreateContentBlocksSchema,
])

// Type exports
export type ContentBlockType = z.infer<typeof ContentBlockSchema>
export type CreateContentBlockType = z.infer<typeof CreateContentBlockSchema>
export type CreateContentBlocksType = z.infer<typeof CreateContentBlocksSchema>
export type ContentBlockQueryType = z.infer<typeof ContentBlockQuerySchema>
export type ContentBlockRequestBodyType = z.infer<typeof ContentBlockRequestBodySchema>
