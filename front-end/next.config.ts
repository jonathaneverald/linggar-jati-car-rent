import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    images: {
        domains: ["pickbazar-react-rest.vercel.app", "images.unsplash.com", "themesflat.co", "res.cloudinary.com", "via.placeholder.com"],
    },
};

export default nextConfig;
