'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Examples', href: '#examples' },
  { label: 'Concepts', href: '#economics' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            render={<Link href="/login" />}
            nativeButton={false}
            variant="ghost"
            className="hidden sm:inline-flex"
          >
            Open app
          </Button>
          <Button render={<Link href="/app/analyze" />} nativeButton={false}>
            Analyze a Decision
          </Button>
        </div>
      </div>
    </header>
  )
}
