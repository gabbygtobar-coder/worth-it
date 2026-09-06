import type { Metadata } from 'next'
import { PageHeading } from '@/components/app/page-heading'
import { CategoryGrid } from '@/components/analyze/category-grid'

export const metadata: Metadata = {
  title: 'Analyze a Decision',
  description: 'See the true economic cost before you decide.',
}

export default function AnalyzePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Analyze a Decision"
        description="See the true economic cost before you decide."
      />
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          What kind of decision is it?
        </h2>
        <CategoryGrid />
      </div>
    </div>
  )
}
