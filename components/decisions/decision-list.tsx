'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { DecisionCard } from '@/components/decision-card'
import { Input } from '@/components/ui/input'
import { CATEGORY_MAP } from '@/lib/categories'
import type { SavedDecision, Verdict } from '@/lib/types'
import { VERDICT_META } from '@/lib/verdict'
import { cn } from '@/lib/utils'

const VERDICT_FILTERS: (Verdict | 'all')[] = ['all', 'worth', 'consider', 'avoid']

export function DecisionList({ decisions }: { decisions: SavedDecision[] }) {
  const [query, setQuery] = React.useState('')
  const [verdict, setVerdict] = React.useState<Verdict | 'all'>('all')

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return decisions.filter((d) => {
      if (verdict !== 'all' && d.verdict !== verdict) return false
      if (!q) return true
      const category = CATEGORY_MAP[d.categoryId]?.label ?? ''
      return (
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q)
      )
    })
  }, [decisions, query, verdict])

  if (decisions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        No saved decisions yet. Analyze a decision to start a history.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your decisions..."
            aria-label="Search decisions"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by verdict">
          {VERDICT_FILTERS.map((v) => {
            const active = verdict === v
            const label = v === 'all' ? 'All' : VERDICT_META[v].short
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVerdict(v)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          No decisions match that filter.
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {visible.length} of {decisions.length} decisions
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((d) => (
              <DecisionCard key={d.id} decision={d} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
