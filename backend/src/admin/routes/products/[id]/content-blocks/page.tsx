import { defineRouteConfig } from "@medusajs/admin-sdk";
import { DocumentText } from "@medusajs/icons";
import { Container, Heading, Button, Text, Drawer } from "@medusajs/ui";
import { Plus, ArrowLeft } from "lucide-react";
import { BlockForm } from "./components/BlockForm";
import { BlocksList } from "./components/BlocksList";
import { EmptyState } from "./components/EmptyState";
import { useContentBlocks } from "./hooks/useContentBlocks";

const ContentBlocksPage = () => {
  const productId = window.location.pathname.split("/").filter(Boolean)[2];

  const {
    blocks,
    isLoading,
    isSaving,
    isDeleting,
    drawerOpen,
    editingBlock,
    formData,
    hasChanges,
    setDrawerOpen,
    setFormData,
    handleCreate,
    handleEdit,
    handleSave,
    handleDelete,
    handleDragEnd,
  } = useContentBlocks(productId);

  return (
    <div className="flex flex-col gap-y-4">
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a
              href={`/app/products/${productId}`}
              className="p-2 hover:bg-ui-bg-subtle rounded transition-colors"
            >
              <ArrowLeft className="size-5" />
            </a>
            <div>
              <Heading level="h1">Content Blocks</Heading>
              <Text className="text-ui-fg-subtle mt-1">
                Quản lý nội dung blocks của sản phẩm
              </Text>
            </div>
          </div>
          <Button onClick={handleCreate} disabled={isLoading || isSaving}>
            <Plus className="size-4" />
            Tạo Block Mới
          </Button>
        </div>
      </Container>

      <Container className="p-6">
        {isLoading ? (
          <Text>Đang tải...</Text>
        ) : blocks.length === 0 ? (
          <EmptyState onCreate={handleCreate} />
        ) : (
          <BlocksList
            blocks={blocks}
            onDragEnd={handleDragEnd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </Container>

      {/* Drawer for Create/Edit */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Content className="flex flex-col h-vh">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="flex flex-col h-full"
          >
            <Drawer.Header>
              <Drawer.Title>
                {editingBlock ? "Chỉnh sửa Block" : "Tạo Block Mới"}
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="flex-1 overflow-y-auto">
              <BlockForm
                formData={formData}
                onChange={(updates) =>
                  setFormData((prev) => ({ ...prev, ...updates }))
                }
              />
            </Drawer.Body>
            <Drawer.Footer className="flex-shrink-0">
              <Drawer.Close asChild>
                <Button variant="secondary" type="button">
                  Hủy
                </Button>
              </Drawer.Close>
              <Button type="submit" disabled={isSaving || !hasChanges}>
                {isSaving ? "Đang lưu..." : "Lưu Block"}
              </Button>
            </Drawer.Footer>
          </form>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Content Blocks",
  icon: DocumentText,
});

export const handle = {
  breadcrumb: () => "Content Blocks",
};

export default ContentBlocksPage;
