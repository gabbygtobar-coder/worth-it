const STEPS = [
  {
    title: 'Describe the decision',
    body: 'Pick a category and enter a few real numbers: the price, your hourly income, your savings.',
  },
  {
    title: 'WorthIt does the economics',
    body: 'It layers in opportunity cost, compounding, depreciation, and the work time the money represents.',
  },
  {
    title: 'Get a clear verdict',
    body: 'A plain-language verdict, a cost breakdown, and what-if scenarios showing how the answer changes.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          From a fuzzy feeling to a number you can defend
        </h2>
      </div>

      <ol className="mt-10 flex max-w-3xl flex-col gap-8">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-5">
            <span className="font-display text-lg font-semibold text-muted-foreground tabular">
              {i + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted-foreground text-pretty">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
