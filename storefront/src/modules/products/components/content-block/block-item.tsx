import React from "react"
import { ContentBlock, TextBlockData, MediaBlockData, BlockItemProps } from "./types"
import TextBlock from "./text-block"
import MediaBlock from "./media-block"

const BlockItem: React.FC<BlockItemProps> = ({ 
  block, 
  className = "text-ui-text-primary", 
  isBackground = false,
  showHeader = false
}) => {
  if (block.block_type === 'text') {
    return (
      <TextBlock 
        data={block.block_data as TextBlockData} 
        className={className}
        blockTitle={block.title}
        blockDescription={block.description}
      />
    )
  }

  if (block.block_type === 'media') {
    return (
      <MediaBlock 
        data={block.block_data as MediaBlockData} 
        className={className}
        isBackground={isBackground}
        blockTitle={block.title}
        blockDescription={block.description}
      />
    )
  }

  return null
}

export default BlockItem
