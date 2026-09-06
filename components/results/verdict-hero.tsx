import { formatCurrency } from '@/lib/format'
import type { AnalysisResult } from '@/lib/types'
import { VERDICT_META } from '@/lib/verdict'
import { cn } from '@/lib/utils'

export function VerdictHero({ result }: { result: AnalysisResult }) {
  const meta = VERDICT_META[result.verdict]
  const premium = result.trueCost - result.facePrice
  const multiple = result.facePrice > 0 ? result.trueCost / result.facePrice : 0

  return (
    <section
      className={cn(
        'flex flex-col gap-6 rounded-xl border bg-card p-6 ring-1 ring-inset sm:p-8',
        meta.ring,
      )}
      aria-labelledby="verdict-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <span
            className={cn(
              'inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
              meta.badge,
            )}
          >
            <span className={cn('size-2 rounded-full', meta.dot)} aria-hidden="true" />
            {meta.label}
          </span>
          <h2
            id="verdict-heading"
            className="font-display text-xl font-semibold tracking-tight text-balance sm:text-2xl"
          >
            {result.title}
          </h2>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-sm text-muted-foreground">{result.costLabel}</p>
          <p className="font-display text-4xl font-semibold tabular tracking-tight sm:text-5xl">
            {formatCurrency(result.trueCost)}
          </p>
          {result.facePrice > 0 && premium !== 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCurrency(result.facePrice)} sticker
              <span aria-hidden="true"> · </span>
              <span className={premium > 0 ? 'text-avoid' : 'text-worth'}>
                {premium > 0 ? '+' : ''}
                {formatCurrency(premium)} hidden
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <p className="max-w-2xl leading-relaxed text-pretty">{result.verdictReason}</p>

      {multiple > 1.05 ? (
        <p className="border-t border-border pt-4 text-sm text-muted-foreground">
          You&apos;re really paying{' '}
          <span className="font-medium text-foreground">{multiple.toFixed(2)}&times;</span> the
          advertised price once every hidden cost is counted.
        </p>
      ) : null}
    </section>
  )
}
