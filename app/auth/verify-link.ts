import { NextResponse, type NextRequest } from 'next/server'
import type { AuthError, EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { friendlyLinkError } from '@/lib/auth-errors'
import { safeAuthLinkNext } from '@/lib/auth-redirect'

/**
 * Records which branch an email link took, so a failing link can be diagnosed
 * from the dev server output. Presence flags and error codes only: never a
 * token, cookie, or key.
 */
function trace(path: string, detail: Record<string, string | boolean | null>) {
  if (process.env.NODE_ENV === 'production') return
  console.info(`[auth-link] ${path}`, detail)
}

/**
 * Completes an email based sign-in. Supabase sends either a `code` (PKCE) or a
 * `token_hash` with a `type`, depending on the email template, so both are
 * handled here. Shared by /auth/callback and /auth/confirm.
 */
export async function handleAuthLink(request: NextRequest) {
  const { pathname, searchParams, origin } = new URL(request.url)
  const next = safeAuthLinkNext(searchParams.get('next'))
  const type = searchParams.get('type') as EmailOtpType | null
  const isRecovery = type === 'recovery' || next === '/reset-password'

  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const errorCode = searchParams.get('error_code')

  trace(pathname, {
    hasCode: Boolean(code),
    hasTokenHash: Boolean(tokenHash),
    type: type ?? null,
    next,
    isRecovery,
    supabaseErrorCode: errorCode,
  })

  function failure(error: AuthError | null, code?: string | null) {
    trace(pathname, {
      outcome: 'failed',
      reason: error ? (error.code ?? error.name) : (code ?? 'no token in the request'),
    })
    // The reset screen explains a dead recovery link and offers a fresh one.
    if (isRecovery) return NextResponse.redirect(`${origin}/reset-password`)
    const message = friendlyLinkError(error, code)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(message)}`)
  }

  function success(destination: string) {
    trace(pathname, { outcome: 'signed in', destination })
    return NextResponse.redirect(`${origin}${destination}`)
  }

  // Supabase reports a spent or expired link by redirecting here with error
  // params rather than a token.
  if (searchParams.get('error') || errorCode) return failure(null, errorCode)

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return success(next)
    return failure(error)
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) return success(next)
    return failure(error)
  }

  return failure(null)
}
