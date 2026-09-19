'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { PageHeading } from '@/components/app/page-heading'
import { Button } from '@/components/ui/button'

export default function AppError({
  error,
  retry,
  reset,
}: {
  error: Error & { digest?: string }
  retry?: () => void
  reset?: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const recover = retry ?? reset

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <PageHeading
        eyebrow="Something went wrong"
        title="This page could not load"
        description="Try again, or go back to a working screen."
      />
      {error.digest ? (
        <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {recover ? (
          <Button type="button" onClick={() => recover()}>
            Try again
          </Button>
        ) : null}
        <Button variant="outline" render={<Link href="/app" />} nativeButton={false}>
          Home
        </Button>
        <Button
          variant="outline"
          render={<Link href="/app/analyze" />}
          nativeButton={false}
        >
          Analyze a decision
        </Button>
      </div>
    </div>
  )
}
