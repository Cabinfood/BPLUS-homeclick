import { clx } from "@medusajs/ui"

interface ServiceFeature {
  icon: React.ReactNode
  title: string
  description: string
}

interface ServiceFeaturesProps {
  className?: string
}

export default function ServiceFeatures({ className }: ServiceFeaturesProps) {
  const features: ServiceFeature[] = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: "Free ship cho đơn từ 200K",
      description: ""
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "60 ngày đổi trả vì bất kỳ lý do gì",
      description: ""
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Hotline 1900.27.27.37",
      description: "hỗ trợ từ 8h30 - 22h"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Đến tận nơi nhận hàng trả,",
      description: "hoàn tiền trong 24h"
    }
  ]

  return (
    <div className={clx("grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg", className)}>
      {features.map((feature, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex-shrink-0 text-ui-fg-base">
            {feature.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ui-fg-base leading-tight">
              {feature.title}
            </p>
            {feature.description && (
              <p className="text-xs text-ui-fg-subtle mt-0.5">
                {feature.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
