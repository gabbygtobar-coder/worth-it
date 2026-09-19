import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That address is not part of WorthIt.',
}

export default function RootNotFound() {
  return (
    <AuthShell>
      <Card>
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
          <CardDescription>
            That address isn't part of WorthIt. Head home or run an analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button render={<Link href="/" />} nativeButton={false}>
            Home
          </Button>
          <Button
            variant="outline"
            render={<Link href="/app/analyze" />}
            nativeButton={false}
          >
            Analyze a decision
          </Button>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
