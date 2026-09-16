import { PageHeading } from '@/components/app/page-heading'
import { ScoreRing } from '@/components/app/score-ring'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

/** Product-wide calculation defaults. Not a saved picture of this user. */
const ASSUMPTIONS = [
  {
    label: 'Hourly income',
    value: 'Set per analysis',
    help: 'Used to convert costs into work hours. Entered on each decision form.',
  },
  {
    label: 'Current savings',
    value: 'Set per analysis',
    help: 'Compared against purchases to judge affordability. Entered on each decision form.',
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
  { label: 'Monthly income' },
  { label: 'Monthly spending' },
  { label: 'Savings rate' },
  { label: 'Net worth' },
]

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeading
        title="Profile"
        description="Starting points for the analyzer. These are not a saved picture of your finances."
      />

      <Card>
        <CardContent className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Avatar className="size-16">
            <AvatarFallback className="font-display text-xl">A</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-semibold tracking-tight">Account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No personal totals or economic score are stored yet.
            </p>
          </div>
          <ScoreRing size={76} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial snapshot</CardTitle>
          <CardDescription>No personal totals yet.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROFILE_STATS.map((s) => (
            <div key={s.label}>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-xl font-semibold tabular tracking-tight">—</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default assumptions</CardTitle>
          <CardDescription>
            Product-wide starting points. Override them on each decision.
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
