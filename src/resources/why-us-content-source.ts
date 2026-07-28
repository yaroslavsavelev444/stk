// src/resources/why-us-content-source.ts
//
// Плоские текстовые данные секции "Почему выбирают СТК-Актив" (главная).
// Вынесены без JSX по той же причине, что и about-content-source.ts:
// файл используется и в content.tsx, и в content-defaults.ts как fallback
// для scripts/seed-content.ts (запускается через ts-node/tsx вне сборки
// Next.js).
import type { WhyUsIconKey, WhyUsItem } from "@/modules/home/types";

export const whyUsSource: {
  heading: string;
  subheading: string;
  items: WhyUsItem[];
} = {
  heading: "Почему выбирают СТК-Актив",
  subheading:
    "Четыре причины доверить нам производство и поставку дорожных знаков",
  items: [
    {
      title: "Производство",
      description:
        "Раскрой металла, аппликация плёнки, сборка и контроль — всё на одной площадке, без субподрядчиков и посредников.",
      icon: "factory" satisfies WhyUsIconKey,
    },
    {
      title: "Строгое соответствие ГОСТ",
      description:
        "Каждый знак изготавливается по ГОСТ Р 52290-2004 и ГОСТ Р 32945-2014.",
      icon: "shield" satisfies WhyUsIconKey,
    },
    {
      title: "Сертифицированные материалы",
      description:
        "Работаем только со светоотражающими плёнками ORAFOL, MN/Tech, AVS, ALGALITE.",
      icon: "certificate" satisfies WhyUsIconKey,
    },
    {
      title: "Опыт федеральных проектов",
      description:
        "Поставки на трассы М-2 «Крым», М-4 «Дон», М-7 «Волга», М-12 и десятки региональных объектов.",
      icon: "route" satisfies WhyUsIconKey,
    },
  ],
};
