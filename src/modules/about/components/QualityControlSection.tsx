"use client";

import { BadgeCheck, ClipboardCheck, Eye, ShieldCheck } from "lucide-react";
import Marquee from "react-fast-marquee";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { QualityCheckItem } from "@/modules/about/types";

const CHECK_ICONS = [ShieldCheck, Eye, ClipboardCheck, BadgeCheck] as const;

interface QualityControlSectionProps {
  heading?: string;
  subheading?: string;
  checks: QualityCheckItem[];
  brands: string[];
}

/**
 * Сплит-секция: слева — чек-лист этапов контроля (статичный, читаемый),
 * справа — бесконечная лента брендов плёнок (react-fast-marquee) поверх
 * статичного bento-грида тех же брендов (доступность, печать, reduced-motion).
 *
 * ВАЖНО про вёрстку: `[&>*]:min-w-0` на grid-контейнере и `min-w-0` на card
 * обязательны — без них любой "убегающий" по ширине контент внутри правой
 * колонки (в т.ч. лента) распирает grid-track и ломает горизонтальный
 * скролл всей страницы, т.к. grid/flex-элементы по умолчанию не сжимаются
 * ниже min-content своего содержимого.
 */
export function QualityControlSection({
  heading = "Контроль качества на каждом этапе",
  subheading = "Каждая партия дорожных знаков проходит визуальный и инструментальный контроль перед отгрузкой заказчику.",
  checks,
  brands,
}: QualityControlSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 [&>*]:min-w-0">
          <div className="flex flex-col">
            <Reveal translateY={16} fillWidth>
              <div className="flex flex-col">
                <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.08em] text-[var(--primary)]">
                  Контроль качества
                </span>
                <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">
                  {heading}
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
                  {subheading}
                </p>
              </div>
            </Reveal>

            <div className="mt-7 flex flex-col gap-4">
              {checks.map((check, index) => {
                const Icon = CHECK_ICONS[index % CHECK_ICONS.length];
                return (
                  <Reveal
                    key={check.title}
                    translateY={14}
                    fillWidth
                    delay={index * 0.08}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: "var(--success-light)" }}
                      >
                        <Icon
                          size={18}
                          strokeWidth={2}
                          color="var(--success)"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[var(--text-primary)]">
                          {check.title}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {check.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal translateY={18} fillWidth delay={0.15}>
            <div
              className="relative min-w-0 overflow-hidden p-8 md:p-10"
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
