"use client";

import Link from "next/link";
import { useState } from "react";

function ArrowDown() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 3.5V14.5M9 14.5L4 9.5M9 14.5L14 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.5 9H14.5M14.5 9L9.5 4M14.5 9L9.5 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroButtons() {
  const [hoverAbout, setHoverAbout] = useState(false);
  const [hoverCatalog, setHoverCatalog] = useState(false);

  const handleScrollDown = () => {
    const target = document.getElementById("main-content");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-row gap-3 flex-wrap justify-center">
      {/* Кнопка «О нас» — оранжевая */}
      <button
        onClick={handleScrollDown}
        onMouseEnter={() => setHoverAbout(true)}
        onMouseLeave={() => setHoverAbout(false)}
        className="
          group relative flex items-center justify-center gap-2
          px-7 py-3.5 rounded-none
          font-semibold text-base text-white
          transition-all duration-200 ease-out
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          overflow-hidden
        "
        style={{
          backgroundColor: "var(--accent)",
          minWidth: 160,
        }}
      >
        <span className="relative z-10 tracking-wide">О нас</span>

        {/* Стрелка — появляется при hover */}
        <span
          className="relative z-10 transition-all duration-200 ease-out"
          style={{
            opacity: hoverAbout ? 1 : 0,
            transform: hoverAbout
              ? "translateY(0) scale(1)"
              : "translateY(-6px) scale(0.7)",
          }}
        >
          <ArrowDown />
        </span>

        {/* hover overlay */}
        <span
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            backgroundColor: "rgba(0,0,0,0.12)",
            opacity: hoverAbout ? 1 : 0,
          }}
        />
      </button>

      {/* Кнопка «Каталог» — синяя */}
      <Link
        href="/catalog"
        onMouseEnter={() => setHoverCatalog(true)}
        onMouseLeave={() => setHoverCatalog(false)}
        className="
          group relative flex items-center justify-center gap-2
          px-7 py-3.5 rounded-none
          font-semibold text-base text-white
          transition-all duration-200 ease-out
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          overflow-hidden
          no-underline
        "
        style={{
          backgroundColor: "var(--primary)",
          minWidth: 160,
        }}
      >
        <span className="relative z-10 tracking-wide text-white">Каталог</span>

        {/* Стрелка — появляется при hover */}
        <span
          className="relative z-10 transition-all duration-200 ease-out"
          style={{
            opacity: hoverCatalog ? 1 : 0,
            transform: hoverCatalog
              ? "translateX(0) scale(1)"
              : "translateX(-6px) scale(0.7)",
          }}
        >
          <ArrowRight />
        </span>

        {/* hover overlay */}
        <span
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            backgroundColor: "rgba(0,0,0,0.12)",
            opacity: hoverCatalog ? 1 : 0,
          }}
        />
      </Link>
    </div>
  );
}
