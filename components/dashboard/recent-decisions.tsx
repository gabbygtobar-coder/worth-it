import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DecisionCard } from '@/components/decision-card'
import { Button } from '@/components/ui/button'
import type { SavedDecision } from '@/lib/types'

const RECENT_LIMIT = 3

export function RecentDecisions({
  decisions,
  error,
}: {
  decisions: SavedDecision[]
  error?: string
}) {
  const recent = decisions.slice(0, RECENT_LIMIT)

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

      {error ? (
        <p
          className="rounded-xl border border-dashed border-destructive/40 py-12 text-center text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : recent.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          No saved decisions yet.{' '}
          <Link
            href="/app/analyze"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Analyze a decision
          </Link>{' '}
          to start a history.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recent.map((decision) => (
            <DecisionCard key={decision.id} decision={decision} />
          ))}
        </div>
      )}
    </section>
  )
}
