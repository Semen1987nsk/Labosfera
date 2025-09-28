/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Правило для HTTPS
        protocol: 'https',
        hostname: 'humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev',
      },
      {
        // Правило для HTTP (решает нашу текущую проблему)
        protocol: 'http',
        hostname: 'humble-winner-97w5q7j66rqxhx9qq-8000.app.github.dev',
      },
    ],
  },
};

export default nextConfig;