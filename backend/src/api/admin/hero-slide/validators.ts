import { z } from "zod"

export const CreateHeroSlideSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().nullable().optional(),
    image: z.string().url("Image must be a valid URL"),
    link: z.string().nullable().optional(),
    cta_text: z.string().nullable().optional(),
    rank: z.number().int().optional(),
    is_active: z.boolean().optional().default(true),
  })
  .strict()

export const UpdateHeroSlideSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    image: z.string().url().optional(),
    link: z.string().nullable().optional(),
    cta_text: z.string().nullable().optional(),
    rank: z.number().int().optional(),
    is_active: z.boolean().optional(),
  })
  .strict()

export const ReorderSlidesSchema = z
  .object({
    slides: z.array(
      z.object({
        id: z.string(),
        rank: z.number().int(),
      })
    ),
  })
  .strict()
