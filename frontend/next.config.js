/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    NEXT_PUBLIC_PARTNER_URL: process.env.NEXT_PUBLIC_PARTNER_URL || 'http://localhost:3001',
  },
};
module.exports = nextConfig;
