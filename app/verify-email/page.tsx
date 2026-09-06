import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthShell } from '@/components/auth/auth-shell'
import { ResendVerification } from '@/components/auth/resend-verification'

export const metadata: Metadata = {
  title: 'Check your email',
  description: 'Confirm your email address to finish setting up your WorthIt account.',
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  const address = email?.trim()
  if (!address) redirect('/login')

  return (
    <AuthShell
      footer={
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
          Back to sign in
        </Link>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription className="break-words">
            We sent a verification link to {address}. Open it to finish setting up your account,
            then sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResendVerification email={address} />
        </CardContent>
      </Card>
    </AuthShell>
  )
}
