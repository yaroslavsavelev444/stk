import type { GlobalAfterChangeHook } from "payload";
import { revalidateTags } from "./revalidateTags.ts";

export const revalidateAboutContent: GlobalAfterChangeHook = async ({ doc }) => {
  await revalidateTags(["about-content"]);
  return doc;
};
