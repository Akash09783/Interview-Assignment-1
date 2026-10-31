/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stembeauty.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
};

export default nextConfig;

