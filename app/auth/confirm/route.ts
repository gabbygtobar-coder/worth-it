import { handleAuthLink } from '@/app/auth/verify-link'

/**
 * Same handler as /auth/callback. Supabase's own Next.js guide ships email
 * templates that point at /auth/confirm, so both paths answer here instead of
 * dead ending on a 404 if a template uses that form.
 */
export const GET = handleAuthLink
