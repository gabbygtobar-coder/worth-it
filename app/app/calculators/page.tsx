import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeading } from '@/components/app/page-heading'
import { getIcon } from '@/components/icon'
import { Card, CardContent } from '@/components/ui/card'
import { CALCULATORS } from '@/lib/calculators'

export const metadata: Metadata = {
  title: 'Calculators',
  description: 'Focused calculators for the economics behind everyday money decisions.',
}

export default function CalculatorsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        eyebrow="Tools"
        title="Calculators"
        description="Single-purpose tools when you want one number, not a full analysis."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CALCULATORS.map((calc) => {
          const Icon = getIcon(calc.icon)
          // Only calculators backed by an analyzer category can deep-link into one.
          const href = calc.categoryId ? `/app/analyze/${calc.categoryId}` : '/app/analyze'
          return (
            <Card key={calc.id} className="group transition-colors hover:border-primary/40">
              <CardContent className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground">
                    {calc.concept}
                  </span>
                </div>

                <h2 className="font-medium leading-snug">
                  <Link href={href} className="hover:underline">
                    {calc.name}
                  </Link>
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{calc.description}</p>

                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
                  Open
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
