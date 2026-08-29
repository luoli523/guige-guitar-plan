import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS ? '/guige-guitar-plan' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/guige-guitar-plan/' : '',
};

export default nextConfig;
