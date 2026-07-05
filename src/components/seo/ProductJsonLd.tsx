import type { Category, Media, Product } from "@/payload-types";

export function ProductJsonLd({
  product,
  siteUrl,
}: {
  product: Product;
  siteUrl: string;
}) {
  const category =
    typeof product.category === "object"
      ? (product.category as Category)
      : null;
  const images = (product.images ?? [])
    .filter(
      (img): img is Media =>
        typeof img === "object" && img !== null && Boolean(img.url),
    )
    .map((img) => `${siteUrl}${img.url}`);

  const canonicalUrl = `${siteUrl}/catalog/${category?.slug ?? ""}/${product.slug}`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images,
    category: category?.name,
    url: canonicalUrl,
  };

  if (
    product.showPrice &&
    typeof product.price === "number" &&
    product.price > 0
  ) {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
