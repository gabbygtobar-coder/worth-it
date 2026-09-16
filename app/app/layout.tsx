import type { Metadata } from 'next'
import { AppHeader } from '@/components/app/app-header'
import { AppSidebar } from '@/components/app/app-sidebar'
import { MobileNav } from '@/components/app/mobile-nav'
import { getAccountUser } from '@/lib/account'
import { accountLabel } from '@/lib/account-label'

export const metadata: Metadata = {
  title: 'WorthIt Dashboard',
  description: 'Analyze the true economic cost of your everyday financial decisions.',
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getAccountUser()
  const name = accountLabel(user)

  return (
    <div className="flex min-h-svh bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          accountName={name}
          accountEmail={user?.email ?? undefined}
          signedIn={Boolean(user)}
        />
        {/* Bottom padding clears the fixed mobile nav. */}
        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
