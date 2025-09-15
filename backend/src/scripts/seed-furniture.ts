import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows";

// Furniture product data
const furnitureData = {
  sofa: {
    names: [
      "Modern Sectional Sofa", "Luxury Velvet Sofa", "Scandinavian Sofa", "Chesterfield Sofa",
      "L-Shaped Corner Sofa", "Minimalist Sofa", "Vintage Leather Sofa", "Contemporary Sofa",
      "Reclining Sofa", "Modular Sofa System", "Mid-Century Sofa", "Sleeper Sofa",
      "Tufted Sofa", "Fabric Sofa", "Italian Leather Sofa", "Convertible Sofa",
      "Designer Sofa", "Compact Sofa", "Oversized Sofa", "Classic Sofa"
    ],
    materials: ["Leather", "Velvet", "Linen", "Cotton", "Microfiber", "Polyester"],
    colors: ["Black", "White", "Gray", "Brown", "Navy", "Beige", "Cream", "Charcoal"],
    sizes: ["2-Seater", "3-Seater", "4-Seater", "L-Shape"],
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
    ]
  },
  chair: {
    names: [
      "Ergonomic Office Chair", "Dining Chair", "Accent Chair", "Armchair",
      "Swivel Chair", "Rocking Chair", "Bar Stool", "Lounge Chair",
      "Gaming Chair", "Executive Chair", "Wingback Chair", "Folding Chair",
      "Desk Chair", "Upholstered Chair", "Wooden Chair", "Metal Chair",
      "Leather Chair", "Fabric Chair", "Modern Chair", "Vintage Chair"
    ],
    materials: ["Wood", "Metal", "Plastic", "Leather", "Fabric", "Mesh"],
    colors: ["Black", "White", "Brown", "Gray", "Red", "Blue", "Green", "Natural"],
    sizes: ["Standard", "Large", "Compact", "XL"],
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop"
    ]
  },
  table: {
    names: [
      "Dining Table", "Coffee Table", "Side Table", "Console Table",
      "End Table", "Desk Table", "Kitchen Table", "Round Table",
      "Rectangular Table", "Square Table", "Extendable Table", "Glass Table",
      "Wooden Table", "Metal Table", "Marble Table", "Oak Table",
      "Modern Table", "Vintage Table", "Industrial Table", "Farmhouse Table"
    ],
    materials: ["Wood", "Glass", "Metal", "Marble", "Oak", "Pine", "Walnut"],
    colors: ["Natural", "Black", "White", "Brown", "Gray", "Walnut", "Oak"],
    sizes: ["Small", "Medium", "Large", "XL"],
    images: [
      "https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop"
    ]
  }
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProductHandle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function generateProductDescription(category: string, name: string, material: string): string {
  const descriptions = {
    sofa: `Experience ultimate comfort with this ${name.toLowerCase()}. Crafted with premium ${material.toLowerCase()}, this piece combines style and functionality to transform your living space. Perfect for relaxation and entertaining guests.`,
    chair: `Enhance your space with this elegant ${name.toLowerCase()}. Made from high-quality ${material.toLowerCase()}, it offers both comfort and durability. Ideal for dining, working, or adding a stylish accent to any room.`,
    table: `Complete your interior with this stunning ${name.toLowerCase()}. Constructed from premium ${material.toLowerCase()}, it provides both beauty and functionality. Perfect for dining, working, or displaying your favorite items.`
  };
  return descriptions[category as keyof typeof descriptions] || `Beautiful ${name} made from ${material}.`;
}

export default async function seedFurnitureData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  logger.info("Starting furniture product seeding...");

  // Get homeclick.vn sales channel
  let salesChannel = await salesChannelModuleService.listSalesChannels({
    name: "homeclick.vn",
  });

  // If homeclick.vn doesn't exist, try Default Sales Channel as fallback
  if (!salesChannel.length) {
    salesChannel = await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    });
  }

  if (!salesChannel.length) {
    throw new Error("No sales channel found. Please ensure 'homeclick.vn' or 'Default Sales Channel' exists.");
  }

  // Get shipping profile
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default"
  });

  if (!shippingProfiles.length) {
    throw new Error("Default shipping profile not found. Please run the main seed script first.");
  }

  const shippingProfile = shippingProfiles[0];

  // Get existing furniture categories
  logger.info("Finding existing furniture categories...");
  const productCategoryModuleService = container.resolve(Modules.PRODUCT);
  
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: {
      name: ["Sofa", "Chair", "Table"]
    }
  });

  const sofaCategory = existingCategories.find((cat: any) => cat.name === "Sofa");
  const chairCategory = existingCategories.find((cat: any) => cat.name === "Chair");
  const tableCategory = existingCategories.find((cat: any) => cat.name === "Table");

  if (!sofaCategory || !chairCategory || !tableCategory) {
    throw new Error("Required categories not found. Please ensure Sofa, Chair, and Table categories exist.");
  }

  logger.info(`Found categories: Sofa (${sofaCategory.id}), Chair (${chairCategory.id}), Table (${tableCategory.id})`);

  // Generate 200 products (approximately 67 per category)
  const productsToCreate = [];
  const categoryConfig = [
    { category: "sofa", categoryId: sofaCategory.id, count: 67 },
    { category: "chair", categoryId: chairCategory.id, count: 67 },
    { category: "table", categoryId: tableCategory.id, count: 66 }
  ];

  let productCounter = 1;

  for (const { category, categoryId, count } of categoryConfig) {
    const categoryData = furnitureData[category as keyof typeof furnitureData];
    
    for (let i = 0; i < count; i++) {
      const name = getRandomElement(categoryData.names);
      const material = getRandomElement(categoryData.materials);
      const color = getRandomElement(categoryData.colors);
      const size = getRandomElement(categoryData.sizes);
      
      const title = `${name} - ${material} ${color}`;
      const handle = generateProductHandle(`${title}-${productCounter}`);
      const description = generateProductDescription(category, name, material);
      
      // Generate random prices (in cents)
      const basePrice = generateRandomPrice(
        category === "sofa" ? 50000 : category === "chair" ? 15000 : 25000,
        category === "sofa" ? 200000 : category === "chair" ? 80000 : 150000
      );
      
      const eurPrice = basePrice;
      const usdPrice = Math.floor(basePrice * 1.2); // USD is typically higher

      // Generate variants based on available options
      const variants = [];
      const availableSizes = categoryData.sizes;
      const availableColors = categoryData.colors.slice(0, 3); // Limit to 3 colors per product

      for (const variantSize of availableSizes.slice(0, 2)) { // Limit to 2 sizes
        for (const variantColor of availableColors.slice(0, 2)) { // Limit to 2 colors
          const variantTitle = `${variantSize} / ${variantColor}`;
          const sku = `${category.toUpperCase()}-${productCounter}-${variantSize.replace(/[^A-Z0-9]/g, '')}-${variantColor.replace(/[^A-Z0-9]/g, '')}`;
          
          // Add some price variation for variants
          const priceVariation = Math.floor(Math.random() * 2000) - 1000; // ±10 EUR variation
          
          variants.push({
            title: variantTitle,
            sku: sku,
            options: {
              Size: variantSize,
              Color: variantColor,
            },
            prices: [
              {
                amount: Math.max(1000, eurPrice + priceVariation),
                currency_code: "eur",
              },
              {
                amount: Math.max(1200, usdPrice + Math.floor(priceVariation * 1.2)),
                currency_code: "usd",
              },
            ],
          });
        }
      }

      const product = {
        title,
        category_ids: [categoryId],
        description,
        handle,
        weight: generateRandomPrice(1000, 5000), // Random weight in grams
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        images: [
          { url: getRandomElement(categoryData.images) },
          { url: getRandomElement(categoryData.images) }
        ],
        options: [
          {
            title: "Size",
            values: availableSizes.slice(0, 2),
          },
          {
            title: "Color",
            values: availableColors.slice(0, 2),
          },
        ],
        variants,
        sales_channels: [
          {
            id: salesChannel[0].id,
          },
        ]
      };

      productsToCreate.push(product);
      productCounter++;
    }
  }

  logger.info(`Creating ${productsToCreate.length} furniture products...`);
  
  // Create products in batches to avoid overwhelming the system
  const batchSize = 20;
  for (let i = 0; i < productsToCreate.length; i += batchSize) {
    const batch = productsToCreate.slice(i, i + batchSize);
    logger.info(`Creating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productsToCreate.length / batchSize)} (${batch.length} products)`);
    
    await createProductsWorkflow(container).run({
      input: {
        products: batch,
      },
    });
  }

  logger.info("Finished creating furniture products.");

  // Set inventory levels for all products
  logger.info("Setting inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  // Get stock location (assuming it exists from main seed)
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
  const stockLocations = await stockLocationModuleService.listStockLocations({});
  
  if (!stockLocations.length) {
    throw new Error("No stock locations found. Please run the main seed script first.");
  }

  const stockLocation = stockLocations[0];

  const inventoryLevels = inventoryItems.map((item: any) => ({
    location_id: stockLocation.id,
    stocked_quantity: generateRandomPrice(50, 500), // Random stock between 50-500
    inventory_item_id: item.id,
  }));

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding furniture inventory levels.");
  logger.info(`Successfully created ${productsToCreate.length} furniture products across 3 categories!`);
}
