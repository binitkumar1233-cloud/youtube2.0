import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.29.210",
    "0.0.0.0"
  ],
  onDemandEntries: {
    maxInactiveAge: 100 * 1000,
    pagesBufferLength: 10,
  },
  poweredByHeader: false,
  reactStrictMode: true, // Enable strict mode to catch potential issues
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  }
};

export default nextConfig;
