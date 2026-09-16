'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { BookmarkPlus, LogIn } from 'lucide-react'
import { saveDecision, type DecisionActionState } from '@/app/app/decisions/actions'
import { Button } from '@/components/ui/button'
import type { CategoryId } from '@/lib/types'
import type { FormValues } from '@/lib/decision-params'

const EMPTY: DecisionActionState = {}

export function SaveDecisionButton({
  signedIn,
  categoryId,
  values,
}: {
  signedIn: boolean
  categoryId: CategoryId
  values: FormValues
}) {
  if (!signedIn) {
    return (
      <Button variant="outline" size="sm" render={<Link href="/login" />} nativeButton={false}>
        <LogIn data-icon="inline-start" />
        Sign in to save
      </Button>
    )
  }

  return <SaveForm categoryId={categoryId} values={values} />
}

function SaveForm({ categoryId, values }: { categoryId: CategoryId; values: FormValues }) {
  const [state, formAction, pending] = useActionState(saveDecision, EMPTY)

  return (
    <form action={formAction} className="flex flex-col items-end gap-1.5">
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="values" value={JSON.stringify(values)} />
      <Button type="submit" size="sm" disabled={pending}>
        <BookmarkPlus data-icon="inline-start" />
        {pending ? 'Saving…' : 'Save this analysis'}
      </Button>
      {state.error ? (
        <p className="max-w-xs text-right text-xs text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  )
}
