/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/sabotazysci-mentalni/co-dalej',
        destination: '/sabotazysci-mentalni/co-dalej/index.html',
      },
      {
        source: '/sabotazysci-mentalni/co-dalej/',
        destination: '/sabotazysci-mentalni/co-dalej/index.html',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

module.exports = nextConfig;
