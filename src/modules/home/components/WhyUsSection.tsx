import { Award, Factory, Route, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { WhyUsIconKey, WhyUsItem } from "../types";

const ICON_MAP: Record<WhyUsIconKey, typeof Factory> = {
  factory: Factory,
  shield: ShieldCheck,
  certificate: Award,
  route: Route,
};

interface WhyUsSectionProps {
  heading?: string;
  subheading?: string;
  items: WhyUsItem[];
}

/**
 * Bento-грид преимуществ: первая карточка — "hero" (2 колонки, акцентный
 * градиент), остальные — компактные нейтральные. Такая асимметрия читается
 * как "главный аргумент + поддерживающие", а не как ровный список.
 */
export function WhyUsSection({
  heading = "Почему выбирают СТК-Актив",
  subheading = "Четыре причины доверить нам производство и поставку дорожных знаков",
  items,
}: WhyUsSectionProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Reveal translateY={16} fillWidth>
        <div className="mb-8 flex flex-col gap-2 text-center md:mb-10">
          <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">
            {heading}
          </h2>
          <p className="mx-auto max-w-xl text-[var(--text-secondary)]">
            {subheading}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
        {items.map((item, index) => {
          const Icon = ICON_MAP[item.icon];
          const isHero = index === 0;

          return (
            <div
              key={item.title}
              className={isHero ? "md:col-span-2 md:row-span-2" : undefined}
            >
              <Reveal translateY={18} fillWidth delay={index * 0.08}>
                <div
                  className="group relative flex h-full flex-col justify-between gap-5 overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 md:p-7"
                  style={{
                    background: isHero
                      ? "linear-gradient(150deg, var(--primary) 0%, var(--primary-700, var(--primary-hover)) 100%)"
                      : "var(--surface)",
                    border: isHero ? "none" : "1px solid var(--border)",
                    borderRadius: "var(--radius-xl)",
                    color: isHero
                      ? "var(--text-inverse)"
                      : "var(--text-primary)",
                    boxShadow: isHero
                      ? "0 12px 32px var(--shadow-color)"
                      : "none",
                  }}
                >
                  {/* Декоративный акцентный круг — усиливается на hover */}
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-125"
                    style={{ background: isHero ? "#fff" : "var(--primary)" }}
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex flex-col gap-4">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{
                        background: isHero
                          ? "rgba(255,255,255,0.16)"
                          : "var(--primary-light)",
                      }}
                    >
                      <Icon
                        size={22}
                        strokeWidth={2}
                        color={isHero ? "#fff" : "var(--primary)"}
                      />
                    </div>

                    <h3
                      className={
                        isHero
                          ? "text-xl font-bold leading-snug md:text-2xl"
                          : "text-base font-bold leading-snug"
                      }
                    >
                      {item.title}
                    </h3>

                    <p
                      className={
                        isHero
                          ? "text-[15px] leading-relaxed opacity-90"
                          : "text-sm leading-relaxed"
                      }
                      style={{
                        color: isHero ? undefined : "var(--text-secondary)",
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
