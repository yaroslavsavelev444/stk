import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { HomeFeatureCard } from "@/services/payload/content";
import { getHomeFeatureCards } from "@/services/payload/content";
import { resolveMediaPath } from "@/utils/resolveMediaPath";

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5"
      aria-hidden="true"
    >
      <path
        d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureCard({ card }: { card: HomeFeatureCard }) {
  const imagePath = resolveMediaPath(card.image);
  const alt = (typeof card.image === "object" && card.image?.alt) || card.title;
  const isExternal = card.link?.type === "external";
  const href = card.link?.url || "#";

  const button = (
    <span
      className="group/btn inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
      style={{ background: "var(--primary-light)", color: "var(--primary)" }}
    >
      {card.buttonText}
      <ArrowIcon />
    </span>
  );

  return (
    <div
      className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
      }}
    >
      <div
        className="relative aspect-[4/3] w-full shrink-0 overflow-hidden"
        style={{ background: "var(--surface-secondary)" }}
      >
        {imagePath && (
          <Image
            src={imagePath}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-contain p-6 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6 md:p-7">
        <h3
          className="text-lg font-bold leading-snug text-[var(--text-primary)]"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            // Резервируем высоту под 2 строки (leading-snug = 1.375), чтобы
            // короткий заголовок не делал карточку ниже соседних.
            minHeight: "2.75em",
          }}
        >
          {card.title}
        </h3>
        <p
          className="text-sm leading-relaxed text-[var(--text-secondary)]"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            // Резервируем высоту под 3 строки (leading-relaxed = 1.625) —
            // та же логика, что и для заголовка выше.
            minHeight: "4.875em",
          }}
        >
          {card.description}
        </p>

        <div className="mt-4 pt-1">
          {isExternal ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)] rounded-full"
            >
              {button}
            </a>
          ) : (
            <Link
              href={href}
              className="no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)] rounded-full"
            >
              {button}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Блок карточек перед "Почему выбирают СТК-Актив" — полностью управляется
 * из админки (home-content -> featureCards). Если карточек нет — блок не
 * рендерится (тот же паттерн "нет данных — нет секции", что и у CertificatesSection).
 */
export async function FeatureCards() {
  const cards = await getHomeFeatureCards();
  if (cards.length === 0) return null;

  return (
    // Внешний Reveal — внутри условия на пустые данные, иначе пустая
    // обёртка всё равно становится flex-элементом родительского списка
    // секций и добавляет лишний gap до и после себя.
    <Reveal translateY={16} fillWidth>
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
          {cards.map((card, index) => (
            <Reveal
              key={card.id ?? index}
              translateY={18}
              fillWidth
              delay={index * 0.08}
            >
              <FeatureCard card={card} />
            </Reveal>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
