import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareCard } from '@/components/share-card'

const POINTS = [
  'A single true-cost number, not a wall of line items',
  'Opportunity cost measured against real market returns',
  'A shareable card to settle the debate with friends',
]

export function ExampleCard() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <p className="text-sm font-medium text-primary">Example decision card</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Every analysis becomes a card worth sharing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Turn a big purchase into a clear, screenshot-ready verdict, the kind you actually send
            to a friend before pulling the trigger.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-worth-muted text-worth">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm leading-relaxed text-foreground">{p}</span>
              </li>
            ))}
          </ul>

          <Button
            render={<Link href="/app/analyze/car" />}
            nativeButton={false}
            className="mt-8"
          >
            Analyze a car decision
          </Button>
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <ShareCard
            data={{
              headline: 'I analyzed a $25,000 car.',
              costLabel: 'True 5-year cost',
              trueCost: 34820,
              secondaryLabel: 'Opportunity cost',
              secondaryValue: 8240,
              verdict: 'avoid',
            }}
          />
        </div>
      </div>
    </section>
  )
}
