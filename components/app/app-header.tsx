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
import { signOut } from '@/app/auth/actions'

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
            aria-label="Notifications"
          >
            <Bell />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
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
              <AvatarFallback className="text-xs">
                <User className="size-3.5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
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
            <form action={signOut}>
              <DropdownMenuItem
                nativeButton={true}
                closeOnClick={false}
                render={<button type="submit" />}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
