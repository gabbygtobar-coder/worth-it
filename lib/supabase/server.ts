import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseEnv } from './env'
import type { Database } from './types'

/**
 * Supabase client for server components, server actions, and route handlers.
 * Always create a new one per request: the client carries the caller's session.
 */
export async function createClient() {
  const { url, anonKey } = supabaseEnv()
  const cookieStore = await cookies()

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Server components cannot set cookies. The middleware refreshes the
          // session instead, so this is safe to ignore.
        }
      },
    },
  })
}

/** The signed-in user, or null. Never trust a session read from cookies alone. */
export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
