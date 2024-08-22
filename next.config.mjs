/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "petopia-file-upload.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
