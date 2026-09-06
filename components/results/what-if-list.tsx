import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import type { WhatIfScenario } from '@/lib/types'
import { VERDICT_META } from '@/lib/verdict'
import { cn } from '@/lib/utils'

export function WhatIfList({ scenarios }: { scenarios: WhatIfScenario[] }) {
  if (scenarios.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>What if you changed one thing?</CardTitle>
        <CardDescription>
          The same decision under different assumptions, so you can see which lever matters most.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {scenarios.map((scenario) => {
            const meta = VERDICT_META[scenario.verdict]
            const saves = scenario.delta < 0
            const flat = scenario.delta === 0
            const Icon = flat ? Minus : saves ? ArrowDownRight : ArrowUpRight

            return (
              <li
                key={scenario.id}
                className="flex flex-col gap-3 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{scenario.label}</span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                        meta.badge,
                      )}
                    >
                      <span className={cn('size-1.5 rounded-full', meta.dot)} aria-hidden="true" />
                      {meta.short}
                    </span>
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground text-pretty">
                    {scenario.description}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-0.5">
                  <span className="font-display text-lg font-semibold tabular tracking-tight">
                    {formatCurrency(scenario.trueCost)}
                  </span>
                  <span
                    className={cn(
                      'flex items-center gap-1 text-sm font-medium tabular',
                      flat ? 'text-muted-foreground' : saves ? 'text-worth' : 'text-avoid',
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {flat
                      ? 'No change'
                      : `${saves ? 'Saves ' : 'Costs '}${formatCurrency(Math.abs(scenario.delta))}`}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
