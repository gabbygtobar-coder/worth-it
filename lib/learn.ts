export type MiniCalcKind =
  | 'opportunity'
  | 'compound'
  | 'inflation'
  | 'tvm'
  | 'marginal'
  | 'depreciation'
  | 'breakeven'

export interface LearnTopic {
  id: string
  title: string
  icon: string
  tagline: string
  explanation: string
  example: string
  calc: MiniCalcKind
  categoryId?: string
}

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: 'opportunity-cost',
    title: 'Opportunity Cost',
    icon: 'coins',
    tagline: 'The road not taken has a price.',
    explanation:
      'Every dollar you spend is a dollar that could have done something else. Opportunity cost is the value of the best alternative you gave up, most often the growth that money would have earned if invested.',
    example:
      'Spending $1,000 on a gadget today isn\'t just $1,000. At a 7% return, that money could have become ~$2,000 in 10 years. The real cost includes the $1,000 of growth you skipped.',
    calc: 'opportunity',
  },
  {
    id: 'compound-interest',
    title: 'Compound Interest',
    icon: 'trending-up',
    tagline: 'Interest that earns its own interest.',
    explanation:
      'Compounding means your returns start generating returns. Over long periods this snowball effect does most of the heavy lifting, which is why starting early matters more than starting big.',
    example:
      'Investing $200/month for 30 years at 7% grows to about $244,000, even though you only put in $72,000. The other ~$172,000 is pure compounding.',
    calc: 'compound',
    categoryId: 'investing',
  },
  {
    id: 'inflation',
    title: 'Inflation',
    icon: 'flame',
    tagline: 'Why your money shrinks while it sits.',
    explanation:
      'Inflation is the gradual rise in prices, which quietly erodes the purchasing power of money over time. Cash sitting idle actually loses real value every year.',
    example:
      'At 3% inflation, $10,000 under your mattress buys only about $7,400 worth of goods in 10 years. Doing nothing is not the same as risk-free.',
    calc: 'inflation',
  },
  {
    id: 'time-value-of-money',
    title: 'Time Value of Money',
    icon: 'clock',
    tagline: 'A dollar today beats a dollar tomorrow.',
    explanation:
      'Money available now is worth more than the same amount later, because it can be invested to earn returns. This is the foundation for comparing costs and payoffs across time.',
    example:
      'Would you rather have $1,000 now or $1,050 in a year? If you can earn 7%, the $1,000 now is worth more. It could become $1,070.',
    calc: 'tvm',
  },
  {
    id: 'marginal',
    title: 'Marginal Cost & Benefit',
    icon: 'plus-minus',
    tagline: 'What the next one really costs.',
    explanation:
      'Marginal thinking looks at the cost and benefit of one more unit, not the average. Good decisions happen where the benefit of the next step still outweighs its cost.',
    example:
      'A gym is $40/month. If you go 8 times, each visit "costs" $5, a great deal. Go twice and each visit costs $20. The marginal value depends entirely on the next visit.',
    calc: 'marginal',
  },
  {
    id: 'depreciation',
    title: 'Depreciation',
    icon: 'trending-down',
    tagline: 'Assets that lose value as you use them.',
    explanation:
      'Depreciation is the decline in an asset\'s value over time. For things like cars and electronics, it is often the single largest cost of ownership, and it is invisible on the price tag.',
    example:
      'A $25,000 car losing 15% a year is worth only about $11,000 after five years. That $14,000 drop is a cost you paid without ever seeing a bill.',
    calc: 'depreciation',
    categoryId: 'car',
  },
  {
    id: 'break-even',
    title: 'Break-Even Analysis',
    icon: 'scale',
    tagline: 'When does it start paying for itself?',
    explanation:
      'Break-even analysis finds the point where an upfront cost is fully recovered by ongoing savings or income. Past that point, you\'re ahead.',
    example:
      'A $600 annual transit pass that saves you $80/month breaks even in 7.5 months. Everything after that is money in your pocket.',
    calc: 'breakeven',
  },
]
