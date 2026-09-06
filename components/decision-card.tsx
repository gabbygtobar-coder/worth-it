import Link from 'next/link'
import { CATEGORY_MAP } from '@/lib/categories'
import { formatCurrency, relativeDate } from '@/lib/format'
import type { SavedDecision } from '@/lib/types'
import { VERDICT_META } from '@/lib/verdict'
import { getIcon } from '@/components/icon'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function DecisionCard({ decision }: { decision: SavedDecision }) {
  const category = CATEGORY_MAP[decision.categoryId]
  const Icon = getIcon(category.icon)
  const verdict = VERDICT_META[decision.verdict]

  return (
    <Card className="group transition-colors hover:border-primary/40">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
              verdict.badge,
            )}
          >
            <span className={cn('size-1.5 rounded-full', verdict.dot)} aria-hidden />
            {verdict.short}
          </span>
        </div>

        <div>
          <h3 className="font-medium leading-snug text-balance">
            <Link href={`/app/decisions/${decision.id}`} className="hover:underline">
              {decision.title}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {category.label} · {relativeDate(decision.date)}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {decision.summary}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <div>
            <p className="text-xs text-muted-foreground">True cost</p>
            <p className="font-display text-lg font-semibold tabular tracking-tight">
              {formatCurrency(decision.trueCost)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            vs {formatCurrency(decision.facePrice)} sticker
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
