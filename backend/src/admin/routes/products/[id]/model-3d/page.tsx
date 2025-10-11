import { defineRouteConfig } from "@medusajs/admin-sdk";
import { CubeSolid } from "@medusajs/icons";
import { Container, Heading, Text } from "@medusajs/ui";
import { ArrowLeft } from "lucide-react";

const Model3DPage = () => {
  const productId = window.location.pathname.split("/").filter(Boolean)[2];

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
              <Heading level="h1">Model 3D</Heading>
              <Text className="text-ui-fg-subtle mt-1">
                Quản lý model 3D của sản phẩm
              </Text>
            </div>
          </div>
        </div>
      </Container>

      <Container className="p-6">
        <div className="text-center py-12">
          <CubeSolid className="size-12 mx-auto text-gray-400 mb-4" />
          <Text className="text-gray-500 mb-2">
            Tính năng Model 3D đang được phát triển
          </Text>
          <Text size="small" className="text-gray-400">
            Upload và quản lý model 3D (.glb, .gltf) cho sản phẩm
          </Text>
        </div>
      </Container>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Model 3D",
  icon: CubeSolid,
});

export const handle = {
  breadcrumb: () => "Model 3D",
};

export default Model3DPage;
