import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="rounded-xl border border-border bg-primary px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance text-primary-foreground sm:text-4xl">
            Put a number on your next decision
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 text-pretty">
            No account and no spreadsheet required.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              render={<Link href="/app/analyze" />}
              nativeButton={false}
              size="lg"
              variant="secondary"
            >
              Analyze a Decision
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              render={<Link href="/app" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              Explore the dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
