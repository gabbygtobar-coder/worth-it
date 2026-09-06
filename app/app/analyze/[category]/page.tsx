import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageHeading } from '@/components/app/page-heading'
import { DecisionForm } from '@/components/analyze/decision-form'
import { CATEGORIES, getCategory } from '@/lib/categories'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const config = getCategory(category)
  if (!config) return { title: 'Analyze a Decision' }
  return { title: config.question, description: config.tagline }
}

export default async function CategoryFormPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const config = getCategory(category)
  if (!config) notFound()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/app/analyze"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All categories
        </Link>
        <PageHeading eyebrow={config.label} title={config.question} description={config.tagline} />
      </div>
      <DecisionForm
        category={{ id: config.id, steps: config.steps, fields: config.fields }}
      />
    </div>
  )
}
