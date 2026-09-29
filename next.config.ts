import type {NextConfig} from 'next';
import path from 'path';

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  transpilePackages: ['motion'],
  turbopack: {},
  ...(isGithubPages
    ? {
        output: 'export',
        basePath: '/AASRA',
        assetPrefix: '/AASRA',
      }
    : {
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [
                {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff',
                },
                {
                  key: 'Referrer-Policy',
                  value: 'strict-origin-when-cross-origin',
                },
                {
                  key: 'Permissions-Policy',
                  value: 'camera=(), microphone=(self), geolocation=()',
                },
                {
                  key: 'X-XSS-Protection',
                  value: '1; mode=block',
                },
              ],
            },
          ];
        },
      }),
  webpack: (config: any, {dev}: {dev: boolean}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
