/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: ['via.placeholder.com', 'dummyimage.com'],
    },
};

module.exports = nextConfig;
