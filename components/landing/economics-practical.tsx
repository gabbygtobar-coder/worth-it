import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LEARN_TOPICS } from '@/lib/learn'
import { Button } from '@/components/ui/button'

export function EconomicsPractical() {
  return (
    <section id="economics" className="border-y border-border bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Every verdict is grounded in a named principle
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            No black box. Each analysis tells you which economic concept it applied and why, so you
            can disagree with the reasoning rather than just the answer.
          </p>
        </div>

        <dl className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
          {LEARN_TOPICS.map((topic) => (
            <div key={topic.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
              <dt className="font-medium sm:w-56 sm:shrink-0">{topic.title}</dt>
              <dd className="text-muted-foreground text-pretty">{topic.tagline}</dd>
            </div>
          ))}
        </dl>

        <Button
          render={<Link href="/app/learn" />}
          variant="outline"
          className="mt-8"
        >
          Read the concept guides
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </section>
  )
}
