"use client"

import { Button } from "@medusajs/ui"
import { memo } from "react"

interface LoadMoreButtonProps {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
  productsCount: number
}

const LoadMoreButton = memo(function LoadMoreButton({
  hasMore,
  loading,
  onLoadMore,
  productsCount,
}: LoadMoreButtonProps) {
  if (!hasMore && productsCount > 0 && !loading) {
    return (
      <div className="flex justify-center mt-8">
        <p className="text-ui-fg-muted text-small-regular">
          You've reached the end of the products list
        </p>
      </div>
    )
  }

  if (!hasMore) {
    return null
  }

  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={onLoadMore}
        variant="secondary"
        size="large"
        className="min-w-[200px]"
        disabled={loading}
      >
        {loading ? "Loading..." : "Load More Products"}
      </Button>
    </div>
  )
})

export default LoadMoreButton
