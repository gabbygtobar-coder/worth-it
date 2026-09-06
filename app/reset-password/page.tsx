import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthShell } from '@/components/auth/auth-shell'
import { RecoveryHashSession } from '@/components/auth/recovery-hash-session'
import { ResetPasswordForm } from '@/app/reset-password/reset-password-form'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { getUser } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Set a new password',
  description: 'Choose a new password for your WorthIt account.',
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string }>
}) {
  const { updated } = await searchParams
  const done = updated === '1'

  // The recovery link signs the user in through /auth/callback first. No
  // session here means the link was never used, already used, or expired,
  // unless the password was just changed, which signs the session out itself.
  const user = done || !isSupabaseConfigured ? null : await getUser()

  return (
    <AuthShell
      footer={
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
          Back to sign in
        </Link>
      }
    >
      {done ? (
        <Card>
          <CardHeader>
            <CardTitle>Your password has been updated.</CardTitle>
            <CardDescription>Sign in with your new password to keep going.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/login" />} nativeButton={false}>
              Sign in
            </Button>
          </CardContent>
        </Card>
      ) : user ? (
        <Card>
          <CardHeader>
            <CardTitle>Set a new password</CardTitle>
            <CardDescription className="break-words">
              Choose a new password for {user.email}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm />
          </CardContent>
        </Card>
      ) : (
        <RecoveryHashSession>
          <Card>
            <CardHeader>
              <CardTitle>This reset link is no longer valid.</CardTitle>
              <CardDescription>
                Reset links can only be used once. Request a new link to reset your password, and
                open it on the device and browser you request it from.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button render={<Link href="/forgot-password" />} nativeButton={false}>
                Request a new reset link
              </Button>
            </CardContent>
          </Card>
        </RecoveryHashSession>
      )}
    </AuthShell>
  )
}
