"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Отслеживает системную настройку "уменьшить анимацию" в реальном времени —
 * пользователь может переключить её в системных настройках без перезагрузки
 * вкладки. На сервере/до гидратации возвращает `false`: анимация в этом
 * случае на мгновение включится и тут же остановится, а не наоборот —
 * это безопасно и не вызывает сдвигов вёрстки (CLS).
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    setPrefersReducedMotion(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
