import {
  Heading,
  Text,
  Column,
  Schema,
  Meta,
} from "@once-ui-system/core";
import { baseURL } from "@/resources/content";
import { CategoriesGrid } from "@/components/categories";
import { CallbackSection } from "@/components/callback-form/CallbackSection";
import { AutoBreadcrumbs } from "@/components/UI/Breadcrumbs/AutoBreadcrumbs";

export async function generateMetadata() {
  return Meta.generate({
    title: "Каталог",
    description: "Полный каталог товаров и услуг. Все категории в удобном виде.",
    baseURL: baseURL,
    path: "/catalog",
    image: "/og/catalog.jpg", // можно поменять на нужное изображение
  });
}

export default function CatalogPage() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/catalog"
        title="Каталог"
        description="Полный каталог товаров и услуг"
        image={`/api/og/generate?title=${encodeURIComponent("Каталог")}`}
      />
        <AutoBreadcrumbs />
      {/* Заголовок страницы */}
      <Column fillWidth horizontal="center" gap="m" paddingTop="8">
        <Column maxWidth="s" horizontal="center" align="center">
          <Heading wrap="balance" variant="display-strong-l" as="h1">
            Каталог
          </Heading>
          <Text
            wrap="balance"
            onBackground="neutral-weak"
            variant="heading-default-xl"
            className="mt-4"
          >
            Все категории товаров и услуг
          </Text>
        </Column>
      </Column>

      {/* Сетка категорий — все категории без ограничений */}
      <CategoriesGrid />

      <CallbackSection />
    </Column>
  );
}