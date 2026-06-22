export interface CallbackFormValues {
  name: string
  phone: string
  email: string
  comment: string
}

export type CallbackFormErrors = Partial<Record<keyof CallbackFormValues, string>>

export type CallbackFormStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface CallbackActionResult {
  ok: boolean
  errors?: CallbackFormErrors
  message?: string
}
