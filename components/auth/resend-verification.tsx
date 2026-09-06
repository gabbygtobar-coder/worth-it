'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { resendVerification } from '@/app/auth/actions'

const COOLDOWN_SECONDS = 60

export function ResendVerification({ email }: { email: string }) {
  // A verification email was just sent, so the first window is already running.
  const [secondsLeft, setSecondsLeft] = useState(COOLDOWN_SECONDS)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ error?: string; notice?: string } | null>(null)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  const waiting = secondsLeft > 0
  const disabled = sending || waiting

  async function handleResend() {
    if (disabled) return
    setSending(true)
    setResult(null)
    try {
      const response = await resendVerification(email)
      setResult(response)
      // Only hold the button when Supabase accepted the request. A rejected
      // one should be retryable once the reason is dealt with.
      if (!response.error) setSecondsLeft(COOLDOWN_SECONDS)
    } catch {
      setResult({ error: 'We could not send the email. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Didn&apos;t receive the email?</p>

      <Button type="button" variant="outline" disabled={disabled} onClick={handleResend}>
        {sending
          ? 'Resending...'
          : waiting
            ? `Resend available in ${secondsLeft}s`
            : 'Resend verification email'}
      </Button>

      {result?.notice ? (
        <p role="status" className="text-sm text-muted-foreground">
          {result.notice} If nothing arrives, this address may already be verified, in which case
          you can sign in below.
        </p>
      ) : null}
      {result?.error ? (
        <p role="alert" className="text-sm text-destructive">
          {result.error}
        </p>
      ) : null}
    </div>
  )
}
