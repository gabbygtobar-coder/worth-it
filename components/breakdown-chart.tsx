'use client'

import { Cell, Pie, PieChart } from 'recharts'
import type { BreakdownSegment } from '@/lib/types'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Matches the `size-44` (11rem) wrapper below. */
const CHART_SIZE = 176

export function BreakdownChart({
  segments,
  total,
  totalLabel = 'True cost',
  className,
}: {
  segments: BreakdownSegment[]
  total: number
  totalLabel?: string
  className?: string
}) {
  const data = segments.filter((s) => s.amount > 0)
  const sum = data.reduce((acc, s) => acc + s.amount, 0) || 1

  return (
    <div className={cn('flex flex-col items-center gap-6 sm:flex-row sm:gap-8', className)}>
      {/* Fixed 176px (size-44) box with an explicitly sized chart: ResponsiveContainer
          reports -1 on first paint here, which Recharts warns about. */}
      <div className="relative size-44 shrink-0">
        <PieChart width={CHART_SIZE} height={CHART_SIZE}>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="label"
            innerRadius={62}
            outerRadius={86}
            paddingAngle={2}
            strokeWidth={0}
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
          >
            {data.map((s) => (
              <Cell key={s.key} fill={s.color} />
            ))}
          </Pie>
        </PieChart>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-muted-foreground">{totalLabel}</span>
          <span className="font-display text-2xl font-semibold tabular tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-3">
        {data.map((s) => {
          const share = Math.round((s.amount / sum) * 100)
          return (
            <li key={s.key} className="flex items-center gap-3">
              <span
                className="size-3 shrink-0 rounded-[4px]"
                style={{ backgroundColor: s.color }}
                aria-hidden
              />
              <span className="flex-1 text-sm text-foreground">{s.label}</span>
              <span className="text-sm font-medium tabular text-muted-foreground">{share}%</span>
              <span className="w-20 text-right text-sm font-semibold tabular">
                {formatCurrency(s.amount)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
