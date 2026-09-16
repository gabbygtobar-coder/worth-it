import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeading } from '@/components/app/page-heading'
import { DecisionList } from '@/components/decisions/decision-list'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'My Decisions',
  description: 'Saved analyses will appear here.',
}

export default function DecisionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeading
          eyebrow="History"
          title="My Decisions"
          description="Saved analyses will appear here. Nothing is stored for this account yet."
        />
        <Button render={<Link href="/app/analyze" />}>
          <Plus data-icon="inline-start" />
          New analysis
        </Button>
      </div>

      <DecisionList decisions={[]} />
    </div>
  )
}
