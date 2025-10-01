import { Metadata } from "next"
import { notFound } from "next/navigation"

// framework
import { getRegion } from "@lib/data/regions"
import { getProductByHandle } from "@lib/data/products"

// modules
import LandingTemplate from "@modules/products/templates/landing-template"

type Props = {
  params: { countryCode: string; slug: string }
}

// Helper function: determine content type
async function getContentType(slug: string, countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    return { type: "not_found" as const, data: null }
  }

  try {
    // Check if it's a product
    const product = await getProductByHandle(slug, region.id)
    if (product) {
      return { type: "product" as const, data: product }
    }

    return { type: "not_found" as const, data: null }
  } catch (error) {
    console.error("Error determining content type:", error)
    return { type: "not_found" as const, data: null }
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, countryCode } = params
  const { type, data } = await getContentType(slug, countryCode)

  if (type === "not_found") {
    return {
      title: "Page not found | HomeClick Store",
      description: "The page you are looking for does not exist.",
    }
  }

  if (type === "product" && data) {
    return {
      title: `${data.title} | HomeClick Store`,
      description: data.description || data.title,
      openGraph: {
        title: `${data.title} | HomeClick Store`,
        description: data.description || data.title,
        images: data.thumbnail ? [data.thumbnail] : [],
      },
    }
  }

  return {
    title: "HomeClick Store",
    description: "HomeClick Store",
  }
}

export default async function SlugPage({ params }: Props) {
  const { slug, countryCode } = params
  const { type, data } = await getContentType(slug, countryCode)

  if (type === "not_found") {
    notFound()
  }

  const region = await getRegion(countryCode)
  if (!region) {
    notFound()
  }

  // Render template corresponding to content type
  if (type === "product" && data) {
    return (
      <LandingTemplate
        product={data}
        region={region}
        countryCode={countryCode}
      />
    )
  }

  notFound()
}
