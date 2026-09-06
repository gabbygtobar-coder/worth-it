import Link from 'next/link'
import { Logo } from '@/components/logo'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Understand what your decisions really cost.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground" aria-label="Footer">
          <Link href="/app" className="hover:text-foreground">Dashboard</Link>
          <Link href="/app/analyze" className="hover:text-foreground">Analyze</Link>
          <Link href="/app/calculators" className="hover:text-foreground">Calculators</Link>
          <Link href="/app/learn" className="hover:text-foreground">Learn</Link>
        </nav>
      </div>
      <div className="border-t border-border py-4">
        <p className="mx-auto w-full max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
          WorthIt is an educational tool. Estimates use standard economic assumptions and are not
          financial advice.
        </p>
      </div>
    </footer>
  )
}
