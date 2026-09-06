import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'
import { Button } from '@/components/ui/button'
import { AnalyzerPreview } from './analyzer-preview'

export function Hero() {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24">
        <div className="flex flex-col items-start">
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Understand what your decisions{' '}
            <span className="text-primary">really cost.</span>
          </h1>

          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            WorthIt turns everyday money decisions into clear economic tradeoffs: opportunity cost,
            compounding, depreciation, and work time, all in one number. It is not a budget app and
            it does not track your spending.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              render={<Link href="/app/analyze" />}
              nativeButton={false}
              size="lg"
            >
              Analyze a Decision
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              render={<a href="#how-it-works" />}
              nativeButton={false}
              size="lg"
              variant="outline"
            >
              See How It Works
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            <span className="font-medium text-foreground tabular">{CATEGORIES.length}</span>{' '}
            decision types, from a one-off purchase to a job offer.
          </p>
        </div>

        <div className="relative">
          <AnalyzerPreview />
        </div>
      </div>
    </section>
  )
}
