/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "auth.rentlivaro.com",
        port: "",
        pathname: "/storage/v1/object/public/**"
      }
    ]
  }
};

module.exports = nextConfig;
