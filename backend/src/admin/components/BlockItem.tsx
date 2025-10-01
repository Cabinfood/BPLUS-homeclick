// ui
import {
  Text,
  Badge,
  IconButton,
} from "@medusajs/ui";

// icons
import { Trash, GripVertical } from "lucide-react";

// dnd-kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// types
import type { DraftBlock, AdminContentBlock } from "./types";

type BlockData = DraftBlock | AdminContentBlock;

type Props = {
  block: BlockData;
  index: number;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete: (id: string) => void;
  // DnD Kit props - if provided, will use them instead of useSortable
  dragAttributes?: any;
  dragListeners?: any;
  dragRef?: (node: HTMLElement | null) => void;
  dragStyle?: React.CSSProperties;
  isDragging?: boolean;
  // If true, will use useSortable hook internally
  useSortable?: boolean;
  // Show drag handle
  showDragHandle?: boolean;
  // Disable delete button when busy
  isBusy?: boolean;
};

export default function BlockItem({
  block,
  index,
  isSelected = false,
  onSelect,
  onDelete,
  dragAttributes,
  dragListeners,
  dragRef,
  dragStyle,
  isDragging = false,
  useSortable: useSortableInternal = false,
  showDragHandle = true,
  isBusy = false,
}: Props) {
  // Use internal useSortable hook if requested and no external DnD props provided
  const sortable = useSortableInternal && !dragAttributes ? useSortable({ id: block.id }) : null;
  
  const finalDragAttributes = dragAttributes || sortable?.attributes;
  const finalDragListeners = dragListeners || sortable?.listeners;
  const finalDragRef = dragRef || sortable?.setNodeRef;
  const finalDragStyle = dragStyle || (sortable ? {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  } : undefined);
  const finalIsDragging = isDragging || sortable?.isDragging || false;

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  // Determine if this is a DraftBlock or AdminContentBlock
  const isDraftBlock = 'type' in block;
  const blockType = isDraftBlock ? block.type : block.block_type;
  const blockTitle = isDraftBlock ? block.title : block.title;
  const blockId = block.id;

  return (
    <div
      ref={finalDragRef}
      style={finalDragStyle}
      className={`flex items-center gap-2 p-2 rounded border transition-colors ${
        isSelected 
          ? "bg-ui-bg-disabled border-ui-border-disabled" 
          : "bg-ui-bg-base border-ui-border-base hover:bg-ui-bg-subtle"
      } ${finalIsDragging ? "opacity-50" : ""} ${
        onSelect ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      {showDragHandle && (
        <div
          {...finalDragAttributes}
          {...finalDragListeners}
          className="p-1 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="size-4 text-ui-fg-muted" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 items-center">
          <Badge size="xsmall">{blockType}</Badge>
          {/* Show rank for AdminContentBlock */}
          {!isDraftBlock && 'rank' in block && block.rank !== null && block.rank !== undefined && (
            <Text size="xsmall" className="text-ui-tag-neutral-icon">
              - {block.rank}
            </Text>
          )}
        </div>
        {blockTitle && (
          <Text size="small" className="font-medium truncate">
            {blockTitle}
          </Text>
        )}
        {!blockTitle && (
          <Text size="small" className="italic text-ui-fg-muted">
            Untitled {blockType} block
          </Text>
        )}
      </div>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(blockId);
        }}
        disabled={isBusy}
      >
        <Trash className="text-red-500 size-4" />
      </IconButton>
    </div>
  );
}