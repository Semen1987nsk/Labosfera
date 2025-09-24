/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '**.app.github.dev',
    }],
  },
};
export default nextConfig;