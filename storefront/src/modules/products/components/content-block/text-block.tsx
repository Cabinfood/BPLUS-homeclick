import React from "react"
import { TextBlockProps } from "./types"

const TextBlock: React.FC<TextBlockProps> = ({ 
  data, 
  className = "", 
  blockTitle, 
  blockDescription 
}) => {
  return (
    <div className={`text-white ${className}`}>
      {/* Block level title and description */}
      {blockTitle && (
        <h2 className="mb-3 text-2xl font-bold">{blockTitle}</h2>
      )}
      {blockDescription && (
        <p className="mb-4 text-base leading-relaxed text-white/90">{blockDescription}</p>
      )}
      
      {/* Block data title and content */}
      <h3 className="mb-2 text-xl font-semibold">{data.title}</h3>
      <p className="text-sm leading-relaxed">{data.content}</p>
    </div>
  )
}

export default TextBlock
