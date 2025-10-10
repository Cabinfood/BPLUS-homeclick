"use client"

import { Star } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

interface ProductRatingProps {
  rating?: number
  reviewCount?: number
  className?: string
}

export default function ProductRating({ 
  rating = 5, 
  reviewCount = 0,
  className 
}: ProductRatingProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(() => {
        // Fallback to copy link
        navigator.clipboard.writeText(window.location.href)
      })
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href)
      setShowShareMenu(true)
      setTimeout(() => setShowShareMenu(false), 2000)
    }
  }

  return (
    <div className={clx("flex items-center gap-3", className)}>
      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={clx(
              "w-5 h-5",
              star <= rating 
                ? "fill-yellow-500 text-yellow-500" 
                : "fill-gray-200 text-gray-200"
            )}
          />
        ))}
      </div>

      {/* Review Count */}
      {reviewCount > 0 && (
        <span className="text-sm text-ui-fg-subtle">
          ({reviewCount})
        </span>
      )}

      {/* Share Button */}
      <div className="relative">
        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
            />
          </svg>
          Chia sẻ
        </button>
        
        {showShareMenu && (
          <div className="absolute top-full mt-1 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            Đã sao chép liên kết!
          </div>
        )}
      </div>
    </div>
  )
}
