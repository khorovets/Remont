/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@remont/shared'],
};

module.exports = nextConfig;
