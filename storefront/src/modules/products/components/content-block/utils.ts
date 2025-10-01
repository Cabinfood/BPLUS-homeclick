// Content block utility functions

import { ContentBlock, LAYOUT_SECTIONS } from "./types"

/**
 * Get layout sections for 1-2-1 layout pattern
 * 1 cột trên, 2 cột giữa, 1 cột dưới
 */
export const getLayoutSections = (blocks: ContentBlock[]) => {
  const totalBlocks = blocks.length
  const topBlocks = blocks.slice(0, Math.ceil(totalBlocks / 4))
  const leftBlocks = blocks.slice(
    Math.ceil(totalBlocks / 4),
    Math.ceil((totalBlocks * 2) / 4)
  )
  const rightBlocks = blocks.slice(
    Math.ceil((totalBlocks * 2) / 4),
    Math.ceil((totalBlocks * 3) / 4)
  )
  const bottomBlocks = blocks.slice(Math.ceil((totalBlocks * 3) / 4))

  return { topBlocks, leftBlocks, rightBlocks, bottomBlocks }
}

/**
 * Check if block should be treated as background
 */
export const isBackgroundBlock = (block: ContentBlock, index: number): boolean => {
  return block.block_type === "media" && index === 0
}

/**
 * Get responsive height class based on context
 */
export const getHeightClass = (context: "mobile" | "desktop" | "top" | "middle" | "bottom"): string => {
  switch (context) {
    case "mobile":
      return "h-64"
    case "top":
    case "bottom":
      return "h-48"
    case "middle":
      return "h-48"
    case "desktop":
    default:
      return "h-48"
  }
}

/**
 * Validate content block data
 */
export const validateContentBlock = (block: ContentBlock): boolean => {
  if (!block.id || !block.block_type || !block.block_data) {
    return false
  }

  if (block.block_type === "text") {
    const textData = block.block_data as any
    return !!(textData.title && textData.content)
  }

  if (block.block_type === "media") {
    const mediaData = block.block_data as any
    return !!(mediaData.type && mediaData.url)
  }

  return false
}
