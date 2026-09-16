'use client'

import { useActionState, type FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteDecision, type DecisionActionState } from '@/app/app/decisions/actions'
import { Button } from '@/components/ui/button'

const EMPTY: DecisionActionState = {}

export function DeleteDecisionButton({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState(deleteDecision, EMPTY)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm('Delete this saved analysis? This cannot be undone.')) {
      event.preventDefault()
    }
  }

  return (
    <form action={formAction} onSubmit={onSubmit} className="flex flex-col items-start gap-1.5">
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        <Trash2 data-icon="inline-start" />
        {pending ? 'Deleting…' : 'Delete'}
      </Button>
      {state.error ? (
        <p className="text-xs text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  )
}
