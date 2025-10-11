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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBlockItem } from "./SortableBlockItem";
import { ContentBlock } from "../types";

type BlocksListProps = {
  blocks: ContentBlock[];
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (block: ContentBlock) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export const BlocksList = ({
  blocks,
  onDragEnd,
  onEdit,
  onDelete,
  isDeleting,
}: BlocksListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div key={block.id} className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ui-bg-subtle flex items-center justify-center text-ui-fg-muted text-xs font-medium">
                {index + 1}
              </div>
              <SortableBlockItem
                block={block}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
