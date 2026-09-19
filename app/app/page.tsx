import { FinancialSnapshot } from '@/components/dashboard/financial-snapshot'
import { OpportunityCard } from '@/components/dashboard/opportunity-card'
import { RecentDecisions } from '@/components/dashboard/recent-decisions'
import { ScoreCard } from '@/components/dashboard/score-card'
import { listSavedDecisions } from '@/lib/decisions'

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

export default async function DashboardPage() {
  const { decisions, error } = await listSavedDecisions()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <ScoreCard greeting={getGreeting()} />
      <FinancialSnapshot />
      <OpportunityCard />
      <RecentDecisions decisions={decisions} error={error} />
    </div>
  )
}
