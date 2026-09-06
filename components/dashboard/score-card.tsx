import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ScoreRing } from '@/components/app/score-ring'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { USER } from '@/lib/mock-data'

const DRIVERS = [
  { label: 'Savings rate', state: 'strong' as const },
  { label: 'Debt load', state: 'strong' as const },
  { label: 'Fixed costs', state: 'watch' as const },
]

export function ScoreCard({ greeting }: { greeting: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {greeting}, {USER.name}
          </h2>
          <p className="mt-1.5 leading-relaxed text-muted-foreground">
            Your economic score is holding steady. Fixed costs are the one thing worth trimming.
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {DRIVERS.map((d) => (
              <li
                key={d.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                <span
                  className={
                    d.state === 'strong' ? 'size-1.5 rounded-full bg-worth' : 'size-1.5 rounded-full bg-consider'
                  }
                  aria-hidden
                />
                {d.label}
              </li>
            ))}
          </ul>

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
          <ScoreRing score={USER.economicScore} />
          <div className="sm:text-center">
            <p className="text-sm font-medium">Economic Score</p>
            <p className="text-xs text-muted-foreground">Top 18% of your age group</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
