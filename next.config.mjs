import { withPayload } from "@payloadcms/next/withPayload";

const siteHostname = process.env.NEXT_PUBLIC_SITE_HOSTNAME || "stkaktiv.ru";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false, // не светим X-Powered-By: Next.js
  compress: true,
  turbopack: { root: process.cwd() },
  experimental: {
    // Кеш Turbopack на диске для `next build` намеренно выключен: на VPS
    // упираемся в IOPS мелких файлов, и запись кеша занимала ~16 минут
    // (дольше самой компиляции), а `docker builder prune` в deploy.sh всё
    // равно регулярно его сбрасывал — выигрыша не было.
    turbopackFileSystemCacheForBuild: false,
    // Отдельный от Turbopack пул воркеров — для фазы статической
    // генерации страниц (после бандлинга). На 2 vCPU не даём Next
    // поднимать несколько параллельных воркер-процессов одновременно.
    cpus: 1,
    workerThreads: false,
    staticGenerationMaxConcurrency: 1,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: siteHostname },
      { protocol: "https", hostname: `www.${siteHostname}` },
      ...(process.env.NODE_ENV !== "production"
        ? [
            {
              protocol: "http",
              hostname: "localhost",
              port: "3000",
              pathname: "/api/media/**",
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.:ext(jpg|jpeg|png|webp|avif|svg|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
