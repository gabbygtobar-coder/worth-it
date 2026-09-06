import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeading } from '@/components/app/page-heading'
import { getIcon } from '@/components/icon'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { LEARN_TOPICS } from '@/lib/learn'

export const metadata: Metadata = {
  title: 'Learn',
  description: 'The economic concepts behind every WorthIt analysis, in plain language.',
}

export default function LearnPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <PageHeading
        eyebrow="Concepts"
        title="Learn the economics"
        description="Seven ideas that explain why the sticker price is almost never the real price."
      />

      <Accordion>
        {LEARN_TOPICS.map((topic) => {
          const Icon = getIcon(topic.icon)
          return (
            <AccordionItem key={topic.id} value={topic.id}>
              <AccordionTrigger>
                <span className="flex items-center gap-3 text-left">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-medium">{topic.title}</span>
                    <span className="text-xs text-muted-foreground">{topic.tagline}</span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 pl-11">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {topic.explanation}
                  </p>

                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <p className="text-xs font-medium text-muted-foreground">In practice</p>
                    <p className="mt-1.5 text-sm leading-relaxed">{topic.example}</p>
                  </div>

                  {topic.categoryId && (
                    <Link
                      href={`/app/analyze/${topic.categoryId}`}
                      className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      Try it on a real decision
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
