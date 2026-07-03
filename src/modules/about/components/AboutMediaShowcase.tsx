import { ImagePlaceholder } from "@/components/UI/ImagePlaceholder";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { AboutMediaBlock } from "@/modules/about/types";

interface AboutMediaShowcaseProps {
  block: AboutMediaBlock;
  reverse?: boolean;
}

export function AboutMediaShowcase({
  block,
  reverse = false,
}: AboutMediaShowcaseProps) {
  const gridColsClass =
    block.images.length === 1
      ? "grid-cols-1"
      : block.images.length === 2
        ? "grid-cols-2"
        : "grid-cols-2 md:grid-cols-3";

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal translateY={18} fillWidth>
          <div className="flex flex-col gap-4">
            {block.eyebrow && (
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--primary)]">
                {block.eyebrow}
              </span>
            )}
            <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold leading-snug text-[var(--text-primary)]">
              {block.heading}
            </h2>
            {block.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]"
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <div className={`grid ${gridColsClass} gap-4 w-full`}>
          {block.images.map((img, i) => (
            <Reveal key={i} translateY={18} fillWidth delay={0.12 + i * 0.06}>
              <div className="w-full">
                <ImagePlaceholder alt={img.alt} aspect="aspect-[3/4]" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
