import Link from 'next/link'
import { ArrowUpRight, Car, Home, Repeat, CreditCard, Briefcase } from 'lucide-react'

const EXAMPLES = [
  { q: 'Should I buy this car?', icon: Car, href: '/app/analyze/car' },
  { q: 'Can I afford this apartment?', icon: Home, href: '/app/analyze/housing' },
  { q: 'Is this subscription worth it?', icon: Repeat, href: '/app/analyze/subscription' },
  { q: 'Should I pay off my debt?', icon: CreditCard, href: '/app/analyze/debt' },
  { q: 'Is this job actually better?', icon: Briefcase, href: '/app/analyze/job' },
]

export function ExampleDecisions() {
  return (
    <section id="examples" className="border-y border-border bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Example decisions</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            The questions WorthIt was built to answer
          </h2>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {EXAMPLES.map((e) => (
            <Link
              key={e.q}
              href={e.href}
              className="group inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <e.icon className="size-4 text-primary" />
              {e.q}
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
