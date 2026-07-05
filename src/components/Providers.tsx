"use client";

import {
  ChartMode,
  ChartVariant,
  DataThemeProvider,
  IconProvider,
  LayoutProvider,
} from "@once-ui-system/core";
import { dataStyle } from "@/resources/content";
import { AppToaster } from "@/shared/components/Toaster";
import { iconLibrary } from "../resources/icons";
import { CallbackModalProvider } from "./context/CallbackModalContext";
import { RootStoreProvider } from "./context/RootStoreContext";
import LenisProvider from "./Providers/LenisProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <LenisProvider>
        <RootStoreProvider>
          <CallbackModalProvider>
            <DataThemeProvider variant={dataStyle.variant as ChartVariant}>
              <IconProvider icons={iconLibrary}>
                {children}
                <AppToaster />
              </IconProvider>
            </DataThemeProvider>
          </CallbackModalProvider>
        </RootStoreProvider>
      </LenisProvider>
    </LayoutProvider>
  );
}
