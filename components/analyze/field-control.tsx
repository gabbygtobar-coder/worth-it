'use client'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FieldConfig } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FieldControlProps {
  field: FieldConfig
  value: number | string
  onChange: (id: string, value: number | string) => void
}

/**
 * Renders a single analyzer input. Numeric types keep their raw string in the
 * DOM while typing so intermediate states ("", "1.") don't get clobbered, and
 * only the parsed number is written back to form state.
 */
export function FieldControl({ field, value, onChange }: FieldControlProps) {
  const label = (
    <FieldLabel htmlFor={field.id}>
      {field.label}
      {field.optional ? (
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">Optional</span>
      ) : null}
    </FieldLabel>
  )

  if (field.type === 'select') {
    return (
      <Field>
        {label}
        <Select
          // The `items` prop lets base-ui resolve the selected value to its
          // label; without it the trigger renders the raw value ("once").
          items={field.options ?? []}
          value={String(value)}
          onValueChange={(next) => onChange(field.id, String(next))}
        >
          <SelectTrigger id={field.id}>
            <SelectValue placeholder={field.placeholder ?? 'Select'} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {field.help ? <FieldDescription>{field.help}</FieldDescription> : null}
      </Field>
    )
  }

  if (field.type === 'text') {
    return (
      <Field>
        {label}
        <Input
          id={field.id}
          value={String(value)}
          placeholder={field.placeholder}
          onChange={(event) => onChange(field.id, event.target.value)}
        />
        {field.help ? <FieldDescription>{field.help}</FieldDescription> : null}
      </Field>
    )
  }

  const prefix = field.type === 'currency' ? '$' : undefined
  const suffix = field.suffix ?? (field.type === 'percent' ? '%' : undefined)

  return (
    <Field>
      {label}
      <div className="relative">
        {prefix ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
          >
            {prefix}
          </span>
        ) : null}
        <Input
          id={field.id}
          type="number"
          inputMode="decimal"
          // `step="any"` is deliberate: the config's `step` is meant as a
          // spinner increment, but native validation also enforces it as a
          // modulus, which would reject legitimate amounts like 1099.
          step="any"
          min={field.min ?? 0}
          max={field.max}
          value={value === '' ? '' : String(value)}
          placeholder={field.placeholder}
          className={cn(prefix && 'pl-7', suffix && 'pr-16')}
          onChange={(event) => {
            const raw = event.target.value
            onChange(field.id, raw === '' ? '' : Number(raw))
          }}
        />
        {suffix ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground"
          >
            {suffix}
          </span>
        ) : null}
      </div>
      {field.help ? <FieldDescription>{field.help}</FieldDescription> : null}
    </Field>
  )
}
