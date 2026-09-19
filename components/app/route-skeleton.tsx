/**
 * Lightweight pulse placeholders for App Router `loading.tsx` files.
 * Mirrors the card + heading rhythm used on signed-in pages.
 */
export function RouteSkeleton({
  cards = 3,
}: {
  cards?: number
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <p className="sr-only" role="status">
        Loading
      </p>
      <div className="flex flex-col gap-3" aria-hidden="true">
        <div className="h-8 w-48 max-w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-muted" />
      </div>
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-hidden="true"
      >
        {Array.from({ length: cards }, (_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10"
          />
        ))}
      </div>
    </div>
  )
}
