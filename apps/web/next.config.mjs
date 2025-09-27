/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages', 'styles'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  trailingSlash: false,
};

export default nextConfig;
