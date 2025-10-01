// ui
import {
  Button,
  Text,
} from "@medusajs/ui";

// dnd-kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// local components
import BlockItem from "./BlockItem";

// types
import type { DraftBlock, AdminContentBlock } from "./types";

type BlockData = DraftBlock | AdminContentBlock;

type Props<T extends BlockData = BlockData> = {
  blocks: T[];
  isLoading?: boolean;
  error?: string;
  isBusy?: boolean;
  selectedIndex?: number;
  onSelect?: (block: T) => void;
  onDelete: (id: string) => void;
  onReorder?: (newBlocks: T[]) => void;
  onAddBlock?: () => void;
  showHeader?: boolean;
  headerTitle?: string;
  addButtonText?: string;
  emptyMessage?: string;
  className?: string;
};

export default function BlockList<T extends BlockData = BlockData>({
  blocks,
  isLoading = false,
  error,
  isBusy = false,
  selectedIndex,
  onSelect,
  onDelete,
  onReorder,
  onAddBlock,
  showHeader = true,
  headerTitle = "Blocks",
  addButtonText = "Thêm Block",
  emptyMessage = "Chưa có block nào",
  className = "",
}: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!onReorder) return;
    
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      onReorder(newBlocks);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Text size="small">Đang tải...</Text>;
    }

    if (error) {
      return (
        <Text className="text-red-600" size="small">
          {error}
        </Text>
      );
    }

    if (blocks.length === 0) {
      return (
        <div className="py-8 text-center">
          <Text size="small" className="text-ui-fg-muted">
            {emptyMessage}
          </Text>
        </div>
      );
    }

    const blockItems = blocks.map((block, index) => (
      <BlockItem
        key={block.id}
        block={block}
        index={index}
        isSelected={selectedIndex === index}
        onSelect={onSelect ? () => onSelect(block) : undefined}
        onDelete={onDelete}
        showDragHandle={!!onReorder}
        useSortable={!!onReorder}
        isBusy={isBusy}
      />
    ));

    if (onReorder) {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((block) => block.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {blockItems}
            </div>
          </SortableContext>
        </DndContext>
      );
    }

    return <div className="space-y-2">{blockItems}</div>;
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {showHeader && (
        <div className="flex justify-between items-center p-3 border-b">
          <Text weight="plus">{headerTitle}</Text>
          {onAddBlock && (
            <Button 
              size="small" 
              variant="secondary" 
              onClick={onAddBlock} 
              disabled={isBusy}
            >
              {addButtonText}
            </Button>
          )}
        </div>
      )}

      <div className="overflow-y-auto flex-1 p-3">
        {renderContent()}
      </div>
    </div>
  );
}
