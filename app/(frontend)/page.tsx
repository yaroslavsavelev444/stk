import {
  Column,
  RevealFx,
  Schema,
  Meta,
} from "@once-ui-system/core";
import { home, about, person, baseURL } from "@/resources/content";
import { CategoriesGrid } from "@/components/categories";
import { CallbackSection } from "@/components/callback-form/CallbackSection";
import { HeroSection } from "@/components/hero/HeroSection";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="0" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Полноэкранная hero-секция — первый экран */}
      <HeroSection />

      {/* Якорь для скролла кнопки "О нас" */}
      <div id="main-content" />

      {/* Сетка категорий */}
      <RevealFx
        translateY="16"
        fillWidth
        trigger={true}
        delay={0.2}
      >
        <CategoriesGrid />
      </RevealFx>

      <CallbackSection />
    </Column>
  );
}