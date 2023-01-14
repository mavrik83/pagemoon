/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: [
            'via.placeholder.com',
            'dummyimage.com',
            'images.unsplash.com',
            'source.unsplash.com',
        ],
    },
};

module.exports = nextConfig;
