import { Column, Text } from "@once-ui-system/core";
import type { Product } from "@/payload-types";
import { ProductCard } from "./ProductCard";

interface ProductsGridProps {
  products: Product[];
  total: number;
  emptyMessage?: string;
}

export function ProductsGrid({
  products,
  total,
  emptyMessage = "Товары не найдены",
}: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <Column fillWidth paddingY="32" horizontal="center">
        <Text variant="heading-default-xl" onBackground="neutral-weak">
          {emptyMessage}
        </Text>
      </Column>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4 pb-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
