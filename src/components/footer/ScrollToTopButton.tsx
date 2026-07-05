"use client";

import { IconButton } from "@once-ui-system/core";

/**
 * Единственный интерактивный элемент футера. Вынесен в отдельный
 * клиентский компонент-лист, чтобы сам Footer мог оставаться
 * асинхронным Server Component и получать данные (соглашения) на сервере.
 */
export function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
