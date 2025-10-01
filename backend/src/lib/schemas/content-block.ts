import { z } from "zod"

// Landing block data schemas - bám sát UI components
export const HeroBlockDataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  ctaButtons: z.array(z.object({
    text: z.string(),
    href: z.string(),
    variant: z.enum(["primary", "secondary", "transparent", "danger"]).optional(),
    icon: z.string().optional()
  })).optional()
})

export const BentoGridBlockDataSchema = z.object({
  title: z.string(),
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    href: z.string().optional(),
    size: z.enum(["small", "medium", "large"]).optional()
  })),
  moreText: z.string().optional(),
  moreHref: z.string().optional()
})

export const FeaturesBlockDataSchema = z.object({
  title: z.string(),
  features: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    description: z.string()
  }))
})

export const TestimonialsBlockDataSchema = z.object({
  title: z.string(),
  testimonials: z.array(z.object({
    name: z.string(),
    role: z.string(),
    content: z.string(),
    avatar: z.string().url().optional(),
    rating: z.number().min(1).max(5)
  }))
})

export const CTABlockDataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  buttons: z.array(z.object({
    text: z.string(),
    href: z.string(),
    variant: z.enum(["primary", "secondary", "transparent", "danger"]).optional(),
    icon: z.string().optional()
  })),
  backgroundImage: z.string().url().optional()
})

// Union type cho tất cả block data
export const BlockDataSchema = z.union([
  HeroBlockDataSchema,
  BentoGridBlockDataSchema,
  FeaturesBlockDataSchema,
  TestimonialsBlockDataSchema,
  CTABlockDataSchema,
  z.record(z.string(), z.any()) // Fallback cho existing blocks
])

// Base content block schema
export const ContentBlockSchema = z.object({
  id: z.string().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  block_type: z.enum([
    "text", 
    "media", 
    "hero", 
    "bento_grid", 
    "features", 
    "testimonials", 
    "cta"
  ]),
  block_data: BlockDataSchema,
  rank: z.number().int().min(0).nullable().optional(),
  product_id: z.string().min(1).nullable().optional(),
})

// Query parameters schema
export const ContentBlockQuerySchema = z.object({
  product_id: z.string().optional(),
  block_type: z.string().optional(),
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
