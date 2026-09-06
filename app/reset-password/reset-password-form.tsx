'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { PasswordInput } from '@/components/auth/password-input'
import { updatePassword } from '@/app/auth/actions'
import { MIN_PASSWORD_LENGTH, type AuthFormState } from '@/lib/auth-forms'

const EMPTY: AuthFormState = {}

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, EMPTY)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // A successful update redirects to the confirmation, so there is no success
  // state to render here.
  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <FieldGroup>
        <Field data-invalid={Boolean(state.fieldErrors?.password)}>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors?.password)}
          />
          {state.fieldErrors?.password ? (
            <FieldError>{state.fieldErrors.password}</FieldError>
          ) : (
            <FieldDescription>At least {MIN_PASSWORD_LENGTH} characters.</FieldDescription>
          )}
        </Field>

        <Field data-invalid={Boolean(state.fieldErrors?.confirmPassword)}>
          <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
          />
          <FieldError>{state.fieldErrors?.confirmPassword}</FieldError>
        </Field>
      </FieldGroup>

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? 'Updating password...' : 'Update password'}
      </Button>
    </form>
  )
}
