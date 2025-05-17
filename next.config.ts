import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
      'sprint-fe-project.s3.ap-northeast2.amazonaws.com',
      'k.kakaocdn.net',
    ],
  },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        include: /src\/assets/, // Only target SVG files in /src/assets
        use: ['@svgr/webpack'], // Use @svgr/webpack for SVG to React component conversion
      },
      {
        test: /\.svg$/i,
        include: /public/, // Only target SVG files in /public
        type: 'asset/resource', // Use asset module to handle SVG as a static file (no need for file-loader)
      }
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }
    return config;
  },

  output: 'standalone',
};

export default nextConfig;
