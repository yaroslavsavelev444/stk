import type { CollectionConfig } from "payload";
import { authenticated } from "../access/authenticated.ts";
import { isAdmin } from "../access/isAdmin.ts";
import { notifyAdminsOnCallbackRequest } from "../hooks/notifyAdminsOnCallbackRequest.ts";

export const CallbackRequests: CollectionConfig = {
  slug: "callback-requests",
  admin: {
    useAsTitle: "phone",
    defaultColumns: ["phone", "name", "status", "createdAt"],
  },
  access: {
    read: authenticated,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [notifyAdminsOnCallbackRequest],
  },
  fields: [
    { name: "name", type: "text" },
    { name: "phone", type: "text", required: true },
    { name: "email", type: "email" },
    { name: "comment", type: "textarea" },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Новая", value: "new" },
        { label: "В обработке", value: "processing" },
        { label: "Завершена", value: "completed" },
      ],
      defaultValue: "new",
    },
  ],
};
