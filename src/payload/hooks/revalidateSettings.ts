import { revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

export const revalidateSettings: GlobalAfterChangeHook = ({ doc }) => {
  // { expire: 0 } — немедленная инвалидация: админ должен увидеть изменения
  // сразу после сохранения, а не при следующем визите (stale-while-revalidate).
  revalidateTag("settings", { expire: 0 });
  return doc;
};
