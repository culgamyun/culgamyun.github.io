import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "192.168.219.100"],
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
