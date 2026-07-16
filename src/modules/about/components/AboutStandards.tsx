import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { AboutStandardsContent } from "@/modules/about/types";

export function AboutStandards({
  standards,
}: {
  standards: AboutStandardsContent;
}) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12">
        <div className="flex flex-col gap-4">
          <Reveal translateY={16} fillWidth>
            <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">
              {standards.heading}
            </h2>
          </Reveal>
          {standards.paragraphs.map((p, i) => (
            <Reveal key={i} translateY={12} fillWidth delay={0.1 + i * 0.05}>
              <p className="text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
                {p}
              </p>
            </Reveal>
          ))}
          <div className="mt-2 flex flex-wrap gap-2">
            {standards.filmBrands.map((brand, i) => (
              <Reveal key={brand} translateY={12} delay={0.2 + i * 0.04}>
                <span
                  className="rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={{
                    background: "var(--surface-secondary)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {brand}
                </span>
              </Reveal>
            ))}
          </div>
        </div>

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
      </div>
    </section>
  );
}
