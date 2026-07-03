import { Carousel, CarouselSlide } from "@/components/UI/Carousel";
import { ImagePlaceholder } from "@/components/UI/ImagePlaceholder";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { AboutCertificateItem } from "@/modules/about/types";

interface AboutCertificatesProps {
  heading: string;
  subheading: string;
  items: AboutCertificateItem[];
}

export function AboutCertificates({
  heading,
  subheading,
  items,
}: AboutCertificatesProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Reveal translateY={16} fillWidth>
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">
            {heading}
          </h2>
          <p className="max-w-xl text-[var(--text-secondary)]">{subheading}</p>
        </div>
      </Reveal>

      <Carousel
        showArrows
        showDots
        loop={false}
        containerClassName="flex gap-4"
        viewportClassName="-mx-4 px-4 sm:mx-0 sm:px-0"
        className="pb-2"
      >
        {items.map((cert, index) => (
          <CarouselSlide
            key={`${cert.title}-${cert.issuer}`}
            className="w-[220px]"
          >
            <Reveal translateY={16} fillWidth delay={index * 0.05}>
              <ImagePlaceholder alt={cert.title} aspect="aspect-[3/4]" />
            </Reveal>
          </CarouselSlide>
        ))}
      </Carousel>
    </section>
  );
}
