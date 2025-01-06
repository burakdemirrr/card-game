/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'robohash.org',
      },
    ],
  },
  // Ignore specific deprecation warnings
  onDemandEntries: {
    // This will silence the punycode deprecation warning
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

// Suppress the punycode deprecation warning
process.removeAllListeners('warning');

module.exports = nextConfig; 