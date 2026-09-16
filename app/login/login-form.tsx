'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/auth/password-input'
import { signIn, signUp } from '@/app/auth/actions'
import { MIN_PASSWORD_LENGTH, type AuthFormState } from '@/lib/auth-forms'

const EMPTY: AuthFormState = {}

export function LoginForm({ initialError, next }: { initialError?: string; next: string }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const isSignUp = mode === 'signup'

  return (
    <div className="flex flex-col gap-5">
      {/* Keyed so switching modes starts from a clean form and clears errors. */}
      {isSignUp ? (
        <SignUpForm key="signup" next={next} />
      ) : (
        <SignInForm key="signin" initialError={initialError} next={next} />
      )}

      <p className="text-sm text-muted-foreground">
        {isSignUp ? 'Already have an account?' : 'New to WorthIt?'}{' '}
        <button
          type="button"
          className="font-medium text-primary hover:underline"
          onClick={() => setMode(isSignUp ? 'signin' : 'signup')}
        >
          {isSignUp ? 'Sign in' : 'Create an account'}
        </button>
      </p>
    </div>
  )
}

function SignInForm({ initialError, next }: { initialError?: string; next: string }) {
  const [state, formAction, pending] = useActionState(signIn, EMPTY)
  // Held locally so a failed submit never wipes what was typed.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const error = state.error ?? initialError

  return (
    // noValidate so problems are reported with our own field messages instead
    // of the browser's tooltip.
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
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

        <Field data-invalid={Boolean(state.fieldErrors?.password)}>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors?.password)}
          />
          <FieldError>{state.fieldErrors?.password}</FieldError>
        </Field>
      </FieldGroup>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}

function SignUpForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signUp, EMPTY)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="displayName">
            Name
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">Optional</span>
          </FieldLabel>
          <Input
            id="displayName"
            name="displayName"
            autoComplete="name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </Field>

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

        <Field data-invalid={Boolean(state.fieldErrors?.password)}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
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
      </FieldGroup>

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
