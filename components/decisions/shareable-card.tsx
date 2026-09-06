'use client'

import * as React from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import type { SavedDecision } from '@/lib/types'
import { VERDICT_META } from '@/lib/verdict'
import { cn } from '@/lib/utils'

/**
 * A compact, self-contained summary of a decision designed to be screenshotted
 * or shared as a link. Deliberately high-contrast and legible at small sizes.
 */
export function ShareableCard({ decision }: { decision: SavedDecision }) {
  const [copied, setCopied] = React.useState(false)
  const verdict = VERDICT_META[decision.verdict]
  const hidden = decision.trueCost - decision.facePrice
  const multiple = decision.trueCost / decision.facePrice

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked by permissions; the link is still in the URL bar.
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-sm font-semibold tracking-tight">
              Worth<span className="text-primary">It</span>
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                verdict.badge,
              )}
            >
              <span className={cn('size-1.5 rounded-full', verdict.dot)} aria-hidden />
              {verdict.label}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-base font-medium leading-snug text-balance">{decision.title}</h2>
            <p className="font-display text-4xl font-semibold tabular tracking-tight">
              {formatCurrency(decision.trueCost)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(decision.facePrice)} sticker
              {hidden > 0 && (
                <>
                  {' · '}
                  <span className="text-destructive">+{formatCurrency(hidden)} hidden</span>
                </>
              )}
            </p>
          </div>

          <p className="border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            {decision.summary}
          </p>

          {hidden > 0 && (
            <p className="text-xs text-muted-foreground">
              The real price is{' '}
              <span className="font-semibold text-foreground">
                {multiple.toFixed(2)}&times;
              </span>{' '}
              the
              advertised one.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={copyLink}>
          {copied ? (
            <Check data-icon="inline-start" />
          ) : (
            <Copy data-icon="inline-start" />
          )}
          {copied ? 'Link copied' : 'Copy link'}
        </Button>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Share2 className="size-3.5" aria-hidden="true" />
          Screenshot the card to share it anywhere
        </span>
      </div>
    </div>
  )
}
