'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import { FieldControl } from '@/components/analyze/field-control'
import { StepIndicator } from '@/components/analyze/step-indicator'
import { defaultValues, paramsFromValues, type FormValues } from '@/lib/decision-params'
import type { CategoryId, FieldConfig, FormStep } from '@/lib/types'

/** Serializable subset of CategoryConfig: the `analyze`/`buildTitle` functions
 *  can't cross the server/client boundary, and the form doesn't need them. */
export interface DecisionFormCategory {
  id: CategoryId
  steps: FormStep[]
  fields: FieldConfig[]
}

export function DecisionForm({ category }: { category: DecisionFormCategory }) {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [values, setValues] = React.useState<FormValues>(() => defaultValues(category))

  const lastStep = category.steps.length - 1
  const current = category.steps[step]
  const stepFields = category.fields.filter((f) => f.group === step)

  const handleChange = React.useCallback((id: string, value: number | string) => {
    setValues((prev) => ({ ...prev, [id]: value }))
  }, [])

  // A step is complete when every required field on it has a usable value.
  const canAdvance = stepFields.every(
    (f) => f.optional || (values[f.id] !== '' && values[f.id] !== undefined),
  )

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canAdvance) return
    if (step < lastStep) {
      setStep((s) => s + 1)
      return
    }
    router.push(`/app/analyze/${category.id}/result?${paramsFromValues(category, values)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <StepIndicator steps={category.steps} current={step} />

      <Card>
        <CardHeader>
          <CardTitle>{current.title}</CardTitle>
          <CardDescription>{current.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {stepFields.map((field) => (
              <FieldControl
                key={field.id}
                field={field}
                value={values[field.id] ?? ''}
                onChange={handleChange}
              />
            ))}
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {category.steps.length}
          </span>
          <Button type="submit" disabled={!canAdvance}>
            {step === lastStep ? (
              <>
                <Sparkles data-icon="inline-start" />
                Calculate true cost
              </>
            ) : (
              <>
                Continue
                <ArrowRight data-icon="inline-end" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
