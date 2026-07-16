// scripts/seed-content.ts
//
// Переносит текущий захардкоженный текст в Payload-глобалы:
//   - home-content  — блок "О компании" на главной странице;
//   - about-content — контент страницы "О нас" от блока "О компании"
//                     до блока "История компании" включительно.
//
// Идемпотентен: секция записывается только если она ещё не заполнена в
// базе, поэтому повторный запуск не затирает правки, уже сделанные через
// админку.
//
// Запуск (нужны переменные окружения MONGODB_URI и PAYLOAD_SECRET — как и
// для scripts/create-search-indexes.ts, отдельно не подгружаются):
//   pnpm run seed:content
//
// Собирает собственный минимальный buildConfig, а не импортирует
// payload.config.ts напрямую: полный конфиг регистрирует коллекцию
// CallbackRequests, чей afterChange-хук уведомлений подключает почтовый
// сервис по алиасу "@/services/email" — этот алиас не резолвится
// инструментами запуска отдельных TS-файлов (ts-node/tsx) вне сборки
// Next.js. Для сидирования home-content/about-content коллекция
// CallbackRequests не нужна, поэтому конфиг собирается только из того,
// что этим двум глобалам действительно требуется (Media — как цель
// upload-полей, сами глобалы и их хуки/поля — все относительными
// импортами с явным расширением, без алиасов).
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig, getPayload } from "payload";
import { Media } from "../src/payload/collections/Media.ts";
import { AboutContent } from "../src/payload/globals/AboutContent.ts";
import { HomeContent } from "../src/payload/globals/HomeContent.ts";
import {
  aboutContentDefaults,
  homeContentDefaults,
} from "../src/services/payload/content-defaults.ts";

type Payload = Awaited<ReturnType<typeof getPayload>>;

async function seedHomeContent(payload: Payload) {
  const existing = await payload.findGlobal({ slug: "home-content" });
  const data: Record<string, unknown> = {};

  if (!existing?.aboutIntro?.heading) {
    data.aboutIntro = homeContentDefaults.aboutIntro;
  }

  if (Object.keys(data).length === 0) {
    console.log('[seed] home-content: секции уже заполнены, пропускаем');
    return;
  }

  await payload.updateGlobal({ slug: "home-content", data });
  console.log("[seed] home-content: записаны секции —", Object.keys(data).join(", "));
}

async function seedAboutContent(payload: Payload) {
  const existing = await payload.findGlobal({ slug: "about-content" });
  const data: Record<string, unknown> = {};

  const sectionPresence: Array<[keyof typeof aboutContentDefaults, unknown]> = [
    ["hero", existing?.hero?.heading],
    ["mediaBlocks", existing?.mediaBlocks && existing.mediaBlocks.length > 0],
    ["callout", existing?.callout?.text],
    ["production", existing?.production?.heading],
    ["productionWater", existing?.productionWater?.heading],
    ["standards", existing?.standards?.heading],
    ["quality", existing?.quality?.heading],
    ["geography", existing?.geography?.heading],
    ["timeline", existing?.timeline?.heading],
  ];

  for (const [section, presence] of sectionPresence) {
    if (!presence) {
      data[section] = aboutContentDefaults[section];
    }
  }

  if (Object.keys(data).length === 0) {
    console.log("[seed] about-content: секции уже заполнены, пропускаем");
    return;
  }

  await payload.updateGlobal({ slug: "about-content", data });
  console.log("[seed] about-content: записаны секции —", Object.keys(data).join(", "));
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Не задан MONGODB_URI");
  }

  const config = await buildConfig({
    secret: process.env.PAYLOAD_SECRET || "seed-script",
    db: mongooseAdapter({ url: process.env.MONGODB_URI }),
    collections: [Media],
    globals: [HomeContent, AboutContent],
  });

  const payload = await getPayload({ config });

  await seedHomeContent(payload);
  await seedAboutContent(payload);

  await payload.destroy();
}

main()
  .then(() => {
    console.log("[seed] Готово");
    process.exit(0);
  })
  .catch((err) => {
    console.error("[seed] Ошибка:", err);
    process.exit(1);
  });
