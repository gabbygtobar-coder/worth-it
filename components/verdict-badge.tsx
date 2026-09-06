import { cn } from '@/lib/utils'
import type { Verdict } from '@/lib/types'
import { VERDICT_META } from '@/lib/verdict'

export function VerdictBadge({
  verdict,
  size = 'default',
  className,
}: {
  verdict: Verdict
  size?: 'sm' | 'default' | 'lg'
  className?: string
}) {
  const meta = VERDICT_META[verdict]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-medium',
        meta.badge,
        size === 'sm' && 'px-2.5 py-0.5 text-xs',
        size === 'default' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-4 py-1.5 text-base',
        className,
      )}
    >
      <span className={cn('size-2 rounded-full', meta.dot)} aria-hidden />
      {meta.label}
    </span>
  )
}
