import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'
import { getIcon } from '@/components/icon'

export function CategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category) => {
        const Icon = getIcon(category.icon)
        return (
        <Link
          key={category.id}
          href={`/app/analyze/${category.id}`}
          className="group flex flex-col gap-3 rounded-xl border bg-card p-5 text-left transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="font-medium">{category.label}</span>
            <span className="text-sm text-muted-foreground">{category.tagline}</span>
          </span>
          <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
            {category.question}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </Link>
        )
      })}
    </div>
  )
}
