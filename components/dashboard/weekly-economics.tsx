'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { WEEKLY_ACTIVITY } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

const chartConfig = {
  spending: { label: 'Spent', color: 'var(--chart-2)' },
  saved: { label: 'Saved', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function WeeklyEconomics() {
  const totalSpent = WEEKLY_ACTIVITY.reduce((a, d) => a + d.spending, 0)
  const totalSaved = WEEKLY_ACTIVITY.reduce((a, d) => a + d.saved, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Weekly economics</CardTitle>
          <Badge variant="outline">Sample</Badge>
        </div>
        <CardDescription>
          Illustrative week · {formatCurrency(totalSpent)} spent ·{' '}
          {formatCurrency(totalSaved)} saved
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
          <BarChart data={WEEKLY_ACTIVITY} margin={{ left: 0, right: 0, top: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="saved" fill="var(--color-saved)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spending" fill="var(--color-spending)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
