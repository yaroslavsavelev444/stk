import type { Media, Setting } from "@/payload-types";

export type HeroBackgroundSetting = Setting["heroBackground"];

function toPath(media?: (string | null) | Media): string | null {
  if (!media || typeof media === "string" || !media.url) return null;
  try {
    return new URL(media.url).pathname;
  } catch {
    return media.url;
  }
}

export function resolveHeroMedia(heroBackground: HeroBackgroundSetting) {
  const type = heroBackground?.type;
  const imageUrl = type === "image" ? toPath(heroBackground?.image) : null;
  const videoUrl = type === "video" ? toPath(heroBackground?.video) : null;
  const posterUrl = type === "video" ? toPath(heroBackground?.videoPoster) : null;

  return {
    imageUrl,
    videoUrl,
    posterUrl,
    hasMedia: Boolean(imageUrl || videoUrl),
  };
}
