import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { ExampleDecisions } from '@/components/landing/example-decisions'
import { EconomicsPractical } from '@/components/landing/economics-practical'
import { ExampleCard } from '@/components/landing/example-card'
import { CtaSection } from '@/components/landing/cta'
import { SiteFooter } from '@/components/landing/site-footer'

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <ExampleDecisions />
        <EconomicsPractical />
        <ExampleCard />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
