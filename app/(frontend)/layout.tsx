// app/(frontend)/layout.tsx

import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "./theme.css";
import "./globals.css";
import { Column, Flex, Meta } from "@once-ui-system/core";
import classNames from "classnames";
import { Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { FloatingContacts } from "@/components/contact-btn/FloatingContacts";
import { mapSettingsContacts } from "@/components/contact-btn/mapContact";
import { Footer } from "@/components/footer/FooterBar";
import { HeaderSpacer } from "@/components/header/HeaderSpacer";
import { StickyHeader } from "@/components/header/StickyHeader";
import { HeroBackground } from "@/components/hero/HeroBackground"; // ← добавили
import { ModalRoot } from "@/components/ModalRoot";
import { Providers } from "@/components/Providers";
import { SearchPalette } from "@/components/search/SearchPalette";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { baseURL, home } from "@/resources/content";
import { getCachedSettings } from "@/services/payload/settings";

export const dynamic = "force-dynamic"; // ← добавить

const manrope = Manrope({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#2E2D8F",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata() {
  const base = await Meta.generate({
    title: home.title,
    description: home.description,
    baseURL,
    path: home.path,
    image: `/api/og?title=${encodeURIComponent(home.title)}`,
  });

  return {
    ...base,
    metadataBase: new URL(baseURL),
    alternates: { canonical: baseURL },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getCachedSettings();
  const contacts = mapSettingsContacts(settings);

  return (
    <Providers>
      {/*
        У <html> НЕ должно быть фиксированной высоты (height: 100%, 100vh и т.п.).
        Lenis узнаёт о росте контента единственным способом — ResizeObserver на
        document.documentElement, а тот реагирует на размер БОКСА, а не на
        scrollHeight. С height: 100% бокс <html> навсегда равен высоте viewport,
        RO не срабатывает, dimensions.scrollHeight остаётся от первого рендера,
        и limit протухает: колесо упирается в старую границу, хотя страница
        выросла. Клавиатура и скроллбар при этом работают, потому что скроллят
        нативно, минуя clamp Lenis. Полноэкранность даёт min-height: 100vh на
        <body> — фиксированная высота <html> для этого не нужна.
        См. также html.lenis { height: auto } в globals.css.
      */}
      <Flex
        as="html"
        lang="ru"
        fillWidth
        className={classNames(manrope.variable, mono.variable)}
      >
        <Column
          as="body"
          fillWidth // ← убираем background="page" отсюда!
          style={{ minHeight: "100vh", background: "transparent" }}
          margin="0"
          padding="0"
          horizontal="center"
        >
          {/* Фон всего сайта — за всем контентом */}
          <HeroBackground />

          <StickyHeader />
          <HeaderSpacer />

          <Flex
            as="main"
            zIndex={0}
            fillWidth
            padding="l"
            horizontal="center"
            flex={1}
          >
            <Flex horizontal="center" fillWidth minHeight="0">
              {children}
            </Flex>
          </Flex>

          <Footer />
          <ModalRoot />
        </Column>
      </Flex>
      <OrganizationJsonLd settings={settings} siteUrl={baseURL} />
      <SearchPalette />
      <FloatingContacts contacts={contacts} />
    </Providers>
  );
}
