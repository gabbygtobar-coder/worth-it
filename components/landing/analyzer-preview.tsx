import { BreakdownChart } from '@/components/breakdown-chart'
import { VerdictBadge } from '@/components/verdict-badge'
import { getCategory } from '@/lib/categories'
import { formatCurrency } from '@/lib/format'

/**
 * A static, realistic snapshot of the Decision Analyzer result screen,
 * used as the hero visual on the landing page.
 */
export function AnalyzerPreview() {
  const purchase = getCategory('purchase')!
  const result = purchase.analyze({
    item: 'MacBook Air',
    price: 1099,
    frequency: 'once',
    usefulLife: 4,
    hourlyIncome: 28,
    currentSavings: 6500,
    alternative: 749,
  })

  return (
    <div className="w-full rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Decision analysis
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-balance">
            Should I buy this MacBook Air?
          </h3>
        </div>
        <VerdictBadge verdict={result.verdict} size="sm" />
      </div>

      <div className="mt-5 rounded-lg bg-muted/60 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">True cost</p>
            <p className="font-display text-3xl font-semibold tabular tracking-tight">
              {formatCurrency(result.trueCost)}
            </p>
          </div>
          <p className="text-right text-xs text-muted-foreground">
            Sticker price
            <br />
            <span className="text-sm font-medium text-foreground tabular">
              {formatCurrency(result.facePrice)}
            </span>
          </p>
        </div>
        <div className="mt-5">
          <BreakdownChart
            segments={result.breakdown}
            total={result.trueCost}
            totalLabel="True cost"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {result.metrics.slice(0, 4).map((m) => (
          <div key={m.label} className="rounded-xl border border-border/70 bg-background p-3">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="mt-0.5 font-medium tabular">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
