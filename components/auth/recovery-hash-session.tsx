'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

/**
 * Completes a recovery link whose tokens arrive in the URL fragment.
 *
 * Links our own /forgot-password form sends use PKCE and come back as a `code`
 * query param, which /auth/callback exchanges on the server. Links generated
 * anywhere else, notably the Supabase dashboard, skip PKCE and return
 * `#access_token=...` instead. A fragment is never sent to the server, so
 * without this the page reports a perfectly good link as dead.
 */
export function RecoveryHashSession({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'working' | 'failed'>('idle')

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    if (!accessToken || !refreshToken) return

    setStatus('working')
    createClient()
      .auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        // Never leave tokens sitting in the address bar or browser history.
        window.history.replaceState(null, '', window.location.pathname)
        if (error) {
          setStatus('failed')
          return
        }
        router.refresh()
      })
  }, [router])

  if (status === 'working') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Checking your reset link</CardTitle>
          <CardDescription>One moment.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return <>{children}</>
}
