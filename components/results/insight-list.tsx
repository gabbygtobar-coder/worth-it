import { Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function InsightList({ insights }: { insights: string[] }) {
  if (insights.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="size-4 text-primary" aria-hidden="true" />
          What this means
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {insights.map((insight) => (
            <li key={insight} className="flex gap-3 text-sm leading-relaxed">
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
              />
              <span className="text-pretty">{insight}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
