import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/app/login/login-form'
import { signOut } from '@/app/auth/actions'
import { safeNext } from '@/lib/auth-redirect'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { getUser } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to save your analyses and come back to them later.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const { error, next: nextParam } = await searchParams
  const next = safeNext(nextParam)
  const user = isSupabaseConfigured ? await getUser() : null

  return (
    <AuthShell>
      {!isSupabaseConfigured ? (
        <Card>
          <CardHeader>
            <CardTitle>Sign in is not set up yet</CardTitle>
            <CardDescription>
              Add your Supabase keys to .env.local to enable accounts. You can still analyze a
              decision without one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" render={<Link href="/app/analyze" />} nativeButton={false}>
              Analyze a decision
            </Button>
          </CardContent>
        </Card>
      ) : user ? (
        <Card>
          <CardHeader>
            <CardTitle>You are signed in</CardTitle>
            <CardDescription className="break-words">{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Button render={<Link href={next} />} nativeButton={false}>
              Go to WorthIt
            </Button>
            <form action={signOut}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sign in to WorthIt</CardTitle>
            <CardDescription>
              You need an account to save analyses and see them later. Analyzing a decision does not
              require one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm initialError={error} next={next} />
          </CardContent>
        </Card>
      )}
    </AuthShell>
  )
}
