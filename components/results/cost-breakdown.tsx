'use client'

import { Cell, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { formatCurrency } from '@/lib/format'
import type { BreakdownSegment } from '@/lib/types'

export function CostBreakdown({
  breakdown,
  total,
}: {
  breakdown: BreakdownSegment[]
  total: number
}) {
  const segments = breakdown.filter((s) => s.amount > 0)
  const sum = segments.reduce((acc, s) => acc + s.amount, 0) || 1

  // Colors already live on each segment as `var(--chart-N)`; the config only
  // needs to supply the labels the tooltip renders.
  const config: ChartConfig = Object.fromEntries(
    segments.map((s) => [s.key, { label: s.label, color: s.color }]),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Where the money goes</CardTitle>
        <CardDescription>
          Every component of the true cost, including the parts no price tag shows.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <ChartContainer config={config} className="aspect-square w-full max-w-[220px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        {config[name as string]?.label ?? name}
                      </span>
                      <span className="font-medium tabular">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={segments}
              dataKey="amount"
              nameKey="key"
              innerRadius="58%"
              outerRadius="88%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {segments.map((segment) => (
                <Cell key={segment.key} fill={segment.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <ul className="flex w-full flex-col gap-3">
          {segments.map((segment) => (
            <li key={segment.key} className="flex items-center justify-between gap-4">
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate text-sm">{segment.label}</span>
              </span>
              <span className="flex shrink-0 items-baseline gap-2">
                <span className="text-sm font-medium tabular">
                  {formatCurrency(segment.amount)}
                </span>
                <span className="w-9 text-right text-xs text-muted-foreground tabular">
                  {Math.round((segment.amount / sum) * 100)}%
                </span>
              </span>
            </li>
          ))}
          <li className="flex items-center justify-between gap-4 border-t border-border pt-3">
            <span className="text-sm font-medium">Total</span>
            <span className="font-display text-base font-semibold tabular">
              {formatCurrency(total)}
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
