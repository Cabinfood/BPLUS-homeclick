import { HttpTypes } from "@medusajs/types"

// components
import { LandingBlockRenderer } from "../components/content-block"
import { LandingPageSkeleton } from "@modules/skeletons/components/landing-skeleton"

// data
import { getLandingBlocks } from "@lib/data/content-block"

// types
import type { ContentBlock } from "../../../types/content-block"

// types
interface LandingTemplateProps {
  product?: HttpTypes.StoreProduct
  region?: HttpTypes.StoreRegion
  countryCode: string
}

// Helper function: create bento items from product data
function createBentoItems(product: HttpTypes.StoreProduct): Array<{
  id: string
  title: string
  description?: string
  imageUrl?: string
  href?: string
  size?: "small" | "medium" | "large"
}> {
  const items = []

  // Main product item (large)
  if (product) {
    items.push({
      id: product.id,
      title: product.title,
      description: product.description || "Premium quality product",
      imageUrl: product.images?.[0]?.url || undefined,
      href: `#product-${product.id}`,
      size: "large" as const
    })
  }

  // Related products hoặc variants
  if (product?.variants && product.variants.length > 0) {
    product.variants.slice(0, 5).forEach((variant, index) => {
      items.push({
        id: variant.id,
        title: variant.title || `${product.title} - ${variant.title}`,
        description: variant.metadata?.description as string || "Variant option",
        imageUrl: variant.metadata?.image as string || product.images?.[0]?.url || undefined,
        href: `#variant-${variant.id}`,
        size: index === 0 ? "medium" as const : "small" as const
      })
    })
  }

  // Fallback items nếu không có đủ data
  const fallbackItems = [
    {
      id: "featured-1",
      title: "Featured Collection",
      description: "Discover our curated selection",
      href: "#collections",
      size: "medium" as const
    },
    {
      id: "featured-2", 
      title: "New Arrivals",
      description: "Latest additions to our store",
      href: "#new-arrivals",
      size: "small" as const
    },
    {
      id: "featured-3",
      title: "Best Sellers",
      description: "Customer favorites",
      href: "#best-sellers", 
      size: "small" as const
    }
  ]

  // If not enough items, add fallback items
  while (items.length < 6) {
    const fallbackItem = fallbackItems[items.length - 1] as {
      id: string
      title: string
      description?: string
      href?: string
      size?: "small" | "medium" | "large"
    } | undefined
    if (fallbackItem) {
      items.push(fallbackItem)
    } else {
      break
    }
  }

  return items.slice(0, 6)
}

export default async function LandingTemplate({
  product,
  region,
  countryCode
}: LandingTemplateProps) {
  // Fetch landing blocks
  let landingBlocks: ContentBlock[] = []
  try {
    const { data } = await getLandingBlocks()
    landingBlocks = data || []
  } catch (error) {
    console.error('Failed to fetch landing blocks:', error)
  }

  // Nếu không có product data, hiển thị fallback
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Product Not Found
          </h1>
          <p className="mb-8 text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <a
            href={`/${countryCode}`}
            className="inline-block px-8 py-4 font-semibold text-white bg-black rounded-full transition-colors hover:bg-gray-800"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    )
  }

  // Nếu không có landing blocks, hiển thị skeleton
  if (landingBlocks.length === 0) {
    return <LandingPageSkeleton />
  }

  return (
    <div className="min-h-screen">
      {/* Render landing blocks */}
      {landingBlocks.map((block) => (
        <LandingBlockRenderer 
          key={block.id} 
          block={block} 
        />
      ))}
    </div>
  )
}
