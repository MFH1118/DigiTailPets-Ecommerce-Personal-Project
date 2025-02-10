/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'digitailpets.s3.ap-southeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Local development server
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      }
    ],
  },
}

export default nextConfig;