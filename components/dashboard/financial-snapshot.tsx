import { Card, CardContent } from '@/components/ui/card'

const STAT_LABELS = [
  { key: 'income', label: 'Monthly income' },
  { key: 'spending', label: 'Monthly spending' },
  { key: 'savings', label: 'Savings rate' },
  { key: 'networth', label: 'Net worth' },
]

export function FinancialSnapshot() {
  return (
    <section aria-labelledby="snapshot-heading" className="flex flex-col gap-3">
      <h2 id="snapshot-heading" className="font-display text-lg font-semibold tracking-tight">
        Financial snapshot
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_LABELS.map((stat) => (
          <Card key={stat.key}>
            <CardContent className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="font-display text-2xl font-semibold tabular tracking-tight">—</p>
              <p className="text-xs text-muted-foreground">No data yet</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
