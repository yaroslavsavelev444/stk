"use client";

import Marquee from "react-fast-marquee";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { AboutStandardsContent } from "@/modules/about/types";

export function AboutStandards({
  standards,
}: {
  standards: AboutStandardsContent;
}) {
  console.log("AboutStandards props:", standards);

  const prefersReducedMotion = usePrefersReducedMotion();
  const brands = standards.filmBrands;

  return (
    <section className="w-full min-w-0 overflow-x-clip">
      <div className="w-full min-w-0">
        <div className="flex flex-col gap-3">
          {standards.materials.map((m, i) => (
            <Reveal
              key={m.title}
              translateY={16}
              fillWidth
              delay={0.1 + i * 0.06}
            >
              <div
                className="p-4 md:p-5"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {m.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {m.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal translateY={18} fillWidth delay={0.15}>
          <div
            className="relative mt-6 min-w-0 overflow-hidden p-8 md:p-10"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Работаем с сертифицированными плёнками
            </p>

            <div className="quality-marquee-mask min-w-0">
              <Marquee
                play={!prefersReducedMotion}
                pauseOnHover
                autoFill
                speed={36}
                gradient={false}
              >
                {brands.map((brand) => (
                  <span key={brand} className="quality-brand-pill">
                    {brand}
                  </span>
                ))}
              </Marquee>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center justify-center rounded-lg py-3 text-sm font-bold"
                  style={{
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                  }}
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .quality-marquee-mask {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
          mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
        }
        .quality-brand-pill {
          display: inline-flex;
          margin-right: 0.75rem;
          padding: 0.5rem 1.1rem;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 700;
          white-space: nowrap;
          color: var(--text-secondary);
          background: var(--surface-secondary);
          border: 1px solid var(--border);
        }
      `}</style>
    </section>
  );
}
