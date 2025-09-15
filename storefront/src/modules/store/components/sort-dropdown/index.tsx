"use client"

import { ChevronDownMini } from "@medusajs/icons"
import { Select } from "@medusajs/ui"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type SortDropdownProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low → High",
  },
  {
    value: "price_desc",
    label: "Price: High → Low",
  },
]

const SortDropdown = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortDropdownProps) => {
  const handleChange = (value: string) => {
    setQueryParams("sortBy", value as SortOptions)
  }

  const currentOption = sortOptions.find(option => option.value === sortBy)

  return (
    <div className="flex items-center gap-2" data-testid={dataTestId}>
      <span className="text-sm text-ui-fg-subtle whitespace-nowrap">Sort by:</span>
      <Select value={sortBy} onValueChange={handleChange}>
        <Select.Trigger className="w-[180px]">
          <Select.Value>
            {currentOption?.label || "Latest Arrivals"}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          {sortOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

export default SortDropdown
