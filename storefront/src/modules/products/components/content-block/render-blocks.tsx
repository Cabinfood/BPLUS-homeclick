"use client"
import React from "react"
import { RenderBlocksProps } from "./types"
import BlockItem from "./block-item"
import { isBackgroundBlock } from "./utils"

const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  // First block is always full width, then group remaining blocks into rows of 2
  const firstBlock = blocks[0]
  const remainingBlocks = blocks.slice(1)
  const rows: Array<typeof blocks> = []
  
  for (let i = 0; i < remainingBlocks.length; i += 2) {
    rows.push(remainingBlocks.slice(i, i + 2))
  }

  return (
    <div className="space-y-6 w-full">
      {/* Mobile: Single column layout */}
      <div className="block space-y-4 md:hidden">
        {blocks.map((block, index) => {
          const isBackground = isBackgroundBlock(block, index)
          return (
            <div key={block.id} className="w-full">
              <BlockItem
                block={block}
                isBackground={isBackground}
                className="w-full h-[60vh] max-h-[500px] rounded-2xl overflow-hidden"
              />
            </div>
          )
        })}
      </div>

      {/* Desktop/Tablet: Bento grid - First full, then alternating */}
      <div className="hidden space-y-6 md:block">
        {/* First block - Always full width */}
        <div className="w-full">
          <BlockItem
            block={firstBlock}
            isBackground={isBackgroundBlock(firstBlock, 0)}
            className="w-full h-[80vh] max-h-[800px] rounded-2xl overflow-hidden"
          />
        </div>

        {/* Remaining blocks - Alternating bento grid */}
        {rows.map((row, rowIndex) => {
          const isOddRow = rowIndex % 2 === 0
          
          return (
            <div 
              key={`row-${rowIndex}`}
              className="grid gap-6 grid-cols-1 lg:grid-cols-12"
            >
              {row.map((block, blockIndex) => {
                const globalIndex = blockIndex + rowIndex * 2 + 1
                const isBackground = isBackgroundBlock(block, globalIndex)
                const isFirstInRow = blockIndex === 0
                
                // Row lẻ: Item đầu lớn (8 cols), item thứ 2 nhỏ (4 cols)
                // Row chẵn: Item đầu nhỏ (4 cols), item thứ 2 lớn (8 cols)
                let colSpan = "lg:col-span-6" // Default 50/50 nếu chỉ có 1 item
                
                if (row.length === 2) {
                  if (isOddRow) {
                    colSpan = isFirstInRow ? "lg:col-span-8" : "lg:col-span-4"
                  } else {
                    colSpan = isFirstInRow ? "lg:col-span-4" : "lg:col-span-8"
                  }
                } else {
                  // Nếu row chỉ có 1 item (item cuối lẻ)
                  colSpan = "lg:col-span-12"
                }

                return (
                  <div 
                    key={block.id} 
                    className={`w-full ${colSpan}`}
                  >
                    <BlockItem
                      block={block}
                      isBackground={isBackground}
                      className="w-full h-[70vh] max-h-[800px] rounded-2xl overflow-hidden"
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RenderBlocks
