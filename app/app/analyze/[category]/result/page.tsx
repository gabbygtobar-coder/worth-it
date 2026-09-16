import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VerdictHero } from '@/components/results/verdict-hero'
import { MetricGrid } from '@/components/results/metric-grid'
import { CostBreakdown } from '@/components/results/cost-breakdown'
import { InsightList } from '@/components/results/insight-list'
import { WhatIfList } from '@/components/results/what-if-list'
import { AssumptionsNote } from '@/components/results/assumptions-note'
import { SaveDecisionButton } from '@/components/results/save-decision-button'
import { getCategory } from '@/lib/categories'
import { valuesFromParams } from '@/lib/decision-params'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { getUser } from '@/lib/supabase/server'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export const metadata: Metadata = {
  title: 'Your Result',
  description: 'The true economic cost of your decision.',
}

export default async function ResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: SearchParams
}) {
  const { category } = await params
  const config = getCategory(category)
  if (!config) notFound()

  const values = valuesFromParams(config, await searchParams)
  const result = config.analyze(values)
  const user = isSupabaseConfigured ? await getUser() : null

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/app/analyze/${config.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Edit inputs
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <SaveDecisionButton signedIn={Boolean(user)} categoryId={config.id} values={values} />
          <Button variant="outline" size="sm" render={<Link href="/app/analyze" />}>
            <RotateCcw data-icon="inline-start" />
            New analysis
          </Button>
        </div>
      </div>

      <VerdictHero result={result} />
      <MetricGrid metrics={result.metrics} />
      <CostBreakdown breakdown={result.breakdown} total={result.trueCost} />

      <div className="grid gap-6 lg:grid-cols-2">
        <InsightList insights={result.insights} />
        <AssumptionsNote />
      </div>

      <WhatIfList scenarios={result.whatIfs} />
    </div>
  )
}
