import { cn } from '@/lib/utils'

/**
 * Compact circular progress for the Economic Score. Uses stroke-dashoffset on a
 * plain SVG circle so it renders identically on the server and needs no JS.
 */
export function ScoreRing({
  score,
  max = 100,
  size = 88,
  className,
}: {
  score: number
  max?: number
  size?: number
  className?: string
}) {
  const stroke = 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(1, score / max))

  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Economic score ${score} out of ${max}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-semibold tabular leading-none">{score}</span>
        <span className="mt-0.5 text-[0.625rem] text-muted-foreground">/ {max}</span>
      </div>
    </div>
  )
}
