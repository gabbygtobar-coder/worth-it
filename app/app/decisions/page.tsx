import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeading } from '@/components/app/page-heading'
import { DecisionList } from '@/components/decisions/decision-list'
import { Button } from '@/components/ui/button'
import { SAVED_DECISIONS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'My Decisions',
  description: 'Every decision you have analyzed, with its true cost and verdict.',
}

export default function DecisionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeading
          eyebrow="History"
          title="My Decisions"
          description="Everything you have run through the analyzer, with the verdict and true cost."
        />
        <Button render={<Link href="/app/analyze" />}>
          <Plus data-icon="inline-start" />
          New analysis
        </Button>
      </div>

      <DecisionList decisions={SAVED_DECISIONS} />
    </div>
  )
}
