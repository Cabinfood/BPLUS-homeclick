# Content Block Schemas

This directory contains Zod schemas for validating content block related requests.

## Schemas

### ContentBlockSchema
Base schema for content block entities with all fields.

### ContentBlockQuerySchema
Schema for validating query parameters in GET requests.

### CreateContentBlockSchema
Schema for creating a single content block (excludes `id` field).

### CreateContentBlocksSchema
Schema for bulk creation of content blocks.

### ContentBlockRequestBodySchema
Union type that accepts either single block creation or bulk creation.

## Usage

```typescript
import { ContentBlockQuerySchema, CreateContentBlockSchema } from "../lib/schemas/content-block"

// Validate query parameters
const queryResult = ContentBlockQuerySchema.safeParse(req.query)
if (!queryResult.success) {
  throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid query parameters")
}

// Validate request body
const bodyResult = CreateContentBlockSchema.safeParse(req.body)
if (!bodyResult.success) {
  throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid request body")
}
```

## Field Validation

- `block_type`: Required string, minimum 1 character
- `block_data`: Required object (not null, not array)
- `title`: Optional nullable string
- `description`: Optional nullable string
- `rank`: Optional nullable integer, minimum 0
- `product_id`: Optional nullable string, minimum 1 character
