import Image from "next/image";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { AboutGeographyContent, AboutRouteItem } from "@/modules/about/types";
import { resolveMediaPath } from "@/utils/resolveMediaPath";

const DEFAULT_MAP_IMAGE = "/images/about/delivery-map.jpg";

interface GeographySectionProps {
  heading: string;
  subheading: string;
  regionsCount: string;
  routes: AboutRouteItem[];
  image?: AboutGeographyContent["image"];
}

export function GeographySection({
  heading,
  subheading,
  regionsCount,
  routes,
  image,
}: GeographySectionProps) {
  const mapImageUrl = resolveMediaPath(image) || DEFAULT_MAP_IMAGE;
  const mapImageAlt =
    (typeof image === "object" && image?.alt) ||
    "Карта регионов поставки дорожных знаков СТК-Актив по России";

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <Reveal translateY={16} fillWidth>
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--primary)]">
              География поставок
            </span>
            <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">
              {heading}
            </h2>
            <p className="text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
              {subheading}
            </p>

            <div
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2"
              style={{ background: "var(--primary-light)" }}
            >
              <span className="text-2xl font-extrabold text-[var(--primary)]">
                {regionsCount}
              </span>
              <span className="text-sm text-[var(--text-secondary)]">
                регионов РФ и стран ближнего зарубежья
              </span>
            </div>

            <ul className="mt-4 flex flex-col gap-3">
              {routes.map((route) => (
                <li
                  key={route.name}
                  className="flex flex-col gap-0.5 border-l-2 pl-4"
                  style={{ borderColor: "var(--primary-200)" }}
                >
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {route.name}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {route.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal translateY={20} fillWidth delay={0.15}>
          <div
            className="relative w-full overflow-hidden"
            style={{
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <Image
              src={mapImageUrl}
              alt={mapImageAlt}
              width={1024}
              height={640}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
