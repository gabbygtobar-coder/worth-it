import Link from 'next/link'
import { ArrowRight, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BIGGEST_OPPORTUNITY } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

export function OpportunityCard() {
  return (
    <Card className="border-primary/25 bg-primary/[0.04]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Target className="size-4" />
          </span>
          <CardTitle className="text-base">Your biggest opportunity</CardTitle>
        </div>
        <CardDescription className="sr-only">
          The highest-impact change available to you right now
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-balance">
            {BIGGEST_OPPORTUNITY.title}
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
            {BIGGEST_OPPORTUNITY.detail}
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              10-year impact
            </p>
            <p className="mt-1 font-display text-3xl font-semibold tabular tracking-tight text-primary">
              {formatCurrency(BIGGEST_OPPORTUNITY.impact)}
            </p>
          </div>
          <Button
            render={<Link href="/app/analyze/subscription" />}
            nativeButton={false}
            size="sm"
          >
            {BIGGEST_OPPORTUNITY.action}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
