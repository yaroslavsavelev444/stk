"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface AnimatedStatValueProps {
  value: string;
  durationMs?: number;
}

/**
 * Разбирает строку вида "200+", "9 лет", "100 000+" на числовую часть
 * и суффикс. Числовая часть анимируется count-up, суффикс выводится как есть
 * (пробел-разделитель сохраняется внутри суффикса автоматически).
 */
function parseStatValue(value: string): {
  number: number;
  suffix: string;
  hasNumber: boolean;
} {
  const match = value.match(/^([\d\s]*\d)(.*)$/);
  if (!match) return { number: 0, suffix: value, hasNumber: false };
  return {
    number: Number(match[1].replace(/\s/g, "")),
    suffix: match[2],
    hasNumber: true,
  };
}

/** Ease-out cubic — быстрый разгон, мягкое замедление к финальному значению. */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function AnimatedStatValue({
  value,
  durationMs = 1400,
}: AnimatedStatValueProps) {
  const { number, suffix, hasNumber } = parseStatValue(value);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || !hasNumber || startedRef.current) return;
    startedRef.current = true;

    let frameId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      setDisplay(Math.round(number * easeOutCubic(progress)));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, hasNumber, number, durationMs]);

  if (!hasNumber) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {display.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}
