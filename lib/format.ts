export function formatCurrency(amount: number, opts?: { cents?: boolean }): string {
  if (!Number.isFinite(amount)) return 'n/a'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: opts?.cents ? 2 : 0,
    maximumFractionDigits: opts?.cents ? 2 : 0,
  }).format(Math.round(opts?.cents ? amount * 100 : amount) / (opts?.cents ? 100 : 1))
}

export function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

export function formatPercent(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`
}

export function formatHours(hours: number): string {
  if (hours >= 40) {
    const weeks = hours / 40
    return `${Math.round(hours)} hrs (~${weeks.toFixed(1)} work weeks)`
  }
  return `${Math.round(hours)} hrs`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function relativeDate(iso: string): string {
  const now = new Date()
  const then = new Date(iso)
  const days = Math.round((now.getTime() - then.getTime()) / 86_400_000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} wk ago`
  return `${Math.floor(days / 30)} mo ago`
}
