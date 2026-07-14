"use server";
import { z } from "zod";
import { createCallbackRequest } from "@/services/payload/callback";
import { isValidRussianPhone } from "@/utils/phone";
import { CallbackActionResult, CallbackFormErrors } from "./callback-form";

/**
 * Валидация повторяет требования коллекции CallbackRequests:
 * обязателен только телефон, остальное — опционально.
 * Простая проверка телефона по числу цифр (от 10), без жёсткой привязки к маске,
 * т.к. пользователи вводят номер по-разному.
 */
const callbackSchema = z.object({
  name: z
    .string()
    .trim()
    .max(120, "Слишком длинное имя")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(1, "Укажите телефон")
    .refine(isValidRussianPhone, {
      message: "Введите корректный номер телефона",
    }),
  email: z
    .string()
    .trim()
    .email("Введите корректный email")
    .optional()
    .or(z.literal("")),
  comment: z
    .string()
    .trim()
    .max(2000, "Слишком длинный комментарий")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  productTitle: z.string().trim().max(200).optional().or(z.literal("")),
  productSku: z.string().trim().max(100).optional().or(z.literal("")),
});

function zodErrorsToFieldErrors(error: z.ZodError): CallbackFormErrors {
  const errors: CallbackFormErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof CallbackFormErrors] = issue.message;
    }
  }
  return errors;
}

export async function submitCallbackRequest(
  _prevState: CallbackActionResult | null,
  formData: FormData,
): Promise<CallbackActionResult> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    comment: String(formData.get("comment") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    productTitle: String(formData.get("productTitle") ?? ""),
    productSku: String(formData.get("productSku") ?? ""),
  };

  // Honeypot-поле против простых ботов: если оно заполнено — тихо считаем, что заявка "отправлена"
  const honeypot = String(formData.get("company_site") ?? "");
  if (honeypot.trim().length > 0) {
    return { ok: true };
  }

  const parsed = callbackSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: zodErrorsToFieldErrors(parsed.error) };
  }

  try {
    await createCallbackRequest({
      name: parsed.data.name || undefined,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      comment: parsed.data.comment || undefined,
      subject: parsed.data.subject || undefined,
      productTitle: parsed.data.productTitle || undefined,
      productSku: parsed.data.productSku || undefined,
    });
    return { ok: true };
  } catch (error) {
    console.error("[CallbackForm] Failed to create callback request", error);
    return {
      ok: false,
      message:
        "Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам напрямую.",
    };
  }
}
