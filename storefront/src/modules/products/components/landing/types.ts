// Landing component types and interfaces

export interface CTAButton {
  text: string
  href: string
  variant?: "primary" | "secondary" | "transparent" | "danger"
  icon?: React.ReactNode
}

export interface LandingHeroProps {
  title?: string
  description?: string
  videoUrl?: string
  imageUrl?: string
  ctaButtons?: CTAButton[]
  ctaText?: string // Deprecated: use ctaButtons instead
  ctaHref?: string // Deprecated: use ctaButtons instead
  isLoading?: boolean
}

export interface BentoItem {
  id: string
  title: string
  description?: string
  imageUrl?: string
  href?: string
  size?: "small" | "medium" | "large"
}

export interface LandingBentoGridProps {
  title?: string
  description?: string
  items?: BentoItem[]
  moreText?: string
  moreHref?: string
  isLoading?: boolean
}

export const GRID_SIZES = {
  small: "col-span-1 row-span-1",
  medium: "col-span-1 md:col-span-2 row-span-1",
  large: "col-span-1 md:col-span-2 row-span-1 md:row-span-2"
} as const

export type GridSize = keyof typeof GRID_SIZES
