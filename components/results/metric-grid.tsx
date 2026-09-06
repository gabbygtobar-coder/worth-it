import type { Metric } from '@/lib/types'
import { cn } from '@/lib/utils'

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={cn(
            'flex flex-col gap-1 rounded-xl border bg-card p-4',
            metric.emphasis && 'border-primary/40 bg-primary/5',
          )}
        >
          <dt className="text-sm text-muted-foreground">{metric.label}</dt>
          <dd className="font-display text-xl font-semibold tabular tracking-tight">
            {metric.value}
          </dd>
          {metric.hint ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{metric.hint}</p>
          ) : null}
        </div>
      ))}
    </dl>
  )
}
