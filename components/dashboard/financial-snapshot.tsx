import { Card, CardContent } from '@/components/ui/card'

const SNAPSHOT_LABELS = ['Monthly income', 'Monthly spending', 'Savings rate', 'Net worth']

export function FinancialSnapshot() {
  return (
    <section aria-labelledby="snapshot-heading" className="flex flex-col gap-3">
      <h2 id="snapshot-heading" className="font-display text-lg font-semibold tracking-tight">
        Financial snapshot
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SNAPSHOT_LABELS.map((label) => (
          <Card key={label}>
            <CardContent className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-display text-2xl font-semibold tabular tracking-tight text-muted-foreground">
                —
              </p>
              <p className="text-xs text-muted-foreground">No data yet</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
