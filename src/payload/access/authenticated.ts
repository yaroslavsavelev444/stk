// src/payload/access/authenticated.ts
import type { PayloadRequest } from "payload";

export const authenticated = ({ req }: { req: PayloadRequest }) => {
  return Boolean(req.user);
};
