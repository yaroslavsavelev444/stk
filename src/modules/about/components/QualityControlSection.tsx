import { BadgeCheck, ClipboardCheck, Eye, ShieldCheck } from "lucide-react";
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
 * справа — карточка с бесконечной CSS-marquee лентой брендов плёнок поверх
 * статичного bento-грида тех же брендов (для доступности и печати/reduced-motion).
 * Единственный анимированный "живой" блок на странице — намеренный акцент.
 */
export function QualityControlSection({
  heading = "Контроль качества на каждом этапе",
  subheading = "Каждая партия дорожных знаков проходит визуальный и инструментальный контроль перед отгрузкой заказчику.",
  checks,
  brands,
}: QualityControlSectionProps) {
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <section className="w-full">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <Reveal translateY={16} fillWidth>
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.08em] text-[var(--primary)]">
                Контроль качества
              </span>
              <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">
                {heading}
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
                {subheading}
              </p>
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
                      <div>
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
              className="relative overflow-hidden p-8 md:p-10"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
              }}
            >
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                Работаем с сертифицированными плёнками
              </p>

              <div className="quality-marquee-mask">
                <div className="quality-marquee-track">
                  {marqueeBrands.map((brand, index) => (
                    <span
                      key={`${brand}-${index}`}
                      className="quality-brand-pill"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
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
        .quality-marquee-track {
          display: flex;
          width: max-content;
          gap: 0.75rem;
          animation: quality-marquee-scroll 18s linear infinite;
        }
        .quality-brand-pill {
          flex-shrink: 0;
          padding: 0.5rem 1.1rem;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 700;
          white-space: nowrap;
          color: var(--text-secondary);
          background: var(--surface-secondary);
          border: 1px solid var(--border);
        }
        @keyframes quality-marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .quality-marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
