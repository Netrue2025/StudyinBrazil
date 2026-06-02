/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  },
  webpack(config) {
    config.cache = false;
    return config;
  }
};

export default nextConfig;
