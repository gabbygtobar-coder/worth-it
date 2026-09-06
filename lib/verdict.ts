import type { Verdict } from './types'

export interface VerdictMeta {
  label: string
  short: string
  dot: string
  /** Tailwind classes for a soft badge/pill. */
  badge: string
  text: string
  ring: string
}

export const VERDICT_META: Record<Verdict, VerdictMeta> = {
  worth: {
    label: 'Worth It',
    short: 'Worth it',
    dot: 'bg-worth',
    badge: 'bg-worth-muted text-worth',
    text: 'text-worth',
    ring: 'ring-worth/30',
  },
  consider: {
    label: 'Consider It',
    short: 'Consider',
    dot: 'bg-consider',
    badge: 'bg-consider-muted text-consider',
    text: 'text-consider',
    ring: 'ring-consider/30',
  },
  avoid: {
    label: 'Not Worth It',
    short: 'Skip it',
    dot: 'bg-avoid',
    badge: 'bg-avoid-muted text-avoid',
    text: 'text-avoid',
    ring: 'ring-avoid/30',
  },
}
