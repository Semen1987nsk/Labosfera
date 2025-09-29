/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.app.github.dev',
      },
      {
        protocol: 'http',
        hostname: '**.app.github.dev',
      }
    ],
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev/api/:path*',
      },
    ]
  },
};

export default nextConfig;