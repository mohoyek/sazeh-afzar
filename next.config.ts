import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Allow localhost preview via 127.0.0.1 during development.
  allowedDevOrigins: ["localhost", "127.0.0.1"],
};

export default nextConfig;

// Cloudflare bindings را در توسعهٔ محلی (next dev) در دسترس قرار می‌دهد
initOpenNextCloudflareForDev();
