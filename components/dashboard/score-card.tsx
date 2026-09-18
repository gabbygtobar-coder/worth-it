import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function ScoreCard({ greeting }: { greeting: string }) {
  return (
    <Card>
      <CardContent>
        <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          {greeting}
        </h2>
        <p className="mt-1.5 leading-relaxed text-muted-foreground">
          Analyze a decision to see its true cost.
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
      </CardContent>
    </Card>
  )
}
