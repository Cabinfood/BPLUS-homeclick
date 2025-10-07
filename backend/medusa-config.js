import { loadEnv, Modules, defineConfig } from '@medusajs/utils';
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  REDIS_URL,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_SECRET,
  WORKER_MODE,
  MINIO_ENDPOINT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
  MEILISEARCH_HOST,
  MEILISEARCH_ADMIN_KEY,
  S3_FILE_URL,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_REGION,
  S3_BUCKET,
  S3_ENDPOINT,
} from 'lib/constants';

loadEnv(process.env.NODE_ENV, process.cwd());

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      storeCors: STORE_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET
    },
    build: {
      rollupOptions: {
        external: [
          "@medusajs/dashboard",
          "@medusajs/draft-order",
          "@medusajs/draft-order/admin",
          "@medusajs/admin-sdk",
          "@medusajs/framework",
          "@medusajs/medusa",
          "@medusajs/ui",
          "@medusajs/utils"
        ]
      }
    }
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  modules: [
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          // Priority 1: Use R2 (S3-compatible) if configured
          ...(S3_FILE_URL && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY ? [{
            resolve: '@medusajs/medusa/file-s3',
            id: 's3',
            options: {
              file_url: S3_FILE_URL,
              access_key_id: S3_ACCESS_KEY_ID,
              secret_access_key: S3_SECRET_ACCESS_KEY,
              region: S3_REGION,
              bucket: S3_BUCKET,
              endpoint: S3_ENDPOINT,
            }
          }] :
          // Priority 2: Fallback to local
          [{
            resolve: '@medusajs/medusa/file-local',
            id: 'local',
            options: {
              upload_dir: 'static',
              backend_url: `${BACKEND_URL}/static`
            }
          }])
        ]
      }
    },
    ...(REDIS_URL ? [{
      key: Modules.EVENT_BUS,
      resolve: '@medusajs/event-bus-redis',
      options: {
        redisUrl: REDIS_URL
      }
    },
    {
      key: Modules.WORKFLOW_ENGINE,
      resolve: '@medusajs/workflow-engine-redis',
      options: {
        redis: {
          url: REDIS_URL,
        }
      }
    }] : []),
    ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL || RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
      key: Modules.NOTIFICATION,
      resolve: '@medusajs/notification',
      options: {
        providers: [
          ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL ? [{
            resolve: '@medusajs/notification-sendgrid',
            id: 'sendgrid',
            options: {
              channels: ['email'],
              api_key: SENDGRID_API_KEY,
              from: SENDGRID_FROM_EMAIL,
            }
          }] : []),
          ...(RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
            resolve: './src/modules/email-notifications',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: RESEND_API_KEY,
              from: RESEND_FROM_EMAIL,
            },
          }] : []),
        ]
      }
    }] : []),
    ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET ? [{
      key: Modules.PAYMENT,
      resolve: '@medusajs/payment',
      options: {
        providers: [
          {
            resolve: '@medusajs/payment-stripe',
            id: 'stripe',
            options: {
              apiKey: STRIPE_API_KEY,
              webhookSecret: STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    }] : []),
    {
      resolve: './src/modules/content-block',
    },
    {
      resolve: './src/modules/hero-slide',
    },
  ],
  plugins: [
    {
      resolve: 'medusa-variant-images',
      options: {},
    },
    ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY ? [{
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: MEILISEARCH_HOST,
          apiKey: MEILISEARCH_ADMIN_KEY
        },
        settings: {
          products: {
            type: 'products',
            enabled: true,
            // OPTIMIZED: Reduced fields to only essential ones (was 6, now 4)
            // Removed: 'description' (heavy), 'variant_sku' (rarely searched)
            fields: ['id', 'title', 'handle', 'thumbnail'],
            indexSettings: {
              // OPTIMIZED: Only index title for search (was 3 fields, now 1)
              // Title is the most relevant for product search
              searchableAttributes: ['title'],
              // OPTIMIZED: Reduced displayed attributes (was 6, now 4)
              displayedAttributes: ['id', 'handle', 'title', 'thumbnail'],
              // OPTIMIZED: Only filter by handle (id filtering not needed in search)
              filterableAttributes: ['handle'],
              // OPTIMIZED: Add pagination limit to prevent loading too many results
              pagination: {
                maxTotalHits: 1000 // Limit total searchable results
              },
              // OPTIMIZED: Reduce ranking rules for faster indexing
              rankingRules: [
                'words',
                'typo',
                'proximity',
                'attribute',
                'sort',
                'exactness'
              ],
              // OPTIMIZED: Set typo tolerance to reduce index size
              typoTolerance: {
                enabled: true,
                minWordSizeForTypos: {
                  oneTypo: 5,
                  twoTypos: 9
                }
              }
            },
            primaryKey: 'id',
          }
        }
      }
    }] : [])
  ]
};

console.log(JSON.stringify(medusaConfig, null, 2));
export default defineConfig(medusaConfig);
