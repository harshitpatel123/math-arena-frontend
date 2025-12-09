/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/profilePictures/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/profilePictures/**',
      },
    ],
  },
};

export default nextConfig;
