import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.13'],
  env: {
    AUTH_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.AUTH_URL ?? "http://localhost:3000"),
  },
};

export default nextConfig;
