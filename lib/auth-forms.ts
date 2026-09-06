/**
 * Shared shapes and rules for the auth forms. Kept out of the server action
 * file because a 'use server' module may only export async functions.
 */

/** Minimum length WorthIt asks for. Supabase itself allows shorter. */
export const MIN_PASSWORD_LENGTH = 8

export interface AuthFieldErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

export interface AuthFormState {
  /** Form level problem, shown above the submit button. */
  error?: string
  /** Per field problem, shown under the field it belongs to. */
  fieldErrors?: AuthFieldErrors
  notice?: string
  success?: boolean
  /** Address a reset link went to, for the check your email screen. */
  sentTo?: string
  /** Seconds Supabase asked us to wait. Absent when it gave no number. */
  retryAfterSeconds?: number
  /** The project email quota is spent, so no countdown can be offered. */
  emailLimitReached?: boolean
}

/** Result of asking Supabase to send an email. */
export interface EmailSendResult {
  notice?: string
  error?: string
  retryAfterSeconds?: number
  emailLimitReached?: boolean
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | undefined {
  if (!email) return 'Enter your email.'
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address.'
  return undefined
}

export function validatePassword(password: string, missing: string): string | undefined {
  if (!password) return missing
  if (password.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  return undefined
}
