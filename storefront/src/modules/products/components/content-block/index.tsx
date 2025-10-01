// Content block components entry point
// Following product-actions pattern for clean organization

export { default as BlockItem } from "./block-item"
export { default as TextBlock } from "./text-block"
export { default as MediaBlock } from "./media-block"
export { default as RenderBlocks } from "./render-blocks"
export { default as LandingBlockRenderer } from "./landing-block-renderer"

// Re-export types for external use
export type {
  ContentBlock,
  TextBlockData,
  MediaBlockData,
  BlockItemProps,
  TextBlockProps,
  MediaBlockProps,
  RenderBlocksProps,
  LayoutSection
} from "./types"

// Re-export utilities for external use
export {
  getLayoutSections,
  isBackgroundBlock,
  getHeightClass,
  validateContentBlock,
  LAYOUT_SECTIONS
} from "./utils"
