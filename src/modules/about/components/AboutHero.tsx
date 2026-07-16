import Image from "next/image";
import { ImagePlaceholder } from "@/components/UI/ImagePlaceholder";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { AboutHeroContent } from "@/modules/about/types";
import { resolveMediaPath } from "@/utils/resolveMediaPath";

export function AboutHero({ hero }: { hero: AboutHeroContent }) {
  const imagePath = resolveMediaPath(hero.heroImage);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Reveal translateY={16} fillWidth>
        <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.08em] text-[var(--primary)]">
          {hero.eyebrow}
        </span>
      </Reveal>

      <Reveal translateY={16} fillWidth delay={0.08}>
        <h1 className="max-w-3xl text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.15] tracking-[-0.01em] text-[var(--text-primary)]">
          {hero.heading}
        </h1>
      </Reveal>

      <Reveal translateY={16} fillWidth delay={0.16}>
        <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-[var(--text-secondary)]">
          {hero.lead}
        </p>
      </Reveal>

      <Reveal translateY={20} fillWidth delay={0.24}>
        <div className="mt-8 md:mt-10">
          {imagePath ? (
            <div
              className="relative w-full overflow-hidden aspect-[16/7]"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <Image
                src={imagePath}
                alt={
                  (typeof hero.heroImage === "object" && hero.heroImage?.alt) ||
                  hero.heroImageAlt
                }
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <ImagePlaceholder alt={hero.heroImageAlt} aspect="aspect-[16/7]" />
          )}
        </div>
      </Reveal>
    </section>
  );
}
