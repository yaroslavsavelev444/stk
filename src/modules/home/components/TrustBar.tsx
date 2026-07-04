import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { TrustStat } from "../types";
import { AnimatedStatValue } from "./AnimatedStatValue";

interface TrustBarProps {
  stats: TrustStat[];
}

/**
 * Контрастная full-bleed полоса доверия. Ставится между эмоциональным интро
 * и рациональными разделами (преимущества/каталог), чтобы "закрепить"
 * первое впечатление цифрами до того, как пользователь пойдёт дальше.
 */
export function TrustBar({ stats }: TrustBarProps) {
  return (
    <section
      className="w-full"
      style={{
        background:
          "linear-gradient(120deg, var(--primary-700, var(--primary-hover)) 0%, var(--primary) 55%, var(--primary-700, var(--primary-hover)) 100%)",
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-0 md:divide-x md:divide-white/15">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              translateY={14}
              fillWidth
              delay={index * 0.08}
            >
              <div className="flex flex-col items-center text-center gap-1.5 md:px-6">
                <span className="text-[clamp(1.875rem,4.2vw,2.75rem)] font-extrabold leading-none text-white tabular-nums">
                  <AnimatedStatValue value={stat.value} />
                </span>
                <span className="max-w-[160px] text-[13px] leading-snug text-white/70 md:text-sm">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
