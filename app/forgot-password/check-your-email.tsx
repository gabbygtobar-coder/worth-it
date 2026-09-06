'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { resendPasswordReset } from '@/app/auth/actions'

export function CheckYourEmail({ email }: { email: string }) {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [limitReached, setLimitReached] = useState(false)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ notice?: string; error?: string } | null>(null)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  const waiting = secondsLeft > 0
  const disabled = sending || waiting || limitReached

  async function handleResend() {
    if (disabled) return
    setSending(true)
    setResult(null)
    try {
      const response = await resendPasswordReset(email)
      setResult({ notice: response.notice, error: response.error })
      // Count down only against a wait Supabase actually named.
      if (response.retryAfterSeconds) setSecondsLeft(response.retryAfterSeconds)
      if (response.emailLimitReached) setLimitReached(true)
    } catch {
      setResult({ error: 'We could not send the email. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription className="break-words">
          We sent a password reset link to {email}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Open the link on this device, in this browser. A link opened somewhere else, like on your
          phone, will not be able to reset your password.
        </p>

        <div className="flex flex-col gap-2">
          <Button type="button" variant="outline" disabled={disabled} onClick={handleResend}>
            {sending
              ? 'Sending...'
              : waiting
                ? `Resend available in ${secondsLeft} seconds`
                : 'Resend reset link'}
          </Button>

          {result?.notice ? (
            <p role="status" className="text-sm text-muted-foreground">
              {result.notice}
            </p>
          ) : null}
          {result?.error ? (
            <p role="alert" className="text-sm text-destructive">
              {result.error}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
