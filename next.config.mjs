const FIREBASE_UPSTREAM_DOMAIN = 'wasteindia.firebaseapp.com';

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/our-story',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/__/auth/:path*',
          destination: `https://${FIREBASE_UPSTREAM_DOMAIN}/__/auth/:path*`,
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      }
    ],
  },
};

export default nextConfig;
