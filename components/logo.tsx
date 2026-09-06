import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  href?: string
  showText?: boolean
}

/** WorthIt brand mark: a coin/scale glyph paired with the wordmark. */
export function Logo({ className, href = '/', showText = true }: LogoProps) {
  const content = (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      {showText && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          Worth<span className="text-primary">It</span>
        </span>
      )}
    </span>
  )
  if (!href) return content
  return (
    <Link href={href} aria-label="WorthIt home" className="inline-flex">
      {content}
    </Link>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M12 3v18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M5 8h14M7 8l-3 6a3 3 0 0 0 6 0L7 8Zm10 0l-3 6a3 3 0 0 0 6 0l-3-6Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
