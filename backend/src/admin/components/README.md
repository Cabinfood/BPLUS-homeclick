# Admin Shared Components

Thư mục này chứa các **shared components** được sử dụng chung cho nhiều routes/features trong MedusaJS Admin Dashboard.

## Cấu trúc

```
admin/
├── components/           # Shared components
│   └── fields/          # Form field components
│       ├── MediaFile.tsx       # Media file upload (image/video)
│       ├── TextFields.tsx      # Text content field
│       ├── SpecsFields.tsx     # Specifications key-value pairs
│       └── index.ts            # Barrel exports
│
└── routes/              # Feature-specific routes
    └── products/
        └── [id]/
            └── content-blocks/   # Content blocks feature
                ├── page.tsx              # Main route page
                ├── types.ts              # Feature-specific types
                ├── constants.ts          # Feature constants
                ├── components/           # Feature-specific components
                │   ├── BlockForm.tsx
                │   ├── BlocksList.tsx
                │   ├── EmptyState.tsx
                │   ├── SortableBlockItem.tsx
                │   └── index.ts
                └── hooks/                # Feature-specific hooks
                    └── useContentBlocks.ts
```

## Sử dụng Shared Components

### Import từ barrel exports

```typescript
// ✅ Good - Import từ index.ts
import { MediaFile, TextFields, SpecsFields } from "../../../../components/fields";
import type { MediaFileBlockData, TextBlockData } from "../../../../components/fields";

// ❌ Avoid - Import trực tiếp
import MediaFile from "../../../../components/fields/MediaFile";
```

## Quy tắc

### 1. **Shared Components** (`/admin/components/`)
- Chỉ chứa components được **tái sử dụng** ở nhiều nơi
- Không có business logic cụ thể của feature
- Phải có types export rõ ràng
- Có barrel exports (index.ts)

### 2. **Feature-specific Components** (`/admin/routes/.../components/`)
- Components chỉ dùng cho feature đó
- Có thể chứa business logic của feature
- Không export ra ngoài feature

### 3. **Khi nào tạo Shared Component?**

✅ **Nên tạo khi:**
- Component được dùng ở ≥ 2 features
- Logic độc lập, không phụ thuộc feature cụ thể
- Có thể reusable và generic

❌ **Không nên tạo khi:**
- Chỉ dùng trong 1 feature
- Logic phức tạp, phụ thuộc vào feature context
- Quá specific cho một use case

## Ví dụ

### MediaFile - Shared Component ✅
```typescript
// Dùng cho: Content Blocks, Product Media, Category Images, etc.
<MediaFile
  value={{ type: "image", url: "", alt: "", caption: "" }}
  onChange={(data) => setMediaData(data)}
/>
```

### BlockForm - Feature-specific Component ✅
```typescript
// Chỉ dùng trong Content Blocks feature
<BlockForm
  formData={formData}
  onChange={handleChange}
  onSave={handleSave}
/>
```

## Migration Guide

Nếu muốn chuyển component từ feature-specific sang shared:

1. Di chuyển file từ `routes/.../components/` → `components/`
2. Remove feature-specific logic
3. Generalize props interface
4. Add to barrel exports (`index.ts`)
5. Update imports ở các nơi sử dụng
6. Update documentation
