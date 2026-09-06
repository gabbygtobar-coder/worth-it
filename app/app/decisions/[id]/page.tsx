import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { PageHeading } from '@/components/app/page-heading'
import { ShareableCard } from '@/components/decisions/shareable-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CATEGORY_MAP } from '@/lib/categories'
import { formatCurrency, formatDate } from '@/lib/format'
import { SAVED_DECISIONS } from '@/lib/mock-data'

export function generateStaticParams() {
  return SAVED_DECISIONS.map((d) => ({ id: d.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const decision = SAVED_DECISIONS.find((d) => d.id === id)
  if (!decision) return { title: 'Decision' }
  return { title: decision.title, description: decision.summary }
}

export default async function DecisionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const decision = SAVED_DECISIONS.find((d) => d.id === id)
  if (!decision) notFound()

  const category = CATEGORY_MAP[decision.categoryId]
  const hidden = decision.trueCost - decision.facePrice

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/app/decisions"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          My Decisions
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <PageHeading
            eyebrow={`${category.label} · ${formatDate(decision.date)}`}
            title={decision.title}
            description={decision.summary}
          />
          <Button
            variant="outline"
            render={<Link href={`/app/analyze/${decision.categoryId}`} />}
          >
            <RefreshCw data-icon="inline-start" />
            Re-run analysis
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,20rem)]">
        <Card>
          <CardHeader>
            <CardTitle>Cost summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              { label: 'Sticker price', value: formatCurrency(decision.facePrice) },
              {
                label: 'Hidden costs',
                value: hidden > 0 ? `+${formatCurrency(hidden)}` : formatCurrency(0),
                emphasis: hidden > 0,
              },
              { label: 'True cost', value: formatCurrency(decision.trueCost), total: true },
            ].map((row) => (
              <div
                key={row.label}
                className={
                  row.total
                    ? 'flex items-center justify-between border-t border-border pt-4'
                    : 'flex items-center justify-between'
                }
              >
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span
                  className={
                    row.total
                      ? 'font-display text-xl font-semibold tabular tracking-tight'
                      : row.emphasis
                        ? 'text-sm font-medium tabular text-destructive'
                        : 'text-sm font-medium tabular'
                  }
                >
                  {row.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">Share this result</h2>
          <ShareableCard decision={decision} />
        </div>
      </div>
    </div>
  )
}
