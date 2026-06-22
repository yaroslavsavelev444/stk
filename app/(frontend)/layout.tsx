// app/(frontend)/layout.tsx — исправленный и готовый к использованию

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

// Импорты для плавающих контактов
import { getCachedSettings } from '@/services/payload/settings';
import { mapSettingsContacts } from '@/components/contact-btn/mapContact';
import { FloatingContacts } from '@/components/contact-btn/FloatingContacts';

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🔥 Получаем контакты на сервере (кешируется)
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
          background="page"
          fillWidth
          style={{ minHeight: "100vh" }}
          margin="0"
          padding="0"
          horizontal="center"
        >
          <StickyHeader />

          <Flex zIndex={0} fillWidth padding="l" horizontal="center" flex={1}>
            <Flex horizontal="center" fillWidth minHeight="0">
              {children}
            </Flex>
          </Flex>

          <Footer />
        </Column>
      </Flex>

      <SearchPalette />

      {/* Плавающая кнопка с контактами – отображается поверх всего */}
      <FloatingContacts contacts={contacts} />
    </Providers>
  );
}