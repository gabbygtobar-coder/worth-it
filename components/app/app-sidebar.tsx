'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { NAV_ITEMS, isNavItemActive } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-6 border-r border-border bg-card px-4 py-5 lg:flex">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="flex flex-col gap-1" aria-label="Main">
        {NAV_ITEMS.map((item) => {
          const active = isNavItemActive(item.href, pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-border bg-background p-4">
        <p className="text-sm font-medium">Weighing something up?</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Run it through the analyzer before you commit.
        </p>
        <Button
          render={<Link href="/app/analyze" />}
          nativeButton={false}
          size="sm"
          className="mt-3 w-full"
        >
          New analysis
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </aside>
  )
}
