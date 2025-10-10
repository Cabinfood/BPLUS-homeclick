"use client"

import { clx } from "@medusajs/ui"
import { useState } from "react"

interface CoolCashInfoProps {
  cashbackAmount?: number
  minPurchase?: number
  className?: string
}

export default function CoolCashInfo({ 
  cashbackAmount = 14000,
  minPurchase = 200000,
  className 
}: CoolCashInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={clx("border border-blue-200 rounded-lg bg-blue-50/50", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-medium text-ui-fg-base">
            Được hoàn lên đến {cashbackAmount.toLocaleString('vi-VN')} CoolCash.
          </span>
        </div>
        <svg 
          className={clx(
            "w-5 h-5 text-ui-fg-subtle transition-transform",
            isExpanded && "rotate-180"
          )}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-3 pt-1 border-t border-blue-200">
          <p className="text-sm text-ui-fg-subtle mb-2">
            Đây là số CoolCash ước tính bạn sẽ được hoàn lại khi mua sản phẩm hôm nay, tương ứng với quyền lợi hạng{" "}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800 text-white text-xs rounded">
              BẠCH KIM
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          </p>
          <p className="text-sm text-ui-fg-subtle">
            CoolCash có giá trị như tiền mặt dùng để mua hàng tại website Coolmate.me
          </p>
          <div className="mt-2 flex gap-2">
            <a 
              href="#" 
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Đăng nhập
            </a>
            <span className="text-sm text-ui-fg-subtle">hoặc</span>
            <a 
              href="#" 
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Đăng ký
            </a>
            <span className="text-sm text-ui-fg-subtle">
              ngay để kiếm trước CoolCash chính xác nhất dành cho bạn.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
