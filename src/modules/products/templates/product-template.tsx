import { notFound } from "next/navigation";
import React from "react";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/UI/Breadcrumbs/Breadcrumbs";
import type { Product } from "@/payload-types";

import ImageGallery from "../components/image-gallery";
import ProductActions from "../components/product-actions";
import ProductInfo from "./product-info";
import RelatedProducts from "./related-products";

type ProductTemplateProps = {
  product: Product;
  breadcrumbItems: BreadcrumbItem[];
};

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  breadcrumbItems,
}) => {
  if (!product || !product.id) {
    return notFound();
  }

  return (
    <main className="product-page" data-product-id={product.id}>
      {/* Хлебные крошки */}
      <div className="product-page__breadcrumbs">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Основная сетка товара */}
      <section className="product-grid" aria-label={`Товар: ${product.name}`}>
        <aside className="product-col product-col--info">
          <ProductInfo product={product} />
        </aside>

        <div className="product-col product-col--gallery">
          <ImageGallery product={product} />
        </div>

        <aside className="product-col product-col--actions">
          <ProductActions product={product} />
        </aside>
      </section>

      {/* Блок рекомендованных — только если выбраны админом */}
      <RelatedProducts product={product} />

      <style>{`
        .product-page {
          --col-gap: clamp(1.5rem, 3vw, 2.5rem);
          min-height: 80vh;
        }
        .product-page__breadcrumbs {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem clamp(1rem, 4vw, 2rem) 0;
        }
        .product-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--col-gap);
          max-width: 1400px;
          margin: 0 auto;
          padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem);
        }
        @media (min-width: 768px) {
          .product-grid {
            grid-template-columns: 280px 1fr;
            grid-template-areas:
              "info gallery"
              "tabs gallery"
              ". actions";
          }
          .product-col--info { grid-area: info; }
          .product-col--gallery { grid-area: gallery; }
          .product-col--actions { grid-area: actions; }
        }
        @media (min-width: 1100px) {
          .product-grid {
            grid-template-columns: 300px 1fr 300px;
            grid-template-rows: auto 1fr;
            grid-template-areas:
              "info gallery actions"
              "tabs gallery .";
          }
        }
        .product-col--info,
        .product-col--actions {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .product-col--info,
          .product-col--actions {
            position: sticky;
            top: 5rem;
            align-self: start;
            max-height: calc(100vh - 6rem);
            overflow-y: auto;
          }
        }
      `}</style>
    </main>
  );
};

export default ProductTemplate;
