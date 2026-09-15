/**
 * Allow-listed post-auth destinations. Anything else (including protocol-
 * relative and absolute URLs) falls back to /app so a `next` query can never
 * become an open redirect.
 */

/** Destinations an email link is allowed to land on. */
const AUTH_LINK_DESTINATIONS = new Set(['/app', '/reset-password'])

/**
 * Returns a same-origin pathname, or null if the value is missing or could
 * point off-site. Query and hash are stripped; `..` is rejected.
 */
function asInternalPath(value: string | null | undefined): string | null {
  if (!value) return null

  let decoded = value
  try {
    decoded = decodeURIComponent(value)
  } catch {
    return null
  }

  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null
  if (decoded.includes('\\') || decoded.includes('://') || decoded.includes('..')) {
    return null
  }

  const pathname = decoded.split(/[?#]/)[0]
  if (!pathname.startsWith('/') || pathname.startsWith('//')) return null

  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

/**
 * Dashboard, profile, and saved-decision surfaces. `/app` is exact so public
 * children such as `/app/analyze` are not treated as private.
 */
export function isProtectedAppPath(pathname: string): boolean {
  const path = asInternalPath(pathname)
  if (!path) return false
  if (path === '/app') return true
  if (path === '/app/profile' || path.startsWith('/app/profile/')) return true
  if (path === '/app/decisions' || path.startsWith('/app/decisions/')) return true
  return false
}

/**
 * Login `next` return path. Only the protected app surfaces are allowed so a
 * guest sent to /login comes back to the page they asked for, and nowhere else.
 */
export function safeNext(value: string | null | undefined): string {
  const pathname = asInternalPath(value)
  if (pathname && isProtectedAppPath(pathname)) return pathname
  return '/app'
}

/**
 * Where an email link is allowed to drop the user. Same allow-list pattern as
 * `safeNext`, with a tighter destination set.
 */
export function safeAuthLinkNext(value: string | null | undefined): string {
  const pathname = asInternalPath(value)
  if (pathname && AUTH_LINK_DESTINATIONS.has(pathname)) return pathname
  return '/app'
}
