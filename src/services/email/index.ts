export { EmailService, emailService } from "./EmailService";
export {
  EmailConfigError,
  EmailDeliveryError,
  EmailError,
  EmailTemplateError,
} from "./errors";
export { getAdminEmailAddresses } from "./recipients/getAdminEmails";
export type { NewCallbackRequestEmailData } from "./templates/new-callback-request.template";
export { newCallbackRequestEmailTemplate } from "./templates/new-callback-request.template";
export { emailTemplates } from "./templates/registry";
export type {
  EmailAddress,
  EmailTemplate,
  RenderedEmail,
  SendEmailOptions,
  SendEmailResult,
} from "./types";
