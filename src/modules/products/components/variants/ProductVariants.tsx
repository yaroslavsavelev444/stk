"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildCombinationKey,
  minCombinationPrice,
  type NormalizedGroup,
  type VariantSelection,
} from "@/payload/variants/logic";
import type { Product } from "@/payload-types";
import { VariantOptionGroup } from "./VariantOptionGroup";

interface ProductVariantsProps {
  product: Product;
}

// ─── Адаптер payload → нормализованные группы (коды уже проставлены хуком) ──

function toNormalizedGroups(product: Product): NormalizedGroup[] {
  const groups = Array.isArray(product.variantGroups)
    ? product.variantGroups
    : [];
  return groups
    .map((g) => ({
      label: g.label ?? "",
      code: g.code ?? "",
      displayType: (g.displayType === "dropdown" ? "dropdown" : "list") as
        | "dropdown"
        | "list",
      values: (Array.isArray(g.values) ? g.values : [])
        .filter((v) => v?.code)
        .map((v) => ({ label: v.label ?? "", code: v.code as string })),
    }))
    .filter((g) => g.code && g.values.length > 0);
}

function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

// ─── Значения по умолчанию / из URL ────────────────────────────────────────

function defaultSelection(groups: NormalizedGroup[]): VariantSelection {
  const sel: VariantSelection = {};
  for (const g of groups) {
    if (g.values[0]) sel[g.code] = g.values[0].code;
  }
  return sel;
}

/** Применяет валидные параметры URL поверх дефолта; некорректные игнорирует. */
function selectionFromParams(
  groups: NormalizedGroup[],
  params: URLSearchParams,
): VariantSelection {
  const sel = defaultSelection(groups);
  for (const g of groups) {
    const raw = params.get(g.code);
    if (raw && g.values.some((v) => v.code === raw)) {
      sel[g.code] = raw;
    }
  }
  return sel;
}

export default function ProductVariants({ product }: ProductVariantsProps) {
  const groups = useMemo(() => toNormalizedGroups(product), [product]);
  const combinations = useMemo(
    () =>
      Array.isArray(product.variantCombinations)
        ? product.variantCombinations
        : [],
    [product],
  );

  const priceByKey = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of combinations) {
      if (c?.key && typeof c.price === "number" && c.price > 0) {
        map.set(c.key, c.price);
      }
    }
    return map;
  }, [combinations]);

  // SSR: дефолт. На маунте применяем параметры URL (без flash дольше кадра).
  const [selection, setSelection] = useState<VariantSelection>(() =>
    defaultSelection(groups),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setSelection(selectionFromParams(groups, params));
    // groups стабильны для данного товара
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Синхронизация выбора → URL (shareable, без перезагрузки и без скролла).
  const syncUrl = useCallback(
    (sel: VariantSelection) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      for (const g of groups) {
        if (sel[g.code]) params.set(g.code, sel[g.code]);
        else params.delete(g.code);
      }
      const query = params.toString();
      const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
      window.history.replaceState(null, "", url);
    },
    [groups],
  );

  const handleSelect = useCallback(
    (groupCode: string, valueCode: string) => {
      setSelection((prev) => {
        const next = { ...prev, [groupCode]: valueCode };
        syncUrl(next);
        return next;
      });
    },
    [syncUrl],
  );

  // Текущая цена по выбранной комбинации.
  const currentKey = buildCombinationKey(groups, selection);
  const currentPrice = currentKey ? (priceByKey.get(currentKey) ?? null) : null;
  const minPrice = useMemo(
    () => minCombinationPrice(combinations),
    [combinations],
  );

  if (groups.length === 0) return null;

  const showPrice = product.showPrice !== false;

  return (
    <div className="product-variants">
      {showPrice && (
        <div className="product-variants__price" aria-live="polite">
          {currentPrice !== null ? (
            <span className="product-variants__price-value">
              {formatPrice(currentPrice)}
            </span>
          ) : minPrice !== null ? (
            <span className="product-variants__price-value">
              от {formatPrice(minPrice)}
            </span>
          ) : (
            <span className="product-variants__price-muted">
              Цена по запросу
            </span>
          )}
        </div>
      )}

      <div className="product-variants__groups">
        {groups.map((group, gi) => {
          const options = group.values.map((value) => {
            // Опция доступна, если существует оцененная комбинация при текущем
            // выборе остальных групп и этом значении.
            const candidate: VariantSelection = {
              ...selection,
              [group.code]: value.code,
            };
            const key = buildCombinationKey(groups, candidate);
            const available = key ? priceByKey.has(key) : false;
            return {
              label: value.label,
              code: value.code,
              // Не дизейблим, если цен вообще нет (черновик) — иначе всё серое.
              disabled: priceByKey.size > 0 && !available,
            };
          });

          return (
            <VariantOptionGroup
              key={group.code}
              groupId={`variant-${gi}`}
              label={group.label}
              displayType={group.displayType}
              options={options}
              selectedCode={selection[group.code] ?? null}
              onSelect={(code) => handleSelect(group.code, code)}
            />
          );
        })}
      </div>

      <style>{`
        .product-variants {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
        }
        .product-variants__price {
          min-height: 2rem;
          display: flex;
          align-items: baseline;
        }
        .product-variants__price-value {
          font-size: clamp(1.5rem, 4vw, 1.875rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }
        .product-variants__price-muted {
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .product-variants__groups {
          display: flex;
          flex-direction: column;
          gap: 1.125rem;
        }
      `}</style>
    </div>
  );
}
