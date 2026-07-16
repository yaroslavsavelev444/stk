"use client";

import { IconButton } from "@once-ui-system/core";
import { useLenis } from "lenis/react";

/**
 * Единственный интерактивный элемент футера. Вынесен в отдельный
 * клиентский компонент-лист, чтобы сам Footer мог оставаться
 * асинхронным Server Component и получать данные (соглашения) на сервере.
 */
export function ScrollToTopButton() {
  const lenis = useLenis();

  const scrollToTop = () => {
    // Через инстанс Lenis, а не window.scrollTo — иначе нативный smooth-scroll
    // конфликтует с Lenis и прокрутка «дёргается». Фолбэк — на случай, если
    // Lenis ещё не инициализирован.
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <IconButton
      icon="chevron-up"
      size="m"
      variant="secondary"
      onClick={scrollToTop}
      aria-label="Наверх"
    />
  );
}
