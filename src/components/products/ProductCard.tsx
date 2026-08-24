import Image from "next/image";
import Link from "next/link";
import type { CatalogCardProduct } from "@/services/catalog/types";
import "./ProductCard.css";

// ─── Badge configuration ─────────────────────────────────────────────────────

type BadgeValue = "new" | "hit" | "sale" | "gost";

const BADGE_CONFIG: Record<BadgeValue, { label: string; className: string }> = {
  new: { label: "Новинка", className: "badge-new" },
  hit: { label: "Хит", className: "badge-hit" },
  sale: { label: "Акция", className: "badge-sale" },
  gost: { label: "ГОСТ", className: "badge-gost" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ProductBadgesProps {
  badges: string[];
}

function ProductBadges({ badges }: ProductBadgesProps) {
  if (!badges.length) return null;
  return (
    <div className="product-badges">
      {badges.map((badge) => {
        const config = BADGE_CONFIG[badge as BadgeValue];
        if (!config) return null;
        return (
          <span key={badge} className={`product-badge ${config.className}`}>
            {config.label}
          </span>
        );
      })}
    </div>
  );
}

interface ProductImageProps {
  imageUrl: string | null;
  altText: string;
  sizes: string;
  loading: "lazy" | "eager";
  badges: string[];
}

function ProductImage({
  imageUrl,
  altText,
  sizes,
  loading,
  badges,
}: ProductImageProps) {
  return (
    <div className="product-stage">
      <div className="product-stage__surface" aria-hidden="true" />
      <div className="product-image-wrap">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="product-image"
            sizes={sizes}
            loading={loading}
          />
        ) : (
          <div className="product-image-placeholder">
            <span>Нет фото</span>
          </div>
        )}
      </div>
      <ProductBadges badges={badges} />
    </div>
  );
}

/** Диагональная стрелка «перейти» — намекает на клик по карточке. */
function GoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProductCardProps {
  /**
   * Урезанная проекция товара, а не документ Payload целиком: карточке нужны
   * восемь полей, а полный товар везёт характеристики, варианты, документы и
   * seo — на длинной странице каталога это мегабайты вместо килобайтов.
   */
  product: CatalogCardProduct;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
}

export function ProductCard({
  product,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  loading = "lazy",
}: ProductCardProps) {
  const showPrice =
    product.showPrice && typeof product.price === "number" && product.price > 0;

  return (
    <Link
      href={`/catalog/${product.categorySlug}/${product.slug}`}
      className={`product-card group ${className}`}
      aria-label={product.name}
    >
      <ProductImage
        imageUrl={product.image?.url ?? null}
        altText={product.image?.alt || product.name || "Товар"}
        sizes={sizes}
        loading={loading}
        badges={product.badges}
      />

      <div className="product-body">
        <div className="product-text">
          <h3 className="product-name">{product.name}</h3>
          {product.description ? (
            <p className="product-description">{product.description}</p>
          ) : null}
        </div>

        <div className="product-footer">
          {showPrice ? (
            <span className="product-price">
              {product.priceFrom ? (
                <span className="product-price-from">от </span>
              ) : null}
              {product.price!.toLocaleString("ru-RU")} ₽
            </span>
          ) : (
            <span className="product-price-empty">Подробнее</span>
          )}

          <span className="product-cta" aria-hidden="true">
            <GoIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}
