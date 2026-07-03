"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroBackground.module.scss";

export function HeroBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div ref={bgRef} className={styles.bg} />
    </div>
  );
}
