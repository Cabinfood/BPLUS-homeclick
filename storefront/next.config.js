const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize memory usage
  experimental: {
    // Reduce memory by minimizing cache
    isrMemoryCacheSize: 0, // Disable ISR memory cache (use only filesystem cache)
  },
  // Optimize production output
  productionBrowserSourceMaps: false, // Disable source maps to reduce memory
  compress: true, // Enable gzip compression
  webpack: (config) => {
    // Fix for Three.js and React Three Fiber
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/',
          outputPath: 'static/',
        },
      },
    })
    
    // Fix for Three.js modules
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",

      },
      { // Note: needed to serve images from /public folder
        protocol: process.env.NEXT_PUBLIC_BASE_URL?.startsWith('https') ? 'https' : 'http',
        hostname: process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, ''),
      },
      { // Note: only needed when using local-file for product media
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace('https://', ''),
      },
      { // Note: can be removed after deleting demo products
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      { // Note: can be removed after deleting demo products
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      { // Note: can be removed after deleting demo products
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      { // Note: can be removed after deleting demo products
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(process.env.NEXT_PUBLIC_MINIO_ENDPOINT ? [{ // Note: needed when using MinIO bucket storage for media
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MINIO_ENDPOINT,
      }] : []),
      { // Note: Railway bucket storage for media
        protocol: "https",
        hostname: "bucket-production-d647.up.railway.app",
      },
    ],
    // Optimize image loading performance
    formats: ['image/avif', 'image/webp'], // Use modern formats (30-50% smaller)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Common device widths
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Thumbnail sizes
    minimumCacheTTL: 60 * 60 * 24 * 60, // Cache optimized images for 60 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  serverRuntimeConfig: {
    port: process.env.PORT || 3000
  }
}

module.exports = nextConfig
