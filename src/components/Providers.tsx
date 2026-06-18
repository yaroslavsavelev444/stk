"use client";

import {
  ChartMode,
  ChartVariant,
  DataThemeProvider,
  IconProvider,
  LayoutProvider,
  ToastProvider,
} from "@once-ui-system/core";
import { iconLibrary } from "../resources/icons";
import { dataStyle } from "@/resources/content";
import {RootStoreProvider} from "./context/RootStoreContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <RootStoreProvider>

        <DataThemeProvider
          variant={dataStyle.variant as ChartVariant}
          mode={dataStyle.mode as ChartMode}
          height={dataStyle.height}
          // axis={{
          //   // stroke: dataStyle.axis.stroke,
          // }}
          // tick={{
          //   fill: dataStyle.tick.fill,
          //   fontSize: dataStyle.tick.fontSize,
          //   line: dataStyle.tick.line,
          // }}
        >
          <ToastProvider>
            <IconProvider icons={iconLibrary}>{children}</IconProvider>
          </ToastProvider>
        </DataThemeProvider>
        </RootStoreProvider>
    </LayoutProvider>
  );
}
