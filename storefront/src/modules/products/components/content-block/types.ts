// Content block component types and interfaces

export interface TextBlockData {
  title: string
  content: string
}

export interface MediaBlockData {
  type: "image" | "video"
  url: string
  alt?: string
  caption?: string
}

export interface ContentBlock {
  id: string
  block_type: "text" | "media"
  block_data: TextBlockData | MediaBlockData
  title?: string | null
  description?: string | null
}

export interface BlockItemProps {
  block: ContentBlock
  className?: string
  isBackground?: boolean
  showHeader?: boolean
}

export interface TextBlockProps {
  data: TextBlockData
  className?: string
  blockTitle?: string | null
  blockDescription?: string | null
}

export interface MediaBlockProps {
  data: MediaBlockData
  className?: string
  isBackground?: boolean
  blockTitle?: string | null
  blockDescription?: string | null
}

export interface RenderBlocksProps {
  blocks: ContentBlock[]
}

// Layout configuration
export const LAYOUT_SECTIONS = {
  TOP: "top",
  LEFT: "left", 
  RIGHT: "right",
  BOTTOM: "bottom"
} as const

export type LayoutSection = typeof LAYOUT_SECTIONS[keyof typeof LAYOUT_SECTIONS]
