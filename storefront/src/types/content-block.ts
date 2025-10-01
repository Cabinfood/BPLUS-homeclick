// Content Block Types
export interface ContentBlock {
  id: string
  title: string | null
  description: string | null
  block_type: 'text' | 'media' | 'hero' | 'bento_grid' | 'features' | 'testimonials' | 'cta'
  block_data: TextBlockData | MediaBlockData | HeroBlockData | BentoGridBlockData | FeaturesBlockData | TestimonialsBlockData | CTABlockData
  rank: number | null
  product_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface TextBlockData {
  title: string
  content: string
}

export interface MediaBlockData {
  alt: string
  url: string
  type: 'image' | 'video'
  caption: string
}

// Landing block data types - bám sát UI components
export interface HeroBlockData {
  title: string
  description?: string
  videoUrl?: string
  imageUrl?: string
  ctaButtons?: CTAButton[]
}

export interface BentoGridBlockData {
  title: string
  items: BentoItem[]
  moreText?: string
  moreHref?: string
}

export interface FeaturesBlockData {
  title: string
  features: Array<{
    icon?: string
    title: string
    description: string
  }>
}

export interface TestimonialsBlockData {
  title: string
  testimonials: Array<{
    name: string
    role: string
    content: string
    avatar?: string
    rating: number
  }>
}

export interface CTABlockData {
  title: string
  description?: string
  buttons: CTAButton[]
  backgroundImage?: string
}

export interface CTAButton {
  text: string
  href: string
  variant?: "primary" | "secondary" | "transparent" | "danger"
  icon?: string
}

export interface BentoItem {
  id: string
  title: string
  description?: string
  imageUrl?: string
  href?: string
  size?: "small" | "medium" | "large"
}

export interface ContentBlocksResponse {
  data: ContentBlock[],
  count: number
}

// Layout configuration
export interface BlockLayout {
  gridPosition: {
    colStart: number
    colSpan: number
    rowStart: number
    rowSpan: number
  }
  className: string
}
