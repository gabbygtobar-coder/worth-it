import { Check } from 'lucide-react'
import type { FormStep } from '@/lib/types'
import { cn } from '@/lib/utils'

export function StepIndicator({ steps, current }: { steps: FormStep[]; current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {steps.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={step.title} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors',
                done && 'border-primary bg-primary text-primary-foreground',
                active && 'border-primary text-primary',
                !done && !active && 'border-border text-muted-foreground',
              )}
              aria-current={active ? 'step' : undefined}
            >
              {done ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
            </span>
            <span className="sr-only">{step.title}</span>
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn('h-px flex-1 transition-colors', done ? 'bg-primary' : 'bg-border')}
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
