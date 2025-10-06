/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.app.github.dev',
      },
      {
        protocol: 'http',
        hostname: '**.app.github.dev',
      },
      {
        protocol: 'https',
        hostname: 'labosfera.ru',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
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
        destination: 'http://backend:8000/api/:path*',
      },
    ]
  },
};

export default nextConfig;