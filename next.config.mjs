import { withPayload } from "@payloadcms/next/withPayload";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // ← минимальный автономный рантайм для Docker
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stkaktiv.ru", // ← ваш прод-домен
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/media/**",
      },
    ],
  },
};

export default withPayload(nextConfig);
