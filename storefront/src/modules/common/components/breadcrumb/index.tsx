import { ChevronRightMini } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav 
      className={clx("flex items-center space-x-2 text-sm", className)}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRightMini className="mx-2 h-4 w-4 text-ui-fg-muted" />
          )}
          {item.href && index < items.length - 1 ? (
            <LocalizedClientLink
              href={item.href}
              className="text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
            >
              {item.label}
            </LocalizedClientLink>
          ) : (
            <span 
              className={clx(
                index === items.length - 1 
                  ? "text-ui-fg-base font-medium" 
                  : "text-ui-fg-subtle"
              )}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
