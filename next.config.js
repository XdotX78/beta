/** @type {import('next').NextConfig} */
const nextConfig = {
  // Modern Next.js configuration
  reactStrictMode: true,
  // No need for appDir: true as it's default in recent Next.js versions
  // No need for optimizeFonts: false as the default behavior is better
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
    // Set reasonable image size limits (2MB) for development
    minimumCacheTTL: 60,
    // Disable image size warnings for large images in dev
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};

module.exports = nextConfig; 