// ui
import { Input, Text, Textarea } from "@medusajs/ui"
import { memo, useCallback, useState, useEffect } from "react"

export type TextBlockData = {
  content: string
}

type Props = {
  value: TextBlockData
  onChange: (next: TextBlockData) => void
  validationError?: string | null
}

const TextFields = memo(function TextFields({ value, onChange, validationError }: Props) {
  // Local state to prevent focus loss
  const [localContent, setLocalContent] = useState(value.content || "");

  // Sync local state when value changes
  useEffect(() => {
    setLocalContent(value.content || "");
  }, [value.content]);

  // removed title: title is stored on content_block, not inside block_data

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  }, []);

  const handleContentBlur = useCallback(() => {
    onChange({ 
      content: localContent
    });
  }, [localContent, onChange]);

  return (
    <div className="grid gap-3">
      {/* Title removed from block_data */}
      <div className="grid gap-1">
        <Text size="small" className={validationError ? "text-red-600" : ""}>
          Content <span className="text-red-500">*</span>
        </Text>
        <Textarea
          value={localContent}
          onChange={handleContentChange}
          onBlur={handleContentBlur}
          placeholder="Nội dung mô tả (bắt buộc)"
          className="min-h-[140px]"
        />
        {validationError && (
          <Text size="small" className="text-red-600">
            {validationError}
          </Text>
        )}
      </div>
    </div>
  )
})

export default TextFields


