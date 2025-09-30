// ui
import { Input, Text, Textarea } from "@medusajs/ui"

export type TextBlockData = {
  title?: string
  content: string
}

type Props = {
  value: TextBlockData
  onChange: (next: TextBlockData) => void
}

export default function TextFields({ value, onChange }: Props) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-1">
        <Text size="small">Title</Text>
        <Input
          value={value.title ?? ""}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Tiêu đề (không bắt buộc)"
        />
      </div>
      <div className="grid gap-1">
        <Text size="small">Content</Text>
        <Textarea
          value={value.content ?? ""}
          onChange={(e) => onChange({ ...value, content: e.target.value })}
          placeholder="Nội dung mô tả (bắt buộc)"
          className="min-h-[140px]"
        />
      </div>
    </div>
  )
}


