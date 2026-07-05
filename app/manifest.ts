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
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
