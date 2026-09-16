export type CategoryId =
  | 'purchase'
  | 'car'
  | 'housing'
  | 'debt'
  | 'job'
  | 'college'
  | 'subscription'
  | 'transportation'
  | 'investing'

export type Verdict = 'worth' | 'consider' | 'avoid'

export type FieldType = 'text' | 'currency' | 'number' | 'percent' | 'select' | 'hours'

export interface FieldOption {
  label: string
  value: string
}

export interface FieldConfig {
  id: string
  label: string
  type: FieldType
  step: number
  /** Which step of the multi-step form this field belongs to (0-indexed). */
  group: number
  placeholder?: string
  help?: string
  suffix?: string
  optional?: boolean
  min?: number
  max?: number
  options?: FieldOption[]
  defaultValue: number | string
}

export interface FormStep {
  title: string
  description: string
}

export interface CategoryConfig {
  id: CategoryId
  label: string
  tagline: string
  /** Lucide icon name key used by the icon map. */
  icon: string
  question: string
  steps: FormStep[]
  fields: FieldConfig[]
  /** Builds a human title for the result screen from raw inputs. */
  buildTitle: (values: Record<string, number | string>) => string
  analyze: (values: Record<string, number | string>) => AnalysisResult
}

export interface Metric {
  label: string
  value: string
  hint?: string
  emphasis?: boolean
}

export interface BreakdownSegment {
  key: string
  label: string
  amount: number
  color: string
}

export interface WhatIfScenario {
  id: string
  label: string
  description: string
  trueCost: number
  delta: number
  verdict: Verdict
}

export interface AnalysisResult {
  title: string
  categoryId: CategoryId
  /** Headline figure shown at the top of the results screen. */
  trueCost: number
  /** Sticker / face-value price for comparison. */
  facePrice: number
  costLabel: string
  metrics: Metric[]
  breakdown: BreakdownSegment[]
  verdict: Verdict
  verdictReason: string
  insights: string[]
  whatIfs: WhatIfScenario[]
}

export interface SavedDecision {
  id: string
  title: string
  categoryId: CategoryId
  date: string
  trueCost: number
  facePrice: number
  verdict: Verdict
  summary: string
}

export interface UserProfile {
  name: string
  economicScore: number
  monthlyIncome: number
  monthlySpending: number
  savingsRate: number
  netWorth: number
  hourlyIncome: number
  currentSavings: number
}
