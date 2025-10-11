import { defineRouteConfig } from "@medusajs/admin-sdk";
import { SparklesSolid } from "@medusajs/icons";
import { Container, Heading, Text } from "@medusajs/ui";

const MarketingPage = () => {
  const productId = window.location.pathname.split("/").filter(Boolean)[2];

  return (
    <div className="flex flex-col gap-y-4">
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h1">Marketing</Heading>
            <Text className="text-ui-fg-subtle mt-1">
              Quản lý chiến dịch marketing
            </Text>
          </div>
        </div>
      </Container>

      <Container className="p-6">
        <div className="text-center py-12">
          <SparklesSolid className="size-12 mx-auto text-gray-400 mb-4" />
          <Text className="text-gray-500 mb-2">
            Tính năng Marketing đang được phát triển
          </Text>
          <Text size="small" className="text-gray-400">
            Tạo và quản lý campaigns, promotions, email marketing
          </Text>
        </div>
      </Container>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Marketing",
  icon: SparklesSolid,
});

export default MarketingPage;
