import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow localhost preview via 127.0.0.1 during development.
  allowedDevOrigins: ["localhost", "127.0.0.1"],
};

export default nextConfig;
