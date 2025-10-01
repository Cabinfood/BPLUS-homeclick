"use client"
import React from "react"
import { RenderBlocksProps } from "./types"
import BlockItem from "./block-item"
import { getLayoutSections, isBackgroundBlock, getHeightClass } from "./utils"

const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  // Layout 1-2-1: 1 cột trên, 2 cột giữa, 1 cột dưới
  const { topBlocks, leftBlocks, rightBlocks, bottomBlocks } = getLayoutSections(blocks)

  return (
    <div className="space-y-4 w-full">
      {/* Mobile: Single column layout */}
      <div className="block space-y-4 md:hidden">
        {blocks.map((block, index) => {
          const isBackground = isBackgroundBlock(block, index)
          return (
            <div key={block.id} className="w-full">
              <BlockItem
                block={block}
                isBackground={isBackground}
                className={`w-full ${getHeightClass("mobile")}`}
              />
            </div>
          )
        })}
      </div>

      {/* Desktop/Tablet: 1-2-1 layout */}
      <div className="hidden space-y-4 md:block">
        {/* Top section: 1 cột full width */}
        {topBlocks.length > 0 && (
          <div className="w-full">
            {topBlocks.map((block, index) => {
              const isBackground = isBackgroundBlock(block, index)
              return (
                <div key={block.id} className="w-full">
                  <BlockItem
                    block={block}
                    isBackground={isBackground}
                    className={`w-full ${getHeightClass("top")}`}
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* Middle section: 2 cột */}
        {(leftBlocks.length > 0 || rightBlocks.length > 0) && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left column */}
            <div className="space-y-4">
              {leftBlocks.map((block, index) => {
                const isBackground = isBackgroundBlock(block, index)
                return (
                  <div key={block.id} className="w-full">
                    <BlockItem
                      block={block}
                      isBackground={isBackground}
                      className={`w-full ${getHeightClass("middle")}`}
                    />
                  </div>
                )
              })}
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {rightBlocks.map((block, index) => {
                const isBackground = isBackgroundBlock(block, index)
                return (
                  <div key={block.id} className="w-full">
                    <BlockItem
                      block={block}
                      isBackground={isBackground}
                      className={`w-full ${getHeightClass("middle")}`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom section: 1 cột full width */}
        {bottomBlocks.length > 0 && (
          <div className="w-full">
            {bottomBlocks.map((block, index) => {
              const isBackground = isBackgroundBlock(block, index)
              return (
                <div key={block.id} className="w-full">
                  <BlockItem
                    block={block}
                    isBackground={isBackground}
                    className={`w-full ${getHeightClass("bottom")}`}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default RenderBlocks
