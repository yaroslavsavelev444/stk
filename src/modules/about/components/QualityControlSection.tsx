"use client";

import { BadgeCheck, ClipboardCheck, Eye, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { QualityCheckItem } from "@/modules/about/types";

const CHECK_ICONS = [ShieldCheck, Eye, ClipboardCheck, BadgeCheck] as const;

interface QualityControlSectionProps {
  heading?: string;
  subheading?: string;
  checks: QualityCheckItem[];
}

/**
 * Чек-лист этапов контроля качества. Правая колонка с брендами плёнок
 * (marquee) переехала в AboutStandards — под карточки материалов, поэтому
 * здесь остаётся только один столбец.
 */
export function QualityControlSection({
  heading = "Контроль качества на каждом этапе",
  subheading = "Каждая партия дорожных знаков проходит визуальный и инструментальный контроль перед отгрузкой заказчику.",
  checks,
}: QualityControlSectionProps) {
  return (
    <section className="w-full min-w-0">
      <div className="w-full min-w-0">
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
                    <Icon size={18} strokeWidth={2} color="var(--success)" />
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
    </section>
  );
}
