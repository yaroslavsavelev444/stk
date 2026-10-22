export interface CallbackFormValues {
  name: string;
  phone: string;
  email: string;
  comment: string;
}

export type CallbackFormErrors = Partial<
  Record<keyof CallbackFormValues | "consent", string>
>;

export const CONSENT_REQUIRED_MESSAGE =
  "Для отправки заявки нужно согласие на обработку персональных данных";

export type CallbackFormStatus = "idle" | "submitting" | "success" | "error";

export interface CallbackActionResult {
  ok: boolean;
  errors?: CallbackFormErrors;
  message?: string;
}
