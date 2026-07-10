// src/payload/access/isAdmin.ts
import type { PayloadRequest } from "payload";

export const isAdmin = ({ req }: { req: PayloadRequest }) => {
  return req.user?.role === "admin";
};
