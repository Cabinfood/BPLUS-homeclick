// ui
import { Button, Input, Label, Textarea, Text } from "@medusajs/ui";

// react
import { useCallback } from "react";

// types
type TestimonialItem = {
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
};

export type TestimonialsFormValue = {
  title: string;
  testimonials: TestimonialItem[];
};

type Props = {
  value: TestimonialsFormValue;
  onChange: (val: TestimonialsFormValue) => void;
  validationError?: string | null;
};

export default function TestimonialsFields({ value, onChange, validationError }: Props) {
  const update = useCallback((patch: Partial<TestimonialsFormValue>) => {
    onChange({ ...value, ...patch });
  }, [value, onChange]);

  const updateItem = useCallback((index: number, patch: Partial<TestimonialItem>) => {
    const next = [...(value.testimonials || [])];
    next[index] = { ...next[index], ...patch } as TestimonialItem;
    update({ testimonials: next });
  }, [value.testimonials, update]);

  const removeItem = useCallback((index: number) => {
    const next = [...(value.testimonials || [])];
    next.splice(index, 1);
    update({ testimonials: next });
  }, [value.testimonials, update]);

  const addItem = useCallback(() => {
    const next = [...(value.testimonials || []), { name: "", role: "", content: "", rating: 5 }];
    update({ testimonials: next });
  }, [value.testimonials, update]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={value.title || ""}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="What Our Customers Say"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Testimonials</Label>
        <Button size="small" variant="secondary" onClick={addItem}>
          Thêm testimonial
        </Button>
      </div>

      <div className="space-y-4">
        {(value.testimonials || []).map((it, idx) => (
          <div key={idx} className="p-3 border rounded-md space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={it.name || ""}
                  onChange={(e) => updateItem(idx, { name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={it.role || ""}
                  onChange={(e) => updateItem(idx, { role: e.target.value })}
                  placeholder="Designer"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Avatar URL (optional)</Label>
                <Input
                  value={it.avatar || ""}
                  onChange={(e) => updateItem(idx, { avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={it.rating ?? 5}
                  onChange={(e) => updateItem(idx, { rating: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={it.content || ""}
                onChange={(e) => updateItem(idx, { content: e.target.value })}
                placeholder="Love it!"
              />
            </div>
            <div className="flex justify-end">
              <Button size="small" variant="danger" onClick={() => removeItem(idx)}>
                Xoá
              </Button>
            </div>
          </div>
        ))}
        {(!value.testimonials || value.testimonials.length === 0) && (
          <Text size="small" className="text-ui-fg-muted">Chưa có testimonial nào.</Text>
        )}
      </div>

      {validationError && (
        <Text size="small" className="text-red-600">{validationError}</Text>
      )}
    </div>
  );
}


