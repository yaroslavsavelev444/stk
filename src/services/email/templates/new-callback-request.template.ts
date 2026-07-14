import type { EmailTemplate, RenderedEmail } from "../types";
import { escapeHtml } from "./shared/escapeHtml";
import { renderEmailLayout } from "./shared/layout";

export interface NewCallbackRequestEmailData {
  id: string;
  name?: string | null;
  phone: string;
  email?: string | null;
  comment?: string | null;
  subject?: string | null;
  productTitle?: string | null;
  productSku?: string | null;
  createdAt: Date;
  adminUrl: string;
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Moscow",
});

function renderRow(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:6px 0;color:#71717A;font-size:13px;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;color:#18181B;font-size:14px;">${valueHtml}</td>
  </tr>`;
}

function render(data: NewCallbackRequestEmailData): RenderedEmail {
  const formattedDate = dateFormatter.format(data.createdAt);
  const safeName = data.name ? escapeHtml(data.name) : "—";
  const safePhone = escapeHtml(data.phone);
  const safeEmail = data.email ? escapeHtml(data.email) : null;
  const safeComment = data.comment ? escapeHtml(data.comment) : "—";
  const safeSubject = data.subject ? escapeHtml(data.subject) : null;
  const safeProductTitle = data.productTitle
    ? escapeHtml(data.productTitle)
    : null;
  const safeProductSku = data.productSku
    ? escapeHtml(data.productSku)
    : null;

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-size:18px;color:#18181B;">Новая заявка с сайта</h1>
    <p style="margin:0 0 20px;color:#52525B;">Поступила новая заявка на обратный звонок. Детали ниже.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${renderRow("Имя", safeName)}
      ${renderRow("Телефон", `<a href="tel:${encodeURIComponent(data.phone)}" style="color:#2E2D8F;text-decoration:none;">${safePhone}</a>`)}
      ${renderRow(
        "Email",
        safeEmail
          ? `<a href="mailto:${encodeURIComponent(data.email as string)}" style="color:#2E2D8F;text-decoration:none;">${safeEmail}</a>`
          : "—",
      )}
      ${safeSubject ? renderRow("Тема", safeSubject) : ""}
      ${safeProductTitle ? renderRow("Товар", safeProductTitle) : ""}
      ${safeProductSku ? renderRow("Артикул", safeProductSku) : ""}
      ${renderRow("Комментарий", safeComment)}
      ${renderRow("Дата", formattedDate)}
    </table>
    <div style="margin-top:24px;">
      <a href="${data.adminUrl}" style="display:inline-block;padding:10px 20px;background-color:#2E2D8F;color:#FFFFFF;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
        Открыть заявку в админке
      </a>
    </div>
  `;

  const text = [
    "Новая заявка с сайта",
    `Имя: ${data.name || "—"}`,
    `Телефон: ${data.phone}`,
    `Email: ${data.email || "—"}`,
    ...(data.subject ? [`Тема: ${data.subject}`] : []),
    ...(data.productTitle ? [`Товар: ${data.productTitle}`] : []),
    ...(data.productSku ? [`Артикул: ${data.productSku}`] : []),
    `Комментарий: ${data.comment || "—"}`,
    `Дата: ${formattedDate}`,
    `Открыть в админке: ${data.adminUrl}`,
  ].join("\n");

  return {
    subject: `Новая заявка с сайта — ${data.name || data.phone}`,
    html: renderEmailLayout({
      previewText: "Поступила новая заявка на обратный звонок",
      bodyHtml,
    }),
    text,
  };
}

export const newCallbackRequestEmailTemplate: EmailTemplate<NewCallbackRequestEmailData> =
  {
    id: "new-callback-request",
    render,
  };
