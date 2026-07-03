import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { AboutStat } from "@/modules/about/types";

export function AboutStats({ stats }: { stats: AboutStat[] }) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <Reveal
            key={stat.label}
            translateY={12}
            fillWidth
            delay={index * 0.08}
          >
            <div
              className="flex h-full flex-col justify-center gap-1 p-5 md:p-6"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-none text-[var(--primary)]">
                {stat.value}
              </span>
              <span className="text-sm text-[var(--text-secondary)]">
                {stat.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
