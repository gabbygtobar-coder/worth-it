import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'
import { ForgotPasswordForm } from '@/app/forgot-password/forgot-password-form'

export const metadata: Metadata = {
  title: 'Reset your password',
  description: 'Get a link to set a new WorthIt password.',
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      footer={
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
