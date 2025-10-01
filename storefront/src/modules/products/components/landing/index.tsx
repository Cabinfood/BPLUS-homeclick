// Landing components entry point
// Following product-actions pattern for clean organization

export { default as LandingHero } from "./landing-hero"
export { default as LandingBentoGrid } from "./landing-bento-grid"

// Re-export types for external use
export type {
  LandingHeroProps,
  LandingBentoGridProps,
  BentoItem,
  CTAButton,
  GridSize
} from "./types"

// Re-export utilities for external use
export {
  processCTAs,
  handleCTAClick,
  getDefaultGridSize
} from "./utils"

// Re-export constants
export { GRID_SIZES } from "./types"
