import { Button, Input, Label, Textarea } from "@medusajs/ui"
import { useCallback } from "react"

type CTA = {
  text: string
  href: string
  variant?: 'primary' | 'secondary' | 'transparent' | 'danger'
  icon?: string
}

type HeroForm = {
  videoUrl?: string
  imageUrl?: string
  ctaButtons: CTA[]
}

type Props = {
  value: HeroForm
  onChange: (val: HeroForm) => void
}

export default function HeroFields({ value, onChange }: Props) {
  const update = useCallback((patch: Partial<HeroForm>) => {
    onChange({ ...value, ...patch })
  }, [value, onChange])

  const addCta = useCallback(() => {
    update({ ctaButtons: [...(value.ctaButtons || []), { text: '', href: '', variant: 'primary' }] })
  }, [value, update])

  const updateCta = useCallback((idx: number, patch: Partial<CTA>) => {
    const next = [...(value.ctaButtons || [])]
    next[idx] = { ...next[idx], ...patch }
    update({ ctaButtons: next })
  }, [value, update])

  const removeCta = useCallback((idx: number) => {
    const next = [...(value.ctaButtons || [])]
    next.splice(idx, 1)
    update({ ctaButtons: next })
  }, [value, update])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Video URL</Label>
          <Input value={value.videoUrl || ''} onChange={(e) => update({ videoUrl: e.target.value })} placeholder="https://...mp4" />
        </div>
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input value={value.imageUrl || ''} onChange={(e) => update({ imageUrl: e.target.value })} placeholder="https://...jpg" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>CTA Buttons</Label>
          <Button size="small" variant="secondary" onClick={addCta}>Add CTA</Button>
        </div>
        <div className="space-y-3">
          {(value.ctaButtons || []).map((cta, idx) => (
            <div key={idx} className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <Input value={cta.text} onChange={(e) => updateCta(idx, { text: e.target.value })} placeholder="Text" />
              <Input value={cta.href} onChange={(e) => updateCta(idx, { href: e.target.value })} placeholder="#products or /path" />
              <Input value={cta.variant || ''} onChange={(e) => updateCta(idx, { variant: e.target.value as any })} placeholder="primary/secondary/transparent/danger" />
              <div className="flex gap-2">
                <Button size="small" variant="danger" onClick={() => removeCta(idx)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
