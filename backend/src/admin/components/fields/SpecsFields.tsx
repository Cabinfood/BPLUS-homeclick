// ui
import { Button, Input, Text } from "@medusajs/ui"
import { memo, useCallback, useState, useEffect } from "react"

export type SpecItem = { key: string; value: string }
export type SpecsBlockData = { items: SpecItem[] }

type Props = {
  value: SpecsBlockData
  onChange: (next: SpecsBlockData) => void
  validationError?: string | null
}

const SpecsFields = memo(function SpecsFields({ value, onChange, validationError }: Props) {
  // Local state to prevent focus loss
  const [localItems, setLocalItems] = useState<SpecItem[]>(value.items || [])

  // Sync local state when value changes
  useEffect(() => {
    setLocalItems(value.items || [])
  }, [value.items])

  const addItem = useCallback(() => {
    const newItems = [...localItems, { key: "", value: "" }]
    setLocalItems(newItems)
    onChange({ items: newItems })
  }, [localItems, onChange])

  const removeItem = useCallback((idx: number) => {
    const newItems = [...localItems]
    newItems.splice(idx, 1)
    setLocalItems(newItems)
    onChange({ items: newItems })
  }, [localItems, onChange])

  const updateItem = useCallback((idx: number, patch: Partial<SpecItem>) => {
    const newItems = [...localItems]
    newItems[idx] = { ...newItems[idx], ...patch }
    setLocalItems(newItems)
  }, [localItems])

  const handleItemBlur = useCallback(() => {
    onChange({ items: localItems })
  }, [localItems, onChange])
  return (
    <div className="grid gap-3">
      <div className="flex justify-between items-center">
        <Text size="small" className={validationError ? "text-red-600" : ""}>
          Items <span className="text-red-500">*</span>
        </Text>
        <Button size="small" variant="secondary" onClick={addItem}>Thêm</Button>
      </div>
      <div className="grid gap-2">
        {localItems.map((it, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <Input
              value={it.key}
              onChange={(e) => updateItem(idx, { key: e.target.value })}
              onBlur={handleItemBlur}
              placeholder="Key (bắt buộc)"
            />
            <Input
              value={it.value}
              onChange={(e) => updateItem(idx, { value: e.target.value })}
              onBlur={handleItemBlur}
              placeholder="Value (bắt buộc)"
            />
            <Button size="small" variant="secondary" onClick={() => removeItem(idx)}>Xóa</Button>
          </div>
        ))}
      </div>
      {validationError && (
        <Text size="small" className="text-red-600">
          {validationError}
        </Text>
      )}
    </div>
  )
})

export default SpecsFields


