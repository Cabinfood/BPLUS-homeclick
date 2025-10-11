import { Badge, IconButton } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Trash, Photo, Camera, DocumentText, DotsSix } from "@medusajs/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContentBlock } from "../types";
import type { MediaFileBlockData } from "../../../../../components/fields";

type SortableBlockItemProps = {
  block: ContentBlock;
  onEdit: (block: ContentBlock) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export const SortableBlockItem = ({
  block,
  onEdit,
  onDelete,
  isDeleting,
}: SortableBlockItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Parse media data if block type is media
  const mediaData: MediaFileBlockData | null = 
    block.block_type === "media" && block.block_data
      ? (block.block_data as MediaFileBlockData)
      : null;

  // Get block type icon
  const getBlockTypeIcon = () => {
    if (block.block_type === "media") {
      return <Camera className="size-4 text-ui-fg-subtle" />;
    }
    return <DocumentText className="size-4 text-ui-fg-subtle" />;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-1 border rounded-lg p-2 bg-white flex items-center gap-2 hover:shadow-sm transition-shadow"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 flex-shrink-0"
      >
        <DotsSix className="text-ui-fg-muted size-4" />
      </div>

      {/* Block Type Icon */}
      <div className="flex-shrink-0">
        {getBlockTypeIcon()}
      </div>

      {/* Media Preview Thumbnail */}
      {mediaData && mediaData.url && (
        <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-ui-bg-subtle border border-ui-border-base">
          <img
            src={mediaData.thumbnail_url || mediaData.url}
            alt={mediaData.alt || "Preview"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {block.title ? (
            <div className="font-medium text-sm truncate text-ui-fg-base">{block.title}</div>
          ) : (
            <div className="text-ui-fg-muted italic text-sm">Untitled</div>
          )}
          {mediaData && (
            <Badge size="2xsmall" className="flex-shrink-0">
              {mediaData.type}
            </Badge>
          )}
        </div>
        {block.description && (
          <div className="text-xs text-ui-fg-subtle line-clamp-1 mt-0.5">
            {block.description}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <IconButton
          size="small"
          variant="transparent"
          onClick={() => onEdit(block)}
        >
          <PencilSquare className="text-ui-fg-subtle" />
        </IconButton>
        <IconButton
          size="small"
          variant="transparent"
          onClick={() => onDelete(block.id)}
          disabled={isDeleting}
        >
          <Trash className="text-ui-fg-error" />
        </IconButton>
      </div>
    </div>
  );
};
