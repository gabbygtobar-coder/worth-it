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
import { accountInitial } from '@/lib/account-label'

export function AppHeader({
  accountName,
  accountEmail,
  signedIn,
}: {
  accountName: string
  accountEmail?: string
  signedIn: boolean
}) {
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
            aria-label="Notifications"
          >
            <Bell />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <p className="px-1.5 py-6 text-center text-sm text-muted-foreground">
              No notifications yet.
            </p>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" />}
            aria-label="Account menu"
          >
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">{accountInitial(accountName)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-foreground">{accountName}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {signedIn ? accountEmail || 'Signed in' : 'Not signed in'}
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
