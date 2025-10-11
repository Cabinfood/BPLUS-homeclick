import { defineWidgetConfig } from "@medusajs/admin-sdk";
import type {
  DetailWidgetProps,
  AdminProduct,
} from "@medusajs/framework/types";
import { Container, IconButton } from "@medusajs/ui";
import { 
  DocumentText, 
  CubeSolid, 
  ChartBar, 
  SparklesSolid 
} from "@medusajs/icons";

const ProductQuickNavigation = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  if (!product?.id) return null;

  const tabs = [
    {
      label: "Content Blocks",
      icon: DocumentText,
      href: `/app/products/${product.id}/content-blocks`,
      description: "Quản lý nội dung blocks",
    },
    {
      label: "Model 3D",
      icon: CubeSolid,
      href: `/app/products/${product.id}/model-3d`,
      description: "Quản lý model 3D",
    },
    {
      label: "Analytics",
      icon: ChartBar,
      href: `/app/products/${product.id}/analytics`,
      description: "Thống kê & phân tích",
    },
    {
      label: "Marketing",
      icon: SparklesSolid,
      href: `/app/products/${product.id}/marketing`,
      description: "Chiến dịch marketing",
    },
  ];

  return (
      <div className=" py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <a
                key={tab.label}
                href={tab.href}
                className="group flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <IconButton>
                  <Icon />
                </IconButton>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {tab.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {tab.description}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

  );
};

export const config = defineWidgetConfig({
  zone: "product.details.before",
});

export default ProductQuickNavigation;
