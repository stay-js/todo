/** @type {import("next").NextConfig} */

await import('./src/env.mjs');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
};

export default nextConfig;
