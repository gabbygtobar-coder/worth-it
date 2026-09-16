import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function ScoreCard({ greeting, name }: { greeting: string; name?: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {name ? `${greeting}, ${name}` : greeting}
          </h2>
          <p className="mt-1.5 leading-relaxed text-muted-foreground">
            Run an analysis to see the true cost of a decision. Your score will
            show up here once there is data to base it on.
          </p>

          <Button
            render={<Link href="/app/analyze" />}
            nativeButton={false}
            size="sm"
            className="mt-5"
          >
            Analyze a decision
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:gap-2">
          <div
            className="flex size-[88px] shrink-0 items-center justify-center rounded-full border border-dashed border-border"
            role="img"
            aria-label="Economic score not available yet"
          >
            <span className="font-display text-xl font-semibold tabular text-muted-foreground">
              —
            </span>
          </div>
          <div className="sm:text-center">
            <p className="text-sm font-medium">Economic Score</p>
            <p className="text-xs text-muted-foreground">Not available yet</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
