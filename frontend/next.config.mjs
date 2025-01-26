/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'digitailpets.s3.ap-southeast-2.amazonaws.com',
          port: '',
          pathname: '/pet-products-images/**',
        },
      ],
    },
}

export default nextConfig;
