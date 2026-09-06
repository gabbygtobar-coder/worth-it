import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { isSupabaseConfigured, supabaseEnv } from './env'

/**
 * Refreshes the Supabase auth session on every matched request and passes the
 * updated cookies to both the browser and the server components that run next.
 *
 * Route protection is not done here yet. Guests can analyze decisions, and the
 * private pages still render the pre-existing demo content, so gating them now
 * would only hide placeholders behind a login.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  if (!isSupabaseConfigured) return NextResponse.next({ request })

  const { url, anonKey } = supabaseEnv()
  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  // Touching getUser() is what triggers the refresh. Do not remove.
  await supabase.auth.getUser()

  return response
}
