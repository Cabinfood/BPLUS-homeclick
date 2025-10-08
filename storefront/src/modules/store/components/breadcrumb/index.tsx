"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
      <LocalizedClientLink
        href="/"
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        Trang chủ
      </LocalizedClientLink>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <LocalizedClientLink
              href={item.href}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </LocalizedClientLink>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
