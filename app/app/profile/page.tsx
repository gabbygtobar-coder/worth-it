import { PageHeading } from '@/components/app/page-heading'
import { ScoreRing } from '@/components/app/score-ring'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { USER } from '@/lib/mock-data'
import { formatCurrency, formatPercent } from '@/lib/format'

/** Defaults the analyzer pre-fills so users don't retype them every time. */
const ASSUMPTIONS = [
  {
    label: 'Hourly income',
    value: formatCurrency(USER.hourlyIncome),
    help: 'Used to convert costs into work hours.',
  },
  {
    label: 'Current savings',
    value: formatCurrency(USER.currentSavings),
    help: 'Compared against purchases to judge affordability.',
  },
  {
    label: 'Expected market return',
    value: '7% / yr',
    help: 'The baseline for every opportunity-cost calculation.',
  },
  {
    label: 'Assumed inflation',
    value: '3% / yr',
    help: 'Used when comparing costs across future years.',
  },
]

const PROFILE_STATS = [
  { label: 'Monthly income', value: formatCurrency(USER.monthlyIncome) },
  { label: 'Monthly spending', value: formatCurrency(USER.monthlySpending) },
  { label: 'Savings rate', value: formatPercent(USER.savingsRate) },
  { label: 'Net worth', value: formatCurrency(USER.netWorth) },
]

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeading
        title="Profile"
        description="The numbers WorthIt uses as a starting point for every analysis."
      />

      <Card>
        <CardContent className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Avatar className="size-16">
            <AvatarFallback className="font-display text-xl">
              {USER.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-semibold tracking-tight">{USER.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Building better financial instincts, one decision at a time.
            </p>
          </div>
          <ScoreRing score={USER.economicScore} size={76} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial snapshot</CardTitle>
          <CardDescription>A summary of where you stand today.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROFILE_STATS.map((s) => (
            <div key={s.label}>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-xl font-semibold tabular tracking-tight">
                {s.value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default assumptions</CardTitle>
          <CardDescription>
            Every analysis starts from these. You can override them per decision.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {ASSUMPTIONS.map((a, i) => (
            <div key={a.label} className="flex flex-col">
              {i > 0 && <Separator className="my-4" />}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium">{a.label}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{a.help}</p>
                </div>
                <p className="shrink-0 font-display font-semibold tabular">{a.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
