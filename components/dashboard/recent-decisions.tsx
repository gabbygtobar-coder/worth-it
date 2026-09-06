import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DecisionCard } from '@/components/decision-card'
import { Button } from '@/components/ui/button'
import { SAVED_DECISIONS } from '@/lib/mock-data'

export function RecentDecisions() {
  const recent = SAVED_DECISIONS.slice(0, 3)

  return (
    <section aria-labelledby="recent-heading" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <h2 id="recent-heading" className="font-display text-lg font-semibold tracking-tight">
          Recent decisions
        </h2>
        <Button
          render={<Link href="/app/decisions" />}
          nativeButton={false}
          variant="ghost"
          size="sm"
        >
          View all
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {recent.map((d) => (
          <DecisionCard key={d.id} decision={d} />
        ))}
      </div>
    </section>
  )
}
