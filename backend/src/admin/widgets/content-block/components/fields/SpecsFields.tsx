// ui
import { Button, Input, Text } from "@medusajs/ui"

export type SpecItem = { key: string; value: string }
export type SpecsBlockData = { items: SpecItem[] }

type Props = {
  value: SpecsBlockData
  onChange: (next: SpecsBlockData) => void
}

export default function SpecsFields({ value, onChange }: Props) {
  const addItem = () => {
    onChange({ items: [...(value.items || []), { key: "", value: "" }] })
  }
  const removeItem = (idx: number) => {
    const next = [...(value.items || [])]
    next.splice(idx, 1)
    onChange({ items: next })
  }
  const updateItem = (idx: number, patch: Partial<SpecItem>) => {
    const next = [...(value.items || [])]
    next[idx] = { ...next[idx], ...patch }
    onChange({ items: next })
  }
  return (
    <div className="grid gap-3">
      <div className="flex justify-between items-center">
        <Text size="small">Items</Text>
        <Button size="small" variant="secondary" onClick={addItem}>Thêm</Button>
      </div>
      <div className="grid gap-2">
        {(value.items || []).map((it, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <Input
              value={it.key}
              onChange={(e) => updateItem(idx, { key: e.target.value })}
              placeholder="Key (bắt buộc)"
            />
            <Input
              value={it.value}
              onChange={(e) => updateItem(idx, { value: e.target.value })}
              placeholder="Value (bắt buộc)"
            />
            <Button size="small" variant="secondary" onClick={() => removeItem(idx)}>Xóa</Button>
          </div>
        ))}
      </div>
    </div>
  )
}


