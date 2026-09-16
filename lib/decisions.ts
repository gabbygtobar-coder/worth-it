import { cache } from 'react'
import { getCategory } from '@/lib/categories'
import { valuesFromParams, type FormValues } from '@/lib/decision-params'
import { createClient, getUser } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import type { Json } from '@/lib/supabase/types'
import type { AnalysisResult, CategoryId, SavedDecision, Verdict } from '@/lib/types'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const VERDICTS: readonly Verdict[] = ['worth', 'consider', 'avoid']

export function isDecisionId(value: string): boolean {
  return UUID_RE.test(value)
}

export type DecisionListResult = {
  decisions: SavedDecision[]
  error?: string
}

export type DecisionDetailResult = {
  decision: SavedDecision | null
  error?: string
}

export type SaveDecisionResult = { ok: true; id: string } | { ok: false; error: string }

export type DeleteDecisionResult = { ok: true } | { ok: false; error: string }

const LIST_COLUMNS =
  'id, category_id, title, true_cost, face_price, verdict, summary, created_at' as const

type DecisionListRow = {
  id: string
  category_id: string
  title: string
  true_cost: number | string
  face_price: number | string
  verdict: string
  summary: string | null
  created_at: string
}

function isCategoryId(value: string): value is CategoryId {
  return getCategory(value) !== undefined
}

function isVerdict(value: string): value is Verdict {
  return (VERDICTS as readonly string[]).includes(value)
}

function asNumber(value: number | string): number {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json
}

function toSavedDecision(row: DecisionListRow): SavedDecision | null {
  if (!isCategoryId(row.category_id) || !isVerdict(row.verdict)) return null
  return {
    id: row.id,
    title: row.title,
    categoryId: row.category_id,
    date: row.created_at,
    trueCost: asNumber(row.true_cost),
    facePrice: asNumber(row.face_price),
    verdict: row.verdict,
    summary: row.summary ?? '',
  }
}

function logDecisionError(scope: string, error: { message: string; code?: string }) {
  if (process.env.NODE_ENV === 'production') return
  console.info('[decisions]', {
    scope,
    code: error.code ?? null,
    message: error.message,
  })
}

export function friendlyDecisionError(
  error: { message: string; code?: string } | null | undefined,
  fallback: string,
): string {
  const message = error?.message?.toLowerCase() ?? ''
  if (
    message.includes('schema cache') ||
    message.includes('does not exist') ||
    message.includes('could not find the table')
  ) {
    return 'Could not reach the decisions table. Apply supabase/migrations/0001_init.sql in the Supabase SQL editor, then try again.'
  }
  if (error?.code === '42501' || message.includes('row-level security')) {
    return 'You can only save and view your own analyses while signed in.'
  }
  return fallback
}

/**
 * Current user's saved analyses, newest first. RLS is the authorization
 * boundary; we still refuse to query without a verified user.
 */
export const listSavedDecisions = cache(async (): Promise<DecisionListResult> => {
  if (!isSupabaseConfigured) {
    return { decisions: [], error: 'Saving is not set up yet.' }
  }

  const user = await getUser()
  if (!user) {
    return { decisions: [], error: 'Sign in to see your saved analyses.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('decisions')
    .select(LIST_COLUMNS)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    logDecisionError('list', error)
    return {
      decisions: [],
      error: friendlyDecisionError(error, 'Could not load your saved analyses. Try again.'),
    }
  }

  const decisions: SavedDecision[] = []
  for (const row of data ?? []) {
    const mapped = toSavedDecision(row)
    if (mapped) decisions.push(mapped)
  }
  return { decisions }
})

/** One saved analysis for the current user. Missing or unauthorized → null. */
export const getSavedDecision = cache(async (id: string): Promise<DecisionDetailResult> => {
  if (!isDecisionId(id)) return { decision: null }
  if (!isSupabaseConfigured) {
    return { decision: null, error: 'Saving is not set up yet.' }
  }

  const user = await getUser()
  if (!user) return { decision: null }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('decisions')
    .select(LIST_COLUMNS)
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    logDecisionError('get', error)
    return {
      decision: null,
      error: friendlyDecisionError(error, 'Could not load this analysis. Try again.'),
    }
  }
  if (!data) return { decision: null }

  return { decision: toSavedDecision(data) }
})

function cleanFormValues(categoryId: CategoryId, raw: unknown): FormValues | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const params: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (value === undefined || value === null) continue
    params[key] = String(value)
  }
  const config = getCategory(categoryId)
  if (!config) return null
  return valuesFromParams(config, params)
}

function snapshotFromValues(
  categoryId: CategoryId,
  values: FormValues,
): { result: AnalysisResult; title: string; summary: string } | null {
  const config = getCategory(categoryId)
  if (!config) return null
  const result = config.analyze(values)
  const title = result.title.trim().slice(0, 200)
  if (!title) return null
  return { result, title, summary: result.verdictReason }
}

/**
 * Inserts a snapshot for the signed-in user. Recomputes the analysis on the
 * server so the client cannot supply a forged verdict or cost.
 */
export async function saveCurrentUserDecision(
  categoryId: string,
  rawValues: unknown,
): Promise<SaveDecisionResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Saving is not set up yet.' }
  }

  const user = await getUser()
  if (!user) {
    return { ok: false, error: 'Sign in to save this analysis.' }
  }

  if (!isCategoryId(categoryId)) {
    return { ok: false, error: 'That decision category is not available.' }
  }

  const values = cleanFormValues(categoryId, rawValues)
  if (!values) {
    return { ok: false, error: 'Could not read the analysis inputs.' }
  }

  const snapshot = snapshotFromValues(categoryId, values)
  if (!snapshot) {
    return { ok: false, error: 'Could not build a title for this analysis.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('decisions')
    .insert({
      user_id: user.id,
      category_id: categoryId,
      title: snapshot.title,
      inputs: toJson(values),
      result: toJson(snapshot.result),
      true_cost: snapshot.result.trueCost,
      face_price: snapshot.result.facePrice,
      verdict: snapshot.result.verdict,
      summary: snapshot.summary,
    })
    .select('id')
    .single()

  if (error || !data) {
    if (error) logDecisionError('save', error)
    return {
      ok: false,
      error: friendlyDecisionError(error, 'Could not save this analysis. Try again.'),
    }
  }

  return { ok: true, id: data.id }
}

export async function deleteCurrentUserDecision(id: string): Promise<DeleteDecisionResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Saving is not set up yet.' }
  }
  if (!isDecisionId(id)) {
    return { ok: false, error: 'That analysis could not be found.' }
  }

  const user = await getUser()
  if (!user) {
    return { ok: false, error: 'Sign in to delete a saved analysis.' }
  }

  const supabase = await createClient()
  const { error, count } = await supabase
    .from('decisions')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    logDecisionError('delete', error)
    return {
      ok: false,
      error: friendlyDecisionError(error, 'Could not delete this analysis. Try again.'),
    }
  }
  if (!count) {
    return { ok: false, error: 'That analysis could not be found.' }
  }

  return { ok: true }
}
