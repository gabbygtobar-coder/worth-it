import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { isProtectedAppPath, safeNext } from '@/lib/auth-redirect'
import { isSupabaseConfigured, supabaseEnv } from './env'

/**
 * Sends an anonymous visitor to /login with an allow-listed `next` so they can
 * return to the page they asked for after signing in.
 */
function redirectToLogin(request: NextRequest, authResponse?: NextResponse): NextResponse {
  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  loginUrl.search = ''
  loginUrl.searchParams.set('next', safeNext(request.nextUrl.pathname))

  const redirectResponse = NextResponse.redirect(loginUrl)
  if (authResponse) {
    // Preserve cookies the Supabase client may have refreshed or cleared.
    for (const cookie of authResponse.headers.getSetCookie()) {
      redirectResponse.headers.append('Set-Cookie', cookie)
    }
  }
  return redirectResponse
}

/**
 * Refreshes the Supabase auth session on every matched request and passes the
 * updated cookies to both the browser and the server components that run next.
 *
 * Protected surfaces (/app home, /app/profile, /app/decisions) require a
 * session. The analyzer, calculators, and learn pages stay public so the
 * portfolio demo still works without an account.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const needsAuth = isProtectedAppPath(pathname)

  if (!isSupabaseConfigured) {
    return needsAuth ? redirectToLogin(request) : NextResponse.next({ request })
  }

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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && needsAuth) return redirectToLogin(request, response)

  return response
}
