'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { siteUrl } from '@/lib/supabase/env'
import { friendlyAuthError, isRateLimit, retryAfterSeconds } from '@/lib/auth-errors'
import {
  validateEmail,
  validatePassword,
  type AuthFieldErrors,
  type AuthFormState,
  type EmailSendResult,
} from '@/lib/auth-forms'

function readEmail(formData: FormData): string {
  return String(formData.get('email') ?? '').trim()
}

export async function signIn(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readEmail(formData)
  const password = String(formData.get('password') ?? '')

  const fieldErrors: AuthFieldErrors = {}
  const emailError = validateEmail(email)
  if (emailError) fieldErrors.email = emailError
  if (!password) fieldErrors.password = 'Enter your password.'
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: friendlyAuthError(error, 'signIn') }
  }

  revalidatePath('/', 'layout')
  redirect('/app')
}

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readEmail(formData)
  const password = String(formData.get('password') ?? '')
  const displayName = String(formData.get('displayName') ?? '').trim()

  const fieldErrors: AuthFieldErrors = {}
  const emailError = validateEmail(email)
  if (emailError) fieldErrors.email = emailError
  const passwordError = validatePassword(password, 'Choose a password.')
  if (passwordError) fieldErrors.password = passwordError
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback`,
      data: displayName ? { display_name: displayName } : undefined,
    },
  })
  if (error) {
    return { error: friendlyAuthError(error, 'signUp') }
  }

  revalidatePath('/', 'layout')

  // With email confirmation on, Supabase returns a user but no session. Send
  // them to a screen that explains what to do next.
  if (!data.session) {
    redirect(`/verify-email?email=${encodeURIComponent(email)}`)
  }

  redirect('/app')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

/**
 * Sends the confirmation email again. Called directly from a client component,
 * which owns the cooldown, so this returns a result instead of redirecting.
 *
 * Supabase answers 200 even when it sends nothing, which it does when the
 * address has no pending signup, so the caller must not read success as proof
 * that an email is on its way.
 */
export async function resendVerification(
  email: string,
): Promise<{ error?: string; notice?: string }> {
  const trimmed = email.trim()
  const emailError = validateEmail(trimmed)
  if (emailError) return { error: emailError }

  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: trimmed,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
  })
  if (error) {
    return { error: friendlyAuthError(error, 'resend') }
  }

  return { notice: 'Verification email sent. It can take a minute to arrive.' }
}

/**
 * Asks Supabase for a recovery email and reports back what it said, including
 * the wait it named when it named one. Shared by the first request and the
 * resend so both behave identically.
 */
async function sendResetLink(email: string): Promise<EmailSendResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
  })

  if (!error) return {}

  if (process.env.NODE_ENV !== 'production') {
    // The friendly copy replaces the original, so keep the real one visible
    // while developing. Rate limit messages carry no secrets.
    console.info('[auth-reset]', {
      status: error.status ?? null,
      code: error.code ?? null,
      message: error.message,
    })
  }

  const limited = isRateLimit(error)
  const seconds = limited ? retryAfterSeconds(error) : undefined

  return {
    error: friendlyAuthError(error, 'requestReset'),
    retryAfterSeconds: seconds,
    emailLimitReached: limited && !seconds,
  }
}

export async function requestPasswordReset(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readEmail(formData)
  const emailError = validateEmail(email)
  if (emailError) return { fieldErrors: { email: emailError } }

  const result = await sendResetLink(email)
  if (result.error) {
    return {
      error: result.error,
      retryAfterSeconds: result.retryAfterSeconds,
      emailLimitReached: result.emailLimitReached,
    }
  }

  return { success: true, sentTo: email }
}

/**
 * Sends the recovery email again. Called straight from the check your email
 * screen, which owns the countdown, so this returns a result rather than
 * redirecting.
 */
export async function resendPasswordReset(email: string): Promise<EmailSendResult> {
  const trimmed = email.trim()
  const emailError = validateEmail(trimmed)
  if (emailError) return { error: emailError }

  const result = await sendResetLink(trimmed)
  if (result.error) return result

  return { notice: 'Reset link sent. It can take a minute to arrive.' }
}

export async function updatePassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  const fieldErrors: AuthFieldErrors = {}
  const passwordError = validatePassword(password, 'Choose a new password.')
  if (passwordError) fieldErrors.password = passwordError
  if (!confirmPassword) {
    fieldErrors.confirmPassword = 'Repeat your new password.'
  } else if (password && password !== confirmPassword) {
    fieldErrors.confirmPassword = 'Both passwords need to match.'
  }
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return { error: friendlyAuthError(error, 'updatePassword') }
  }

  // End the recovery session so the new password gets used on the next sign in.
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')

  // Signing out leaves the reset page with no session, which on its own reads
  // as a dead link. Come back with a flag so it can confirm the change instead.
  redirect('/reset-password?updated=1')
}
