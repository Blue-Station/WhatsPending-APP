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
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  experimental: { esmExternals: true },
};

export default config;
