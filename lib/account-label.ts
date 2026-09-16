import type { User } from '@supabase/supabase-js'

/** Name shown in the signed-in shell. Never falls back to mock persona data. */
export function accountLabel(user: User | null | undefined): string {
  const meta = user?.user_metadata
  const fromMeta = [meta?.display_name, meta?.full_name, meta?.name]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .find(Boolean)
  if (fromMeta) return fromMeta

  const email = user?.email?.trim()
  if (email) return email.split('@')[0] || email

  return 'Account'
}

export function accountFirstName(label: string): string {
  return label.split(/\s+/)[0] || label
}

export function accountInitial(label: string): string {
  const ch = label.trim().charAt(0)
  return ch ? ch.toUpperCase() : '?'
}
