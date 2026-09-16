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
          Opportunities appear after you analyze a decision
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p className="leading-relaxed text-muted-foreground text-pretty">
          Analyze a decision to see where a change would matter most. Nothing is
          queued up yet.
        </p>

        <Button
          render={<Link href="/app/analyze" />}
          nativeButton={false}
          size="sm"
          className="w-fit"
        >
          Analyze a decision
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  )
}
