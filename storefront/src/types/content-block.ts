// Content Block Types
export interface ContentBlock {
  id: string
  title: string | null
  description: string | null
  block_type: 'text' | 'media'
  block_data: TextBlockData | MediaBlockData
  rank: number | null
  product_id: string
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
