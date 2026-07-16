import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "СТК-Актив — производство дорожных знаков",
    short_name: "СТК-Актив",
    description:
      "Производство дорожных знаков полного цикла по ГОСТ Р 52290-2004",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#2E2D8F",
    lang: "ru",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
