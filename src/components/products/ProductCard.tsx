import Image from "next/image";
import Link from "next/link";
import type { Category, Media, Product } from "@/payload-types";
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

interface ProductPriceProps {
  price: number;
}

function ProductPrice({ price }: ProductPriceProps) {
  return <div className="product-price">{price.toLocaleString("ru-RU")} ₽</div>;
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
    <div className="product-image-wrap">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={altText}
          fill
          className="product-image"
          sizes={sizes}
          loading={loading}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PC9zdmc+"
        />
      ) : (
        <div className="product-image-placeholder">
          <span>Нет фото</span>
        </div>
      )}
      <ProductBadges badges={badges} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
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
  const mainImage = product.images?.[0];

  const media =
    typeof mainImage === "object" && mainImage !== null
      ? (mainImage as Media)
      : null;

  const imageUrl = media?.url
    ? new URL(media.url, "http://localhost").pathname
    : null;

  const altText = media?.alt || product.name || "Товар";

  const category = product.category as Category | string;
  const categorySlug = typeof category === "string" ? "" : category?.slug || "";

  const showPrice =
    product.showPrice && typeof product.price === "number" && product.price > 0;

  const badges: string[] = Array.isArray(product.badges) ? product.badges : [];

  return (
    <Link
      href={`/catalog/${categorySlug}/${product.slug}`}
      className={`product-card group ${className}`}
      aria-label={product.name}
    >
      <ProductImage
        imageUrl={imageUrl}
        altText={altText}
        sizes={sizes}
        loading={loading}
        badges={badges}
      />

      <div className="product-content">
        {/* Title — grows to fill available space, clamped to 3 lines */}
        <h3 className="product-name">{product.name}</h3>

        {/* Price pinned to bottom of content area */}
        <div className="product-footer">
          {showPrice ? (
            <ProductPrice price={product.price!} />
          ) : (
            <div className="product-price-empty" aria-hidden="true" />
          )}
        </div>
      </div>
    </Link>
  );
}
