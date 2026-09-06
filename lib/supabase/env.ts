/**
 * Supabase environment access. Read through these helpers rather than
 * `process.env` directly so a missing variable fails with a useful message
 * instead of an opaque error from the Supabase client.
 *
 * Both values are public by design: the anon key is safe in the browser
 * because every table is guarded by Row Level Security.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export function supabaseEnv(): { url: string; anonKey: string } {
  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }
  return { url, anonKey }
}

/** Origin used to build auth redirect links. */
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
}
