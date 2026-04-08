/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://pattayapro-backend-production.up.railway.app/api',
    NEXT_PUBLIC_PARTNER_URL: process.env.NEXT_PUBLIC_PARTNER_URL || 'https://pattayapro-partner.pages.dev',
  },
};
module.exports = nextConfig;
