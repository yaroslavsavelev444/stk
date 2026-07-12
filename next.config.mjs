import { withPayload } from "@payloadcms/next/withPayload";

const siteHostname = process.env.NEXT_PUBLIC_SITE_HOSTNAME || "stkaktiv.ru";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false, // не светим X-Powered-By: Next.js
  compress: true,
  turbopack: { root: process.cwd() },
  experimental: {
    // Кеш Turbopack на диске между сборками: пересчитываются только
    // изменившиеся модули, а не всё приложение с нуля. На маленьком VPS
    // (2 vCPU) это резко снижает CPU-нагрузку на КАЖДОМ деплое, кроме
    // самого первого — см. Dockerfile.yml, кеш примонтирован туда через
    // BuildKit `--mount=type=cache`, чтобы переживать пересборки образа.
    turbopackFileSystemCacheForBuild: true,
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
