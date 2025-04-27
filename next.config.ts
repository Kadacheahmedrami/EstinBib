import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "loremflickr.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "covers.openlibrary.org",
      "books.google.com",
      "books.googleusercontent.com",
      "books-google.com",
      "images.pexels.com",
      "img.youtube.com",
      "images.unsplash.com",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*", // Proxy path
//         destination: "https://dztabib.onrender.com/:path*", // Backend API
//       },
//     ];
//   },
// };

// export default nextConfig;
