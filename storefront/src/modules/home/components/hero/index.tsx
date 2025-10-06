import { getHeroSlides } from "@lib/data/hero-slide"
import HeroClient from "./hero-client"

const Hero = async () => {
  try {
    const { data: slides } = await getHeroSlides()
    return <HeroClient slides={slides} />
  } catch (error) {
    console.error("Failed to fetch hero slides:", error)
    // Return nothing if fetch fails
    return null
  }
}

export default Hero
