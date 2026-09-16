import Link from 'next/link'
import { ArrowRight, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function OpportunityCard() {
  return (
    <Card className="border-primary/25 bg-primary/[0.04]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Target className="size-4" />
          </span>
          <CardTitle className="text-base">Biggest opportunity</CardTitle>
        </div>
        <CardDescription className="sr-only">
          Highest-impact change, once there is a saved analysis to highlight
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-balance">
            Nothing to highlight yet
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
            Analyze a recurring cost to see what redirecting it could be worth over time. This
            space stays empty until there is a real decision to work from.
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              10-year impact
            </p>
            <p className="mt-1 font-display text-3xl font-semibold tabular tracking-tight text-muted-foreground">
              —
            </p>
          </div>
          <Button
            render={<Link href="/app/analyze" />}
            nativeButton={false}
            size="sm"
          >
            Analyze a decision
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
