import Link from 'next/link'
import { Logo } from '@/components/logo'

/**
 * Shared frame for the auth screens: brand mark, a single narrow card column,
 * and one trailing link. Matches the layout the sign-in page already used.
 */
export function AuthShell({
  children,
  footer,
}: {
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-12">
      <Logo />

      <div className="w-full max-w-sm">{children}</div>

      {footer ?? (
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Back to home
        </Link>
      )}
    </main>
  )
}
