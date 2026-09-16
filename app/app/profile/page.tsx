import { PageHeading } from '@/components/app/page-heading'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getAccountUser } from '@/lib/account'
import { accountInitial, accountLabel } from '@/lib/account-label'

/** Sample analyzer starting values — not this signed-in user's finances. */
const SAMPLE_ASSUMPTIONS = [
  {
    label: 'Hourly income',
    value: '$28',
    help: 'Used to convert costs into work hours.',
  },
  {
    label: 'Current savings',
    value: '$6,500',
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

const PROFILE_STATS = ['Monthly income', 'Monthly spending', 'Savings rate', 'Net worth']

export default async function ProfilePage() {
  const user = await getAccountUser()
  const name = accountLabel(user)

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeading
        title="Profile"
        description="Account details and the sample defaults the analyzer can pre-fill."
      />

      <Card>
        <CardContent className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Avatar className="size-16">
            <AvatarFallback className="font-display text-xl">
              {accountInitial(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-semibold tracking-tight">{name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.email ?? 'Signed in'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial snapshot</CardTitle>
          <CardDescription>No saved figures for this account yet.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROFILE_STATS.map((label) => (
            <div key={label}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-xl font-semibold tabular tracking-tight text-muted-foreground">
                —
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Default assumptions</CardTitle>
            <Badge variant="outline">Sample</Badge>
          </div>
          <CardDescription>
            Starting values the analyzer pre-fills. They are not your saved profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {SAMPLE_ASSUMPTIONS.map((a, i) => (
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
