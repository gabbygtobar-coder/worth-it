import { FinancialSnapshot } from '@/components/dashboard/financial-snapshot'
import { OpportunityCard } from '@/components/dashboard/opportunity-card'
import { RecentDecisions } from '@/components/dashboard/recent-decisions'
import { ScoreCard } from '@/components/dashboard/score-card'
import { WeeklyEconomics } from '@/components/dashboard/weekly-economics'

/** The greeting depends on request time, so this page can't be prerendered. */
export const dynamic = 'force-dynamic'

/**
 * Derived on the server and passed down as a prop so the value is rendered
 * once. Computing it in a client component would risk a hydration mismatch.
 */
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <ScoreCard greeting={getGreeting()} />
      <FinancialSnapshot />

      <div className="grid gap-4 lg:grid-cols-2">
        <OpportunityCard />
        <WeeklyEconomics />
      </div>

      <RecentDecisions />
    </div>
  )
}
