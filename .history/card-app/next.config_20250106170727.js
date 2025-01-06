/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placekitten.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
    ],
  },
};

module.exports = nextConfig; 