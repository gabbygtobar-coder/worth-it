import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ScoreRing } from '@/components/app/score-ring'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function ScoreCard({ greeting }: { greeting: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {greeting}
          </h2>
          <p className="mt-1.5 leading-relaxed text-muted-foreground">
            Analyze a decision to see its true cost. An economic score will show up here once there
            is real data to score — nothing is ranked or compared yet.
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
          <ScoreRing />
          <div className="sm:text-center">
            <p className="text-sm font-medium">Economic Score</p>
            <p className="text-xs text-muted-foreground">Not scored yet</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
