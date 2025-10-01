import { Button, Input, Label, Textarea, Select, Text } from "@medusajs/ui"
import { useCallback } from "react"

type BentoItem = {
  id: string
  title: string
  description?: string
  imageUrl?: string
  href?: string
  size?: 'small' | 'medium' | 'large'
}

type BentoGridForm = {
  items: BentoItem[]
  moreText?: string
  moreHref?: string
}

type Props = {
  value: BentoGridForm
  onChange: (val: BentoGridForm) => void
}

export default function BentoGridFields({ value, onChange }: Props) {
  const update = useCallback((patch: Partial<BentoGridForm>) => {
    onChange({ ...value, ...patch })
  }, [value, onChange])

  const addItem = useCallback(() => {
    const next: BentoItem = { id: crypto.randomUUID(), title: '' }
    update({ items: [...(value.items || []), next] })
  }, [value, update])

  const updateItem = useCallback((idx: number, patch: Partial<BentoItem>) => {
    const next = [...(value.items || [])]
    next[idx] = { ...next[idx], ...patch }
    update({ items: next })
  }, [value, update])

  const removeItem = useCallback((idx: number) => {
    const next = [...(value.items || [])]
    next.splice(idx, 1)
    update({ items: next })
  }, [value, update])

  return (
    <div className="space-y-4">


      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Items</Label>
          <Button size="small" variant="secondary" onClick={addItem}>Add Item</Button>
        </div>
        <div className="space-y-4">
          {(value.items || []).map((item, idx) => (
            <div key={item.id || idx} className="grid grid-cols-1 gap-2 md:grid-cols-6 border rounded-md p-3">
              <Input value={item.title} onChange={(e) => updateItem(idx, { title: e.target.value })} placeholder="Item Title" />
              <Input value={item.description || ''} onChange={(e) => updateItem(idx, { description: e.target.value })} placeholder="Description" />
              <Input value={item.imageUrl || ''} onChange={(e) => updateItem(idx, { imageUrl: e.target.value })} placeholder="Image URL" />
              <Input value={item.href || ''} onChange={(e) => updateItem(idx, { href: e.target.value })} placeholder="/path or #id" />
              <Select value={item.size || 'small'} onValueChange={(val) => updateItem(idx, { size: val as BentoItem['size'] })}>
                <Select.Trigger>
                  <Select.Value placeholder="Size" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="small">small</Select.Item>
                  <Select.Item value="medium">medium</Select.Item>
                  <Select.Item value="large">large</Select.Item>
                </Select.Content>
              </Select>
              <div className="flex items-center">
                <Button size="small" variant="danger" onClick={() => removeItem(idx)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>More Text</Label>
          <Input value={value.moreText || ''} onChange={(e) => update({ moreText: e.target.value })} placeholder="View More" />
        </div>
        <div className="space-y-2">
          <Label>More Href</Label>
          <Input value={value.moreHref || ''} onChange={(e) => update({ moreHref: e.target.value })} placeholder="/products" />
        </div>
      </div>
    </div>
  )
}
