// @modules/products/components/related-products.tsx
import { ProductsGrid } from "@/components/products/ProductsGrid"
import type { Product } from "@/payload-types"

type RelatedProductsProps = {
  product: Product
  countryCode?: string // оставил для совместимости, если где-то используется
}

export default async function RelatedProducts({
  product,
}: RelatedProductsProps) {
  // Показываем блок ТОЛЬКО если админ выбрал рекомендованные товары
  if (!product.recommendedProducts || product.recommendedProducts.length === 0) {
    return null
  }

  // Фильтруем на случай, если какие-то товары не опубликованы
  const recommended = product.recommendedProducts.filter((p: any) => 
    p && (typeof p === 'object' ? p.isPublished !== false : true)
  ) as Product[]

  if (recommended.length === 0) return null

  return (
    <div className="product-page-constraint my-16 lg:my-32">
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-sm uppercase tracking-widest text-gray-500 mb-3">
          Рекомендуем
        </span>
        <p className="text-2xl font-medium text-balance">
          Вам также может понравиться
        </p>
      </div>

      <ProductsGrid
        products={recommended}
        total={recommended.length}
        emptyMessage="Рекомендуемые товары не найдены"
      />
    </div>
  )
}