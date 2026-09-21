import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeading } from '@/components/app/page-heading'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Not found',
  description: 'That decision or analysis is not available.',
}

export default function AppNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <PageHeading
        eyebrow="Not found"
        title="This page isn't here"
        description="The decision or analysis you asked for isn't available. It may have been removed, or the link is incomplete."
      />
      <div className="flex flex-wrap gap-2">
        <Button render={<Link href="/app/analyze" />} nativeButton={false}>
          Analyze a decision
        </Button>
        <Button variant="outline" render={<Link href="/app" />} nativeButton={false}>
          Home
        </Button>
      </div>
    </div>
  )
}
