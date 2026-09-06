'use client'

import { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CheckYourEmail } from '@/app/forgot-password/check-your-email'
import { requestPasswordReset } from '@/app/auth/actions'
import { type AuthFormState } from '@/lib/auth-forms'

const EMPTY: AuthFormState = {}

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, EMPTY)
  const [email, setEmail] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)

  // Only ever counts down from a wait Supabase named itself.
  useEffect(() => {
    if (state.retryAfterSeconds) setSecondsLeft(state.retryAfterSeconds)
  }, [state.retryAfterSeconds])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  if (state.success && state.sentTo) {
    return <CheckYourEmail email={state.sentTo} />
  }

  const waiting = secondsLeft > 0
  const blocked = pending || waiting || Boolean(state.emailLimitReached)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter the email you signed up with. We will send you a link to set a new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} noValidate className="flex flex-col gap-5">
          <FieldGroup>
            <Field data-invalid={Boolean(state.fieldErrors?.email)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(state.fieldErrors?.email)}
              />
              <FieldError>{state.fieldErrors?.email}</FieldError>
            </Field>
          </FieldGroup>

          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" disabled={blocked}>
            {pending
              ? 'Sending...'
              : waiting
                ? `Try again in ${secondsLeft} seconds`
                : 'Send reset link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
