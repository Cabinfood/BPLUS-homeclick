// ui
import {
  Button,
  FocusModal,
} from "@medusajs/ui";

// local components
import DraftBlockEditor from "./DraftBlockEditor";
import BlockList from "./BlockList";

// types
import type { DraftBlock, AdminContentBlock } from "./types";

// react
import { useState, useCallback, useMemo } from "react";

// validation
import { validateDraftBlock } from "./validation";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  drafts: DraftBlock[];
  onDraftsChange: (drafts: DraftBlock[]) => void;
  onApplyTemplate: (idx: number) => void;
  onFormatJson: (idx: number) => void;
  onResetJson: (idx: number) => void;
  onAddDraft: () => void;
  onCreate: () => void;
  isDraftJsonValid: (d: DraftBlock) => boolean;
  suggestedTemplates: Record<string, Record<string, unknown>>;
  defaultBlockTypes: Array<{ value: string; label: string }>;
  isSaving: boolean;
  productId: string;
  // Props for existing blocks from DB
  existingBlocks?: AdminContentBlock[];
  onDeleteExisting?: (id: string) => void;
  onReorderExisting?: (blocks: AdminContentBlock[]) => void;
  onUpdateExisting?: (id: string, updates: Partial<AdminContentBlock>) => void;
};

export default function CreateBlockModal({
  isOpen,
  onOpenChange,
  drafts,
  onDraftsChange,
  onApplyTemplate,
  onFormatJson,
  onResetJson,
  onAddDraft,
  onCreate,
  isDraftJsonValid,
  suggestedTemplates,
  defaultBlockTypes,
  isSaving,
  productId,
  existingBlocks = [],
  onDeleteExisting,
  onReorderExisting,
  onUpdateExisting,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingExistingBlock, setEditingExistingBlock] = useState<AdminContentBlock | null>(null);
  const [editingDraft, setEditingDraft] = useState<DraftBlock | null>(null);

  const handleDraftChange = useCallback((updatedDraft: DraftBlock) => {
    const newDrafts = [...drafts];
    newDrafts[selectedIndex] = updatedDraft;
    onDraftsChange(newDrafts);
  }, [drafts, selectedIndex, onDraftsChange]);

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (direction === 'next' && selectedIndex < drafts.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, drafts.length]);

  const handleDelete = useCallback((id: string) => {
    const index = drafts.findIndex(d => d.id === id);
    if (index === -1) return;
    
    const newDrafts = drafts.filter((_, i) => i !== index);
    onDraftsChange(newDrafts);
    
    // Adjust selected index if needed
    if (newDrafts.length === 0) {
      setSelectedIndex(0);
    } else if (selectedIndex >= newDrafts.length) {
      setSelectedIndex(Math.max(0, newDrafts.length - 1));
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [drafts, selectedIndex, onDraftsChange]);

  const handleAddDraftAndSelect = useCallback(() => {
    onAddDraft();
    setSelectedIndex(drafts.length); // Select the newly added draft
    setEditingExistingBlock(null); // Clear editing existing block
  }, [onAddDraft, drafts.length]);

  // Convert existing block to draft block for editing
  const convertToDraft = useCallback((block: AdminContentBlock): DraftBlock => {
    const blockData = block.block_data as any;
    
    // Determine the form data based on block type
    let textForm = { content: "" };
    let mediaForm = { type: "image" as const, url: "", alt: "", caption: "" };
    let specsForm = { items: [] };
    let heroForm = { videoUrl: "", imageUrl: "", ctaButtons: [] as any[] };
    let bentoGridForm = { items: [] as any[], moreText: "", moreHref: "" };
    let featuresForm = { title: "", features: [] as any[] };
    let testimonialsForm = { title: "", testimonials: [] as any[] };
    
    if (block.block_type === "text") {
      textForm = {
        content: blockData.content || ""
      };
    } else if (block.block_type === "media") {
      mediaForm = {
        type: blockData.type || "image",
        url: blockData.url || "",
        alt: blockData.alt || "",
        caption: blockData.caption || ""
      };
    } else if (block.block_type === "specs") {
      specsForm = {
        items: blockData.items || []
      };
    } else if (block.block_type === "hero") {
      heroForm = {
        videoUrl: blockData.videoUrl || "",
        imageUrl: blockData.imageUrl || "",
        ctaButtons: blockData.ctaButtons || []
      }
    } else if (block.block_type === "bento_grid") {
      bentoGridForm = {
        items: blockData.items || [],
        moreText: blockData.moreText || "",
        moreHref: blockData.moreHref || "",
      }
    } else if (block.block_type === "features") {
      featuresForm = {
        title: blockData.title || "",
        features: Array.isArray(blockData.features) ? blockData.features : [],
      }
    } else if (block.block_type === "testimonials") {
      testimonialsForm = {
        title: blockData.title || "",
        testimonials: Array.isArray(blockData.testimonials) ? blockData.testimonials : [],
      }
    }
    
    return {
      id: `edit-${block.id}`, // Special ID for editing
      type: block.block_type,
      title: block.title || "",
      description: block.description || "",
      showAdvanced: false,
      jsonText: JSON.stringify(blockData, null, 2),
      textForm,
      mediaForm,
      specsForm,
      heroForm,
      bentoGridForm,
      featuresForm,
      testimonialsForm,
    };
  }, []);

  const handleEditExistingBlock = useCallback((block: AdminContentBlock) => {
    setEditingExistingBlock(block);
    const draft = convertToDraft(block);
    setEditingDraft(draft);
    setSelectedIndex(-1); // Clear draft selection
  }, [convertToDraft]);

  const handleCancelEditExisting = useCallback(() => {
    setEditingExistingBlock(null);
    setEditingDraft(null);
    setSelectedIndex(0); // Select first draft if available
  }, []);

  const handleEditDraftChange = useCallback((updatedDraft: DraftBlock) => {
    setEditingDraft(updatedDraft);
  }, []);

  const handleSaveExistingBlock = useCallback(() => {
    if (!editingExistingBlock || !editingDraft || !onUpdateExisting) return;
    
    // Convert draft back to block data
    let blockData: any = {};
    
    switch (editingDraft.type) {
      case "text":
        blockData = editingDraft.textForm;
        break;
      case "media":
        blockData = editingDraft.mediaForm;
        break;
      case "specs":
        blockData = editingDraft.specsForm;
        break;
      case "hero":
        blockData = editingDraft.heroForm;
        break;
      case "bento_grid":
        blockData = editingDraft.bentoGridForm;
        break;
      case "features":
        blockData = editingDraft.featuresForm;
        break;
      case "testimonials":
        blockData = editingDraft.testimonialsForm;
        break;
    }
    
    // If advanced mode, use JSON data
    if (editingDraft.showAdvanced) {
      try {
        blockData = JSON.parse(editingDraft.jsonText);
      } catch (e) {
        console.error("Invalid JSON in advanced mode:", e);
        return;
      }
    }
    
    const updates: Partial<AdminContentBlock> = {
      title: editingDraft.title || null,
      description: editingDraft.description || null,
      block_type: editingDraft.type,
      block_data: blockData
    };
    
    onUpdateExisting(editingExistingBlock.id, updates);
    handleCancelEditExisting();
  }, [editingExistingBlock, editingDraft, onUpdateExisting, handleCancelEditExisting]);

  // Calculate the next rank for new blocks
  const getNextRank = useCallback(() => {
    if (existingBlocks.length === 0) return 0;
    
    const maxRank = Math.max(...existingBlocks.map(block => block.rank || 0));
    return maxRank + 1;
  }, [existingBlocks]);

  const currentDraft = drafts[selectedIndex];
  const hasDrafts = drafts.length > 0;
  const isEditingExisting = editingExistingBlock !== null;
  const currentEditingDraft = isEditingExisting ? editingDraft : currentDraft;

  // Validation function for draft content based on block type
  // Memoized validation using Zod
  const validationResults = useMemo(() => {
    return drafts.map(draft => validateDraftBlock(draft));
  }, [drafts]);

  const hasValidDrafts = useMemo(() => {
    if (drafts.length === 0) return false;
    return validationResults.every(result => result.success);
  }, [drafts.length, validationResults]);

  const getValidationErrors = useCallback(() => {
    const errors: string[] = [];
    validationResults.forEach((result, index) => {
      if (!result.success && result.error) {
        errors.push(`Block #${index + 1}: ${result.error}`);
      }
    });
    return errors;
  }, [validationResults]);

  return (
    <FocusModal open={isOpen} onOpenChange={onOpenChange}>
      <FocusModal.Content className="">
        <FocusModal.Header>
          <FocusModal.Title className="text-xl font-semibold">Content Block Editor</FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Body className="flex p-0 h-full">
          {/* Left column - Blocks list (1/4) */}
          <div className="w-1/4 border-r">  
            <div className="flex flex-col h-full">
              {/* Existing blocks from DB */}
              {existingBlocks.length > 0 && (
                <div className="flex-1 max-h-96 border-b">
                  <BlockList<AdminContentBlock>
                    blocks={existingBlocks}
                    onDelete={onDeleteExisting || (() => {})}
                    onReorder={onReorderExisting}
                    onSelect={handleEditExistingBlock}
                    showHeader={true}
                    headerTitle="Existing Blocks"
                    emptyMessage=""
                  />
                </div>
              )}
              
              {/* Draft blocks */}
              <div className="flex-1 max-h-96">
                <BlockList<DraftBlock>
                  blocks={drafts}
                  selectedIndex={selectedIndex}
                  onReorder={onDraftsChange}
                  onSelect={(block) => {
                    const index = drafts.findIndex(d => d.id === block.id);
                    if (index !== -1) setSelectedIndex(index);
                  }}
                  onDelete={handleDelete}
                  onAddBlock={handleAddDraftAndSelect}
                  isBusy={isSaving}
                  showHeader={true}
                  headerTitle="Draft Blocks"
                  addButtonText="Thêm Block"
                  emptyMessage="Chưa có block nào"
                />
              </div>
            </div>
          </div>

          {/* Right column - Editor (3/4) */}
          <div className="flex-1">
            {currentEditingDraft ? (
              <div className="flex flex-col h-full">
                {isEditingExisting && (
                  <div className="flex justify-between items-center p-3 border-b bg-ui-bg-subtle">
                    <div className="flex gap-2 items-center">
                      <h3 className="text-lg font-semibold">Edit Existing Block</h3>
                      <span className="text-sm text-ui-fg-muted">
                        {editingExistingBlock?.title || `Block #${editingExistingBlock?.rank}`}
                      </span>
                    </div>
                    <Button variant="danger" onClick={handleCancelEditExisting}>
                      Cancel Edit
                    </Button>
                  </div>
                )}
                <DraftBlockEditor
                  draft={currentEditingDraft}
                  index={isEditingExisting ? 0 : selectedIndex}
                  totalCount={isEditingExisting ? 1 : drafts.length}
                  onDraftChange={isEditingExisting ? handleEditDraftChange : handleDraftChange}
                  onNavigate={isEditingExisting ? () => {} : handleNavigate}
                  onApplyTemplate={() => isEditingExisting ? {} : onApplyTemplate(selectedIndex)}
                  onFormatJson={() => isEditingExisting ? {} : onFormatJson(selectedIndex)}
                  onResetJson={() => isEditingExisting ? {} : onResetJson(selectedIndex)}
                  isDraftJsonValid={isDraftJsonValid(currentEditingDraft)}
                  suggestedTemplates={suggestedTemplates}
                  defaultBlockTypes={defaultBlockTypes}
                  validationError={isEditingExisting ? null : (validationResults[selectedIndex]?.error || null)}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <p className="mb-4 text-ui-fg-muted">Chưa có block nào</p>
                  <Button onClick={handleAddDraftAndSelect}>
                    Tạo block mới
                  </Button>
                </div>
              </div>
            )}
          </div>
        </FocusModal.Body>
        <FocusModal.Footer className="py-2 h-fit">
          <FocusModal.Close asChild>
            <Button variant="secondary">Đóng</Button>
          </FocusModal.Close>
          <div className="flex flex-col gap-2">
            {isEditingExisting ? (
              <Button
                onClick={handleSaveExistingBlock}
                isLoading={isSaving}
                disabled={isSaving || !editingDraft}
              >
                Lưu thay đổi
              </Button>
            ) : (
              <Button
                onClick={onCreate}
                isLoading={isSaving}
                disabled={isSaving || !productId || !hasDrafts || !hasValidDrafts}
              >
                Tạo {drafts.length > 0 ? `${drafts.length} block${drafts.length > 1 ? 's' : ''}` : 'block'}
              </Button>
            )}
          </div>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  );
}
