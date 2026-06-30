// app/(frontend)/layout.tsx

import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "./theme.css";
import "./globals.css";
import classNames from "classnames";
import { Flex, Column, Meta } from "@once-ui-system/core";
import { Footer } from "@/components/footer/FooterBar";
import { home, baseURL } from "@/resources/content";
import { Providers } from "@/components/Providers";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { SearchPalette } from "@/components/search/SearchPalette";
import { StickyHeader } from "@/components/header/StickyHeader";
import { getCachedSettings } from '@/services/payload/settings';
import { mapSettingsContacts } from '@/components/contact-btn/mapContact';
import { FloatingContacts } from '@/components/contact-btn/FloatingContacts';
import { ModalRoot } from "@/components/ModalRoot";
import { HeroBackground } from "@/components/hero/HeroBackground"; // ← добавили

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

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getCachedSettings();
  const contacts = mapSettingsContacts(settings);

  return (
    <Providers>
      <Flex
        as="html"
        lang="ru"
        fillWidth
        className={classNames(manrope.variable, mono.variable)}
        style={{ height: "100%" }}
      >
        <Column
          as="body"
          fillWidth           // ← убираем background="page" отсюда!
          style={{ minHeight: "100vh", background: "transparent" }}
          margin="0"
          padding="0"
          horizontal="center"
        >
          {/* Фон всего сайта — за всем контентом */}
          <HeroBackground />

          <StickyHeader />

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

      <SearchPalette />
      <FloatingContacts contacts={contacts} />
    </Providers>
  );
}