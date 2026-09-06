import {
  BookOpen,
  Calculator,
  LayoutDashboard,
  type LucideIcon,
  Sparkles,
  User,
  Wallet,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Shown in the mobile bottom bar (space is limited). */
  primary?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/app', icon: LayoutDashboard, primary: true },
  { label: 'Analyze', href: '/app/analyze', icon: Sparkles, primary: true },
  { label: 'Calculators', href: '/app/calculators', icon: Calculator, primary: true },
  { label: 'My Decisions', href: '/app/decisions', icon: Wallet, primary: true },
  { label: 'Learn', href: '/app/learn', icon: BookOpen, primary: true },
  { label: 'Profile', href: '/app/profile', icon: User },
]

/**
 * `/app` must match exactly, otherwise it would stay active on every child
 * route. Deeper routes match on prefix so nested pages keep their nav item lit.
 */
export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === '/app') return pathname === '/app'
  return pathname === href || pathname.startsWith(`${href}/`)
}
