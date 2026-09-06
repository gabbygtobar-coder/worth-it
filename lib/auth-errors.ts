import type { AuthError } from '@supabase/supabase-js'

/**
 * Supabase auth errors are written for developers. These map them to something
 * a person can act on, and keep request paths, project URLs, and internal
 * details out of the UI.
 */
export type AuthAction = 'signIn' | 'signUp' | 'resend' | 'requestReset' | 'updatePassword'

const FALLBACK: Record<AuthAction, string> = {
  signIn: 'We could not sign you in. Please try again.',
  signUp: 'We could not create your account. Please try again.',
  resend: 'We could not send the email. Please try again.',
  requestReset: "We couldn't send the reset email. Please try again.",
  updatePassword: 'We could not update your password. Please try again.',
}

const RATE_LIMITED = 'Too many attempts. Please wait a moment and try again.'
const EMAIL_RATE_LIMITED = 'Please wait before requesting another email.'
const EMAIL_LIMIT_REACHED =
  "You've reached the email sending limit for now. Please try again later."

const RATE_LIMIT_CODES = new Set([
  'over_email_send_rate_limit',
  'over_request_rate_limit',
  'over_sms_send_rate_limit',
])

export function isRateLimit(error: AuthError): boolean {
  if (error.status === 429) return true
  if (error.code && RATE_LIMIT_CODES.has(error.code)) return true
  return /rate limit|you can only request this after/i.test(error.message)
}

/**
 * How long Supabase says to wait, when it says at all. The short per-address
 * throttle reports its remaining seconds; the hourly project quota does not,
 * and nothing may be invented in its place.
 */
export function retryAfterSeconds(error: AuthError): number | undefined {
  const match = /after (\d+) second/i.exec(error.message)
  if (!match) return undefined
  const seconds = Number(match[1])
  return Number.isFinite(seconds) && seconds > 0 ? seconds : undefined
}

/** Sending email is rate limited separately, and says so in plainer terms. */
function rateLimitCopy(action: AuthAction, seconds: number | undefined): string {
  if (action !== 'resend' && action !== 'requestReset') return RATE_LIMITED
  return seconds ? EMAIL_RATE_LIMITED : EMAIL_LIMIT_REACHED
}

/** Codes that mean the same thing regardless of which form the user submitted. */
const BY_CODE: Record<string, string> = {
  invalid_credentials: 'Email or password is incorrect.',
  email_not_confirmed: 'Please verify your email before signing in.',
  email_address_invalid: 'That email address does not look right.',
  user_already_exists: 'An account with that email already exists. Try signing in instead.',
  user_repeated_signup: 'An account with that email already exists. Try signing in instead.',
  otp_expired: 'This link has expired. Request a new one.',
  over_email_send_rate_limit: RATE_LIMITED,
  over_request_rate_limit: RATE_LIMITED,
  over_sms_send_rate_limit: RATE_LIMITED,
  weak_password: 'That password is too weak. Use at least 8 characters.',
  same_password: 'That is already your password. Choose a different one.',
  signup_disabled: 'New accounts are not being accepted right now.',
  user_not_found: 'We could not find an account for that email.',
  session_expired: 'Your session expired. Please sign in again.',
  session_not_found: 'Your session expired. Please sign in again.',
  reauthentication_needed: 'For your security, sign in again before changing your password.',
}

/** Older releases send only a message, so fall back to matching on the text. */
function fromMessage(message: string): string | undefined {
  const text = message.toLowerCase()
  if (text.includes('invalid login credentials')) return BY_CODE.invalid_credentials
  if (text.includes('email not confirmed')) return BY_CODE.email_not_confirmed
  if (text.includes('already registered') || text.includes('already been registered')) {
    return BY_CODE.user_already_exists
  }
  if (text.includes('invalid or has expired')) return BY_CODE.otp_expired
  // "For security purposes, you can only request this after 27 seconds."
  if (text.includes('you can only request this after') || text.includes('rate limit')) {
    return RATE_LIMITED
  }
  if (text.includes('password should be at least')) return BY_CODE.weak_password
  if (text.includes('auth session missing')) return BY_CODE.session_expired
  return undefined
}

export function friendlyAuthError(error: AuthError | null, action: AuthAction): string {
  if (!error) return FALLBACK[action]
  if (isRateLimit(error)) return rateLimitCopy(action, retryAfterSeconds(error))
  if (error.code && BY_CODE[error.code]) return BY_CODE[error.code]
  return fromMessage(error.message) ?? FALLBACK[action]
}

/**
 * For a confirmation link that failed to complete. Supabase reports these
 * either as a thrown error or as an `error_code` on the redirect back to us.
 */
export function friendlyLinkError(error: AuthError | null, code?: string | null): string {
  const expired = 'This verification link has expired. Request a new one.'
  const dead = 'That link is no longer valid. Try signing in again.'

  if (code === 'otp_expired') return expired
  if (code) return dead
  if (!error) return dead
  if (error.code === 'otp_expired' || error.message.toLowerCase().includes('invalid or has expired')) {
    return expired
  }
  if (error.status === 429) return RATE_LIMITED
  return dead
}
