import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ASSUMPTIONS } from '@/lib/economics'
import { formatPercent } from '@/lib/format'

/** Shows the economic assumptions behind every calculation so the numbers are
 *  auditable rather than magic. */
export function AssumptionsNote() {
  const rows = [
    {
      label: 'Investment return',
      value: formatPercent(ASSUMPTIONS.investmentReturn),
      note: 'Long-run real return on a broad index fund, the basis for opportunity cost.',
    },
    {
      label: 'Inflation',
      value: formatPercent(ASSUMPTIONS.inflation),
      note: 'Listed for reference. Category formulas currently use nominal dollars; the realValue helper is unused.',
    },
    {
      label: 'Work year',
      value: `${ASSUMPTIONS.workWeeksPerYear} × ${ASSUMPTIONS.weeklyWorkHours} hrs`,
      note: 'Weekly commute and hours annualize over 50 work weeks (2,000 hours), not 52×40.',
    },
    {
      label: 'Work time',
      value: 'Your hourly rate',
      note: 'Costs are converted into working hours using the income you entered.',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Our assumptions</CardTitle>
        <CardDescription>
          No hidden math. Here is exactly what the model assumes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-4">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-sm font-medium">{row.label}</dt>
                <dd className="text-sm font-semibold tabular">{row.value}</dd>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{row.note}</p>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
