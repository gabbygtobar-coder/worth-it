import { handleAuthLink } from '@/app/auth/verify-link'

/** Target of the `emailRedirectTo` and `redirectTo` values we send Supabase. */
export const GET = handleAuthLink
