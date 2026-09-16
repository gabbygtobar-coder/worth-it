'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import {
  deleteCurrentUserDecision,
  saveCurrentUserDecision,
} from '@/lib/decisions'

export type DecisionActionState = { error?: string }

function parseValues(raw: FormDataEntryValue | null): unknown {
  if (typeof raw !== 'string' || raw.trim() === '') return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function saveDecision(
  _prevState: DecisionActionState,
  formData: FormData,
): Promise<DecisionActionState> {
  const user = await getUser()
  if (!user) redirect('/login')

  const categoryId = String(formData.get('categoryId') ?? '')
  const values = parseValues(formData.get('values'))
  if (values == null) {
    return { error: 'Could not read the analysis inputs.' }
  }

  const result = await saveCurrentUserDecision(categoryId, values)
  if (!result.ok) return { error: result.error }

  revalidatePath('/app/decisions')
  revalidatePath(`/app/decisions/${result.id}`)
  redirect(`/app/decisions/${result.id}`)
}

export async function deleteDecision(
  _prevState: DecisionActionState,
  formData: FormData,
): Promise<DecisionActionState> {
  const user = await getUser()
  if (!user) redirect('/login')

  const id = String(formData.get('id') ?? '')
  const result = await deleteCurrentUserDecision(id)
  if (!result.ok) return { error: result.error }

  revalidatePath('/app/decisions')
  revalidatePath(`/app/decisions/${id}`)
  redirect('/app/decisions')
}
