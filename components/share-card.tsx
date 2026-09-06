import { Logo } from '@/components/logo'
import { formatCurrency } from '@/lib/format'
import { VERDICT_META } from '@/lib/verdict'
import { cn } from '@/lib/utils'
import type { Verdict } from '@/lib/types'

export interface ShareCardData {
  headline: string
  costLabel: string
  trueCost: number
  secondaryLabel: string
  secondaryValue: number
  verdict: Verdict
}

export function ShareCard({ data, className }: { data: ShareCardData; className?: string }) {
  const meta = VERDICT_META[data.verdict]
  return (
    <div
      className={cn(
        'relative flex aspect-[4/5] w-full max-w-sm flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-7',
        className,
      )}
    >
      <div
        className={cn('pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.07]', meta.dot)}
        aria-hidden
      />

      <div className="flex items-center justify-between">
        {/* Static mark: the card is a shareable artifact and is often nested in a link. */}
        <Logo href="" />
        <span className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium', meta.badge)}>
          <span className={cn('size-2 rounded-full', meta.dot)} aria-hidden />
          {meta.label}
        </span>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">I analyzed</p>
        <p className="mt-1 font-display text-2xl font-semibold leading-tight tracking-tight text-balance">
          {data.headline}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {data.costLabel}
          </p>
          <p className="mt-1 font-display text-3xl font-semibold tabular tracking-tight">
            {formatCurrency(data.trueCost)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {data.secondaryLabel}
          </p>
          <p className={cn('mt-1 font-display text-3xl font-semibold tabular tracking-tight', meta.text)}>
            {formatCurrency(data.secondaryValue)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <p className={cn('font-display text-lg font-semibold', meta.text)}>{meta.label}</p>
        <p className="text-sm font-medium text-muted-foreground">Analyze your own →</p>
      </div>
    </div>
  )
}
