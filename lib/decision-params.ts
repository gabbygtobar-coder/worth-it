import type { FieldConfig } from './types'

export type FormValues = Record<string, number | string>

/**
 * The serializable slice of a category. `CategoryConfig` holds `analyze` and
 * `buildTitle` functions, which cannot cross the server/client boundary, so
 * client components receive only this shape.
 */
export interface FieldsOnly {
  fields: FieldConfig[]
}

/** Default form state for a category, used as the starting point and as the
 *  fallback for any value missing from the URL. */
export function defaultValues(category: FieldsOnly): FormValues {
  return Object.fromEntries(category.fields.map((f) => [f.id, f.defaultValue]))
}

function coerce(field: FieldConfig, raw: string): number | string {
  if (field.type === 'text' || field.type === 'select') return raw
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : field.defaultValue
}

/**
 * Rebuilds form values from URL search params, falling back to defaults for
 * anything absent or unparseable. This keeps the results route refreshable and
 * shareable without a database.
 */
export function valuesFromParams(
  category: FieldsOnly,
  params: Record<string, string | string[] | undefined>,
): FormValues {
  const values = defaultValues(category)
  for (const field of category.fields) {
    const raw = params[field.id]
    const single = Array.isArray(raw) ? raw[0] : raw
    if (single !== undefined && single !== '') {
      values[field.id] = coerce(field, single)
    }
  }
  return values
}

/** Serializes form values into a query string for the results route. */
export function paramsFromValues(category: FieldsOnly, values: FormValues): string {
  const search = new URLSearchParams()
  for (const field of category.fields) {
    const value = values[field.id]
    if (value === '' || value === undefined) continue
    search.set(field.id, String(value))
  }
  return search.toString()
}
