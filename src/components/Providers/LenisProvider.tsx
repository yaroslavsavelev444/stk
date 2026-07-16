"use client";

import { ReactLenis } from "lenis/react";
import { PropsWithChildren } from "react";

export default function LenisProvider({ children }: PropsWithChildren) {
  return (
    <ReactLenis
      root
      options={{
        // lerp-сглаживание (frame-rate independent damping) вместо duration+easing:
        // отзывчивее и не «залипает» при быстрых флик-жестах. Чем выше — тем снапнее.
        lerp: 0.12,
        smoothWheel: true,
        // На тач-устройствах оставляем нативный скролл — он быстрее и надёжнее,
        // чем эмуляция Lenis (та ощущается лагающей на мобильных).
        syncTouch: false,
        // Чуть больше хода на «щелчок» колеса — скролл ощущается живее.
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
        overscroll: true,
        autoRaf: true,
        anchors: true,
        // Позволяет корректно скроллить вложенные области (sticky-панель товара,
        // список в модалке поиска), не блокируя их глобальным скроллом.
        allowNestedScroll: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
