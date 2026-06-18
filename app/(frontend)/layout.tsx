import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "./theme.css";

import classNames from "classnames";
import { Flex, Column, Meta } from "@once-ui-system/core";
import { TopHeader } from "@/components/header/TopHeader";
import { Footer } from "@/components/footer/FooterBar";
import { home, baseURL } from "@/resources/content";
import { Providers } from "@/components/Providers";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { SearchPalette } from "@/components/search/SearchPalette";
import { ModalRoot } from "@/components/ModalRoot";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      {/* html и body – без лишних overflow, просто fillWidth */}
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
          {/* Основной контент – без SearchPalette */}
          <TopHeader />
          <Flex zIndex={0} fillWidth padding="l" horizontal="center" flex={1}>
            <Flex horizontal="center" fillWidth minHeight="0">
              {children}
            </Flex>
          </Flex>
          <Footer />
        </Column>
      </Flex>
       <ModalRoot />   
      {/* SearchPalette размещаем снаружи Column, чтобы он не влиял на layout */}
      <SearchPalette />
    </Providers>
  );
}