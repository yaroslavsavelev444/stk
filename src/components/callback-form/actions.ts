"use server";
import { headers } from "next/headers";
import { z } from "zod";
import { CONSENT_DOCUMENT_SLUG, POLICY_DOCUMENT_SLUG } from "@/resources/legal";
import { createCallbackRequest } from "@/services/payload/callback";
import { getCachedConsentBySlug } from "@/services/payload/consents";
import { isValidRussianPhone } from "@/utils/phone";
import { createRateLimiter } from "@/utils/rateLimit";
import {
  CONSENT_REQUIRED_MESSAGE,
  CallbackActionResult,
  CallbackFormErrors,
} from "./callback-form";

// Не больше 5 заявок за 10 минут с одного IP
const isSubmissionAllowed = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000,
});

/**
 * IP клиента: X-Real-IP выставляет хостовый Nginx (deploy/nginx/snippets/
 * proxy-common.conf), а порт приложения наружу не опубликован — подделать
 * заголовок в обход Nginx нельзя.
 */
async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/**
 * Версия документа для доказательства согласия (ч. 3 ст. 9 152-ФЗ):
 * slug + дата последней редакции. Полная история текстов хранится
 * в версиях коллекции Consents.
 */
async function getDocumentVersion(slug: string): Promise<string> {
  const doc = await getCachedConsentBySlug(slug)();
  if (!doc) {
    console.warn(`[CallbackForm] Документ /consents/${slug} не опубликован`);
    return `${slug}@не опубликован`;
  }
  return `${slug}@${doc.updatedAt}`;
}

/**
 * Валидация повторяет требования коллекции CallbackRequests:
 * обязательны телефон и согласие на обработку ПД, остальное — опционально.
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
  // Отметка чекбокса согласия: браузер присылает "on", без отметки поля нет
  consent: z.literal("on", { error: CONSENT_REQUIRED_MESSAGE }),
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
    consent: String(formData.get("consent") ?? ""),
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

  if (!isSubmissionAllowed(await getClientIp())) {
    return {
      ok: false,
      message:
        "Слишком много заявок подряд. Попробуйте позже или позвоните нам напрямую.",
    };
  }

  try {
    const [consentVersion, policyVersion] = await Promise.all([
      getDocumentVersion(CONSENT_DOCUMENT_SLUG),
      getDocumentVersion(POLICY_DOCUMENT_SLUG),
    ]);

    await createCallbackRequest({
      consent: {
        acceptedAt: new Date().toISOString(),
        consentVersion,
        policyVersion,
      },
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
