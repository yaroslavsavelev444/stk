"use client";

import { ReactLenis } from "lenis/react";
import { PropsWithChildren } from "react";

export default function LenisProvider({ children }: PropsWithChildren) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.35,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false, // ← было smoothTouch, теперь syncTouch
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        autoRaf: true,
        anchors: true,
        allowNestedScroll: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
