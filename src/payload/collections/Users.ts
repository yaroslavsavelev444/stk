import type { CollectionConfig } from "payload";
import { isAdmin } from "../access/isAdmin.ts";
import { cookieDomain } from "../config/allowedOrigins.ts";

export const Users: CollectionConfig = {
  slug: "users",
  // cookieDomain задаётся только через COOKIE_DOMAIN (например ".stkaktiv.ru")
  // в production, чтобы сессия админки была видна и на admin.stkaktiv.ru, и
  // на stkaktiv.ru. Если переменная не задана (локальная разработка),
  // cookieDomain === undefined и Payload использует прежнее поведение
  // (host-only cookie) — auth: true эквивалентно auth: {}.
  auth: {
    cookies: {
      domain: cookieDomain,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  admin: { useAsTitle: "email" },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "role",
      type: "select",
      options: [
        { label: "Администратор", value: "admin" },
        { label: "Менеджер", value: "manager" },
      ],
      defaultValue: "manager",
      required: true,
    },
  ],
};
