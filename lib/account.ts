import { isSupabaseConfigured } from '@/lib/supabase/env'
import { getUser } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

/**
 * Signed-in user for shell copy (greeting, avatar). Returns null when auth is
 * off or nobody is signed in. Does not load profile or decision data.
 */
export async function getAccountUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null
  return getUser()
}
