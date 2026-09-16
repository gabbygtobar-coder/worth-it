import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeading } from '@/components/app/page-heading'
import { DecisionList } from '@/components/decisions/decision-list'
import { Button } from '@/components/ui/button'
import { listSavedDecisions } from '@/lib/decisions'

export const metadata: Metadata = {
  title: 'My Decisions',
  description: 'Every decision you have analyzed, with its true cost and verdict.',
}

export const dynamic = 'force-dynamic'

export default async function DecisionsPage() {
  const { decisions, error } = await listSavedDecisions()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeading
          eyebrow="History"
          title="My Decisions"
          description="Analyses you save from a result page show up here. Only you can see them."
        />
        <Button render={<Link href="/app/analyze" />}>
          <Plus data-icon="inline-start" />
          New analysis
        </Button>
      </div>

      {error ? (
        <p
          className="rounded-xl border border-dashed border-destructive/40 py-12 text-center text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : (
        <DecisionList decisions={decisions} />
      )}
    </div>
  )
}
