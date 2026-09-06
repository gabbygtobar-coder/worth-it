'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bell, LogOut, Search, Settings, User } from 'lucide-react'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { USER } from '@/lib/mock-data'

const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Your car analysis is 30 days old',
    detail: 'Rates changed since then, so rerun it to see the new true cost.',
  },
  {
    id: 'n2',
    title: 'Streaming bundle renews Friday',
    detail: 'You flagged this as borderline. Worth a second look.',
  },
  {
    id: 'n3',
    title: 'Savings rate up 3 points',
    detail: 'You are now saving 27% of monthly income.',
  },
]

export function AppHeader() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/app/decisions?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
      <div className="lg:hidden">
        <Logo showText={false} />
      </div>

      <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-sm" role="search">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search decisions..."
          aria-label="Search decisions"
          className="pl-9"
        />
      </form>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" />}
            aria-label={`Notifications (${NOTIFICATIONS.length} unread)`}
          >
            <span className="relative">
              <Bell />
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary ring-2 ring-background" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {NOTIFICATIONS.map((n) => (
                <DropdownMenuItem key={n.id} className="flex-col items-start gap-1 py-2.5">
                  <span className="text-sm font-medium leading-snug">{n.title}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{n.detail}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" />}
            aria-label="Account menu"
          >
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">{USER.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span>{USER.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                Economic score {USER.economicScore}/100
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/app/profile" />}>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/app/profile" />}>
                <Settings />
                Assumptions
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/" />}>
                <LogOut />
                Back to site
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
