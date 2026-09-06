import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DASHBOARD_STATS } from '@/lib/mock-data'
import { formatCurrency, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Spending going down is good, so its delta colour is inverted. */
function isGoodDelta(key: string, delta: number) {
  return key === 'spending' ? delta < 0 : delta > 0
}

export function FinancialSnapshot() {
  return (
    <section aria-labelledby="snapshot-heading" className="flex flex-col gap-3">
      <h2 id="snapshot-heading" className="font-display text-lg font-semibold tracking-tight">
        Financial snapshot
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => {
          const good = isGoodDelta(stat.key, stat.delta)
          const Arrow = stat.delta >= 0 ? TrendingUp : TrendingDown
          return (
            <Card key={stat.key}>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-display text-2xl font-semibold tabular tracking-tight">
                  {stat.kind === 'currency'
                    ? formatCurrency(stat.value)
                    : formatPercent(stat.value)}
                </p>
                <p className="flex items-center gap-1.5 text-xs">
                  <Arrow
                    className={cn('size-3.5', good ? 'text-worth' : 'text-avoid')}
                    aria-hidden
                  />
                  <span className={cn('font-medium tabular', good ? 'text-worth' : 'text-avoid')}>
                    {stat.delta > 0 ? '+' : ''}
                    {formatPercent(stat.delta)}
                  </span>
                  <span className="text-muted-foreground">{stat.deltaLabel}</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
