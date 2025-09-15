import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  updateProductVariantsWorkflow,
} from "@medusajs/medusa/core-flows";

// Price variation multipliers for diversity
const priceMultipliers = [0.6, 0.75, 0.85, 1.0, 1.15, 1.3, 1.5, 1.8, 2.0];

// Category-based price ranges (in VND)
const categoryRanges = {
  sofa: { min: 5000000, max: 50000000 },    // 5 triệu - 50 triệu VND
  chair: { min: 1000000, max: 15000000 },   // 1 triệu - 15 triệu VND  
  table: { min: 2000000, max: 25000000 }    // 2 triệu - 25 triệu VND
};

function getRandomMultiplier(): number {
  return priceMultipliers[Math.floor(Math.random() * priceMultipliers.length)];
}

function getRandomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function determineCategory(productTitle: string): keyof typeof categoryRanges {
  const title = productTitle.toLowerCase();
  if (title.includes('sofa') || title.includes('sectional') || title.includes('chesterfield')) {
    return 'sofa';
  } else if (title.includes('table') || title.includes('desk')) {
    return 'table';
  }
  return 'chair'; // default
}

function generateNewPrice(originalPrice: number, category: keyof typeof categoryRanges): number {
  const range = categoryRanges[category];
  const multiplier = getRandomMultiplier();
  
  // Apply multiplier to original price
  let newPrice = Math.round(originalPrice * multiplier);
  
  // Ensure it's within category range
  newPrice = Math.max(range.min, Math.min(range.max, newPrice));
  
  // Add random variation (±15%)
  const variation = 0.85 + Math.random() * 0.3;
  newPrice = Math.round(newPrice * variation);
  
  // Round to nearest 50,000 VND
  newPrice = Math.round(newPrice / 50000) * 50000;
  
  // Ensure minimum 100,000 VND
  return Math.max(100000, newPrice);
}

export default async function updateVariantPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Starting variant price updates using workflows...");

  try {
    // Get all product variants with their prices and product info
    const { data: variants } = await query.graph({
      entity: "product_variant",
      fields: [
        "id",
        "title",
        "product.id",
        "product.title",
        "prices.id",
        "prices.amount",
        "prices.currency_code"
      ],
      pagination: {
        skip: 0,
        take: 1000
      }
    });

    logger.info(`Found ${variants.length} variants to potentially update`);

    let updatedCount = 0;
    const batchSize = 20;

    for (let i = 0; i < variants.length; i += batchSize) {
      const batch = variants.slice(i, i + batchSize);
      logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(variants.length / batchSize)} (${batch.length} variants)`);

      for (const variant of batch) {
        try {
          if (!variant.product?.title || !variant.prices?.length) continue;

          const category = determineCategory(variant.product.title);
          const updatedPrices = [];

          // Update each price for the variant
          for (const price of variant.prices) {
            const currentAmount = Number(price.amount);
            const newAmount = generateNewPrice(currentAmount, category);
            
            if (newAmount !== currentAmount) {
              updatedPrices.push({
                id: price.id,
                amount: newAmount,
                currency_code: price.currency_code
              });
            }
          }

          // Update variant if there are price changes
          if (updatedPrices.length > 0) {
            await updateProductVariantsWorkflow(container).run({
              input: {
                selector: { id: variant.id },
                update: {
                  prices: updatedPrices
                }
              }
            });

            logger.info(`Updated variant ${variant.id} (${variant.title}) with ${updatedPrices.length} new prices`);
            updatedCount++;
          }
        } catch (error) {
          logger.warn(`Failed to update variant ${variant.id}: ${error.message}`);
        }
      }
    }

    logger.info(`✅ Successfully updated ${updatedCount} variants with diverse pricing!`);
    logger.info("Price variations applied:");
    logger.info("- Random multipliers: 0.6x to 2.0x (40% discount to 100% markup)");
    logger.info("- Category ranges:");
    logger.info("  • Sofas: 5 triệu - 50 triệu VND");
    logger.info("  • Chairs: 1 triệu - 15 triệu VND");
    logger.info("  • Tables: 2 triệu - 25 triệu VND");
    logger.info("- Additional ±15% random variation");
    logger.info("- Prices rounded to nearest 50,000 VND");

  } catch (error) {
    logger.error("Error updating variant prices:", error);
    throw error;
  }
}
