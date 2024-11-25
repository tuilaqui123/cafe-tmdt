/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**'
            }
        ],
    },
    async redirects() {
        return [
          {
            source: '/',
            destination: '/home',
            permanent: false,
          },
        ];
    },
};

export default nextConfig;
