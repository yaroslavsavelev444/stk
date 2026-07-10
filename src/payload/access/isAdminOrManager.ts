// src/payload/access/isAdminOrManager.ts
import type { PayloadRequest } from "payload";

export const isAdminOrManager = ({ req }: { req: PayloadRequest }) => {
  return req.user?.role === "admin" || req.user?.role === "manager";
};
