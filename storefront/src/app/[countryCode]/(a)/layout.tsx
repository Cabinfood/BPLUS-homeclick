import { Metadata } from "next"

// modules
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

// shared
import { getBaseURL } from "@lib/util/env"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RouteGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}
