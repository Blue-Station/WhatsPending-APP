/**
 * @type {import('next').NextConfig}
 */
const config = {
  webpack: (config): any => {
    return config;
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  experimental: { esmExternals: true },
};

export default config;
