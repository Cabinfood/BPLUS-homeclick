"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export type SortOptions = "best_selling" | "created_at" | "price_asc" | "price_desc" | "discount"

type SortDropdownProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "best_selling" as SortOptions,
    label: "Bán chạy",
  },
  {
    value: "created_at" as SortOptions,
    label: "Mới nhất",
  },
  {
    value: "price_asc" as SortOptions,
    label: "Giá thấp đến cao",
  },
  {
    value: "price_desc" as SortOptions,
    label: "Giá cao đến thấp",
  },
  {
    value: "discount" as SortOptions,
    label: "%Giảm giá nhiều",
  },
]

const SortDropdown = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentOption = sortOptions.find((option) => option.value === sortBy)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-3" data-testid={dataTestId}>
      <span className="text-sm text-gray-500 uppercase tracking-wide whitespace-nowrap">
        Sắp xếp theo
      </span>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-full text-gray-700 font-medium transition-colors"
        >
          {currentOption?.label || "Bán chạy"}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleChange(option.value)}
                className={`w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors ${
                  option.value === sortBy ? "text-blue-600 font-medium" : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SortDropdown
