import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RecentDecisions() {
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

      <p className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
        No saved decisions yet.
      </p>
    </section>
  )
}
