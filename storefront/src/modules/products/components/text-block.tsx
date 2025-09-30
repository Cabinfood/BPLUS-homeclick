import React from "react"
import { TextBlockData } from "../../../types/content-block"

interface TextBlockProps {
  data: TextBlockData
  className?: string
  blockTitle?: string | null
  blockDescription?: string | null
}

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
        <h2 className="text-2xl font-bold mb-3">{blockTitle}</h2>
      )}
      {blockDescription && (
        <p className="text-base text-white/90 mb-4 leading-relaxed">{blockDescription}</p>
      )}
      
      {/* Block data title and content */}
      <h3 className="text-xl font-semibold mb-2">{data.title}</h3>
      <p className="text-sm leading-relaxed">{data.content}</p>
    </div>
  )
}

export default TextBlock
