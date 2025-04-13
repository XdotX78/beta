const createMDX = require('@next/mdx');

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Modern Next.js configuration
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
  },
  // No need for appDir: true as it's default in recent Next.js versions
  // No need for optimizeFonts: false as the default behavior is better
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      }
    ],
    // Set reasonable image size limits (2MB) for development
    minimumCacheTTL: 60,
    // Disable image size warnings for large images in dev
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = withMDX(nextConfig); 