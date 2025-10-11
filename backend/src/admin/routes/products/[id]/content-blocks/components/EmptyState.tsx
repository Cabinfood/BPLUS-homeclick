import { Button, Text } from "@medusajs/ui";
import { Plus } from "lucide-react";

type EmptyStateProps = {
  onCreate: () => void;
};

export const EmptyState = ({ onCreate }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Text className="text-gray-500 mb-4">
        Chưa có block nào cho sản phẩm này
      </Text>
      <Button onClick={onCreate}>
        <Plus className="size-4" />
        Tạo Block Đầu Tiên
      </Button>
    </div>
  );
};
