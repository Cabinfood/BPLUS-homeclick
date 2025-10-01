import { z } from "zod";

// Base validation schemas for each block type
export const textBlockSchema = z.object({
  content: z.string().min(1, "Content là bắt buộc cho block Text"),
});

export const mediaBlockSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url("URL hợp lệ (http/https) là bắt buộc cho block Media"),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const specsBlockSchema = z.object({
  items: z.array(
    z.object({
      key: z.string().min(1, "Key là bắt buộc"),
      value: z.string().min(1, "Value là bắt buộc"),
    })
  ).min(1, "Ít nhất một item là bắt buộc cho block Specs"),
});

// Landing: hero
export const heroBlockSchema = z.object({
  videoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  ctaButtons: z.array(
    z.object({
      text: z.string().min(1, "CTA text is required"),
      href: z.string().min(1, "CTA href is required"),
      variant: z.enum(["primary", "secondary", "transparent", "danger"]).optional(),
      icon: z.string().optional(),
    })
  ).optional(),
}).refine((data) => !!data.videoUrl || !!data.imageUrl, {
  message: "At least one of Video URL or Image URL is required",
})

// Landing: bento grid
export const bentoGridBlockSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, "Item id là bắt buộc"),
      title: z.string().min(1, "Item title là bắt buộc"),
      description: z.string().optional(),
      imageUrl: z.string().url().optional(),
      href: z.string().optional(),
      size: z.enum(["small", "medium", "large"]).optional(),
    })
  ).min(1, "Cần ít nhất 1 item"),
  moreText: z.string().optional(),
  moreHref: z.string().optional(),
});

// Landing: features
export const featuresBlockSchema = z.object({
  title: z.string().min(1, "Title là bắt buộc"),
  features: z.array(
    z.object({
      icon: z.string().optional(),
      title: z.string().min(1, "Feature title là bắt buộc"),
      description: z.string().min(1, "Feature description là bắt buộc"),
    })
  ).min(1, "Cần ít nhất 1 feature"),
});

// Landing: testimonials
export const testimonialsBlockSchema = z.object({
  title: z.string().min(1, "Title là bắt buộc"),
  testimonials: z.array(
    z.object({
      name: z.string().min(1, "Name là bắt buộc"),
      role: z.string().min(1, "Role là bắt buộc"),
      content: z.string().min(1, "Content là bắt buộc"),
      avatar: z.string().url().optional(),
      rating: z.number().int().min(1).max(5),
    })
  ).min(1, "Cần ít nhất 1 testimonial"),
});

export const draftBlockSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "media", "specs", "hero", "bento_grid", "features", "testimonials"]),
  title: z.string().optional(),
  description: z.string().optional(),
  textForm: textBlockSchema.optional(),
  mediaForm: mediaBlockSchema.optional(),
  specsForm: specsBlockSchema.optional(),
  heroForm: heroBlockSchema.optional(),
  bentoGridForm: bentoGridBlockSchema.optional(),
  // Optional forms for landing types (currently JSON-first in UI)
  featuresForm: featuresBlockSchema.optional(),
  testimonialsForm: testimonialsBlockSchema.optional(),
  showAdvanced: z.boolean(),
  jsonText: z.string(),
});

// Validation functions
export const validateTextBlock = (data: any) => {
  try {
    textBlockSchema.parse(data);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" };
    }
    return { success: false, error: "Unknown validation error" };
  }
};

export const validateMediaBlock = (data: any) => {
  try {
    mediaBlockSchema.parse(data);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" };
    }
    return { success: false, error: "Unknown validation error" };
  }
};

export const validateSpecsBlock = (data: any) => {
  try {
    specsBlockSchema.parse(data);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" };
    }
    return { success: false, error: "Unknown validation error" };
  }
};

export const validateDraftBlock = (draft: any) => {
  // If advanced mode, validate JSON only
  if (draft?.showAdvanced) {
    const jr = validateJson(draft?.jsonText || "{}");
    return jr;
  }
  // Validate based on block type
  switch (draft.type) {
    case "text":
      return validateTextBlock(draft.textForm);
    case "media":
      return validateMediaBlock(draft.mediaForm);
    case "specs":
      return validateSpecsBlock(draft.specsForm);
    case "hero":
      try {
        heroBlockSchema.parse(draft.heroForm);
        return { success: true, error: null };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { success: false, error: error.issues[0]?.message || "Validation error" };
        }
        return { success: false, error: "Unknown validation error" };
      }
    case "bento_grid":
      try {
        bentoGridBlockSchema.parse(draft.bentoGridForm);
        return { success: true, error: null };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { success: false, error: error.issues[0]?.message || "Validation error" };
        }
        return { success: false, error: "Unknown validation error" };
      }
    case "features":
      try {
        featuresBlockSchema.parse(draft.featuresForm);
        return { success: true, error: null };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { success: false, error: error.issues[0]?.message || "Validation error" };
        }
        return { success: false, error: "Unknown validation error" };
      }
    case "testimonials":
      try {
        testimonialsBlockSchema.parse(draft.testimonialsForm);
        return { success: true, error: null };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { success: false, error: error.issues[0]?.message || "Validation error" };
        }
        return { success: false, error: "Unknown validation error" };
      }
    default:
      return { success: false, error: "Unknown block type" };
  }
};

// JSON validation
export const validateJson = (jsonText: string) => {
  try {
    const parsed = JSON.parse(jsonText);
    if (typeof parsed !== "object" || parsed === null) {
      return { success: false, error: "JSON phải là object" };
    }
    return { success: true, error: null };
  } catch {
    return { success: false, error: "JSON không hợp lệ" };
  }
};
