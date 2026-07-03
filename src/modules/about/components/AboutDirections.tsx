import Link from "next/link";
import { ImagePlaceholder } from "@/components/UI/ImagePlaceholder";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { AboutDirectionItem } from "@/modules/about/types";

export function AboutDirections({
  heading,
  items,
}: {
  heading: string;
  items: AboutDirectionItem[];
}) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Reveal translateY={16} fillWidth>
        <h2 className="mb-8 text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">
          {heading}
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {items.map((item, index) => (
          <Reveal
            key={item.title}
            translateY={16}
            fillWidth
            delay={index * 0.06}
          >
            <div className="w-full">
              <Link
                href={item.href}
                className="group relative block overflow-hidden"
                style={{
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border)",
                }}
              >
                <ImagePlaceholder
                  alt={item.title}
                  aspect="aspect-[4/5]"
                  rounded="0"
                  className="transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="sr-only">{item.description}</span>
                <div
                  className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3.5"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
                  }}
                >
                  <span className="text-sm font-semibold text-white">
                    {item.title}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 12L12 4M12 4H5M12 4V11"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
