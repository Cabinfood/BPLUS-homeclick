import { clx } from "@medusajs/ui"

interface DiscountBadge {
  label: string
  amount: string
}

interface DiscountBadgesProps {
  badges?: DiscountBadge[]
  className?: string
}

export default function DiscountBadges({ badges, className }: DiscountBadgesProps) {
  if (!badges || badges.length === 0) {
    return null
  }

  return (
    <div className={clx("flex items-center gap-2 flex-wrap", className)}>
      <span className="text-sm text-ui-fg-subtle">Mã giảm giá</span>
      {badges.map((badge, index) => (
        <span
          key={index}
          className="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded border border-orange-200"
        >
          {badge.label}
        </span>
      ))}
    </div>
  )
}
