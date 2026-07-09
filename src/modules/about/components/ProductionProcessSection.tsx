import {
  CheckCircle2,
  Layers,
  PackageCheck,
  Scissors,
  Wrench,
} from "lucide-react";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { ProductionStep, ProductionStepIcon } from "@/modules/about/types";

const ICON_MAP: Record<ProductionStepIcon, typeof Scissors> = {
  cut: Scissors,
  apply: Layers,
  assemble: Wrench,
  inspect: CheckCircle2,
  pack: PackageCheck,
};

interface ProductionProcessSectionProps {
  heading?: string;
  subheading?: string;
  steps: ProductionStep[];
}

/**
 * Горизонтальный степпер производственного процесса. Пунктирная
 * соединительная линия + пронумерованные бейджи на иконках делают этапы
 * "процессом", а не карточками фактов — принципиально другой визуальный
 * язык по сравнению с AboutTimeline (история) и WhyUsSection (аргументы).
 */
export function ProductionProcessSection({
  heading = "Как рождается дорожный знак",
  subheading = "Пять этапов производства на одной площадке — от листа металла до готового изделия",
  steps,
}: ProductionProcessSectionProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center">
      <Reveal translateY={16} fillWidth>
        <div style={{ width: "100%" }}>
          <div className="mb-10 flex flex-col gap-2 text-center md:mb-14">
            <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)] text-center">
              {heading}
            </h2>
            <p className="mx-auto max-w-xl text-[var(--text-secondary)]">
              {subheading}
            </p>
          </div>
        </div>
      </Reveal>

      <div className="relative">
        {/* Пунктирная линия-связка — только на десктопе, проходит через центр иконок */}
        <div
          className="pointer-events-none absolute left-[10%] right-[10%] top-[26px] hidden md:block"
          style={{
            height: 2,
            background:
              "repeating-linear-gradient(to right, var(--border) 0, var(--border) 8px, transparent 8px, transparent 16px)",
          }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-4">
          {steps.map((step, index) => {
            const Icon = ICON_MAP[step.icon];
            return (
              <Reveal
                key={step.title}
                translateY={20}
                fillWidth
                delay={index * 0.1}
              >
                <div className="flex flex-col items-center gap-3 text-center md:gap-4">
                  <div
                    className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: "var(--background)",
                      border: "2px solid var(--primary)",
                    }}
                  >
                    <Icon size={22} strokeWidth={2} color="var(--primary)" />
                    <span
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: "var(--accent)" }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
