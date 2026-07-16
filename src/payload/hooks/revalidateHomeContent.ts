import type { GlobalAfterChangeHook } from "payload";
import { revalidateTags } from "./revalidateTags.ts";

export const revalidateHomeContent: GlobalAfterChangeHook = async ({ doc }) => {
  await revalidateTags(["home-content"]);
  return doc;
};
