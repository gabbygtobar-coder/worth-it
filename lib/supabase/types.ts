import type { CategoryId, Verdict } from '@/lib/types'

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type ProfileRow = {
  id: string
  display_name: string | null
  hourly_income: number | null
  current_savings: number | null
  monthly_income: number | null
  monthly_spending: number | null
  savings_rate: number | null
  net_worth: number | null
  expected_return: number
  inflation: number
  created_at: string
  updated_at: string
}

export type DecisionRow = {
  id: string
  user_id: string
  category_id: CategoryId
  title: string
  /** Raw analyzer form values, so a decision can be edited and rerun. */
  inputs: Json
  /** Snapshot of the AnalysisResult shown when the decision was saved. */
  result: Json
  true_cost: number
  face_price: number
  verdict: Verdict
  summary: string | null
  /** Null until the user shares. Setting it back to null revokes the link. */
  share_token: string | null
  created_at: string
  updated_at: string
}

/** Columns the database fills in for us. */
type Generated = 'id' | 'created_at' | 'updated_at'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>> & { id: string }
        Update: Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      decisions: {
        Row: DecisionRow
        Insert: Omit<DecisionRow, Generated | 'summary' | 'share_token'> & {
          id?: string
          summary?: string | null
          share_token?: string | null
        }
        Update: Partial<Omit<DecisionRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      decision_category: CategoryId
      decision_verdict: Verdict
    }
  }
}
