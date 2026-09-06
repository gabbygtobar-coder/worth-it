export interface CalculatorInfo {
  id: string
  name: string
  description: string
  icon: string
  concept: string
  /** Whether this maps directly to an analyzer category. */
  categoryId?: string
}

export const CALCULATORS: CalculatorInfo[] = [
  {
    id: 'opportunity-cost',
    name: 'Opportunity Cost',
    description: 'See what a purchase could become if you invested the money instead.',
    icon: 'coins',
    concept: 'Opportunity cost',
  },
  {
    id: 'compound-growth',
    name: 'Compound Growth',
    description: 'Project how contributions snowball over time with compounding.',
    icon: 'trending-up',
    concept: 'Compound interest',
    categoryId: 'investing',
  },
  {
    id: 'loan-payoff',
    name: 'Loan Payoff',
    description: 'Find your monthly payment and total interest on any loan.',
    icon: 'credit-card',
    concept: 'Amortization',
    categoryId: 'debt',
  },
  {
    id: 'car-ownership',
    name: 'Car Ownership',
    description: 'The true cost of a car once depreciation and upkeep are counted.',
    icon: 'car',
    concept: 'Total cost of ownership',
    categoryId: 'car',
  },
  {
    id: 'housing',
    name: 'Housing Affordability',
    description: 'Check rent against the 30% rule and full lease cost.',
    icon: 'home',
    concept: 'Rent-to-income',
    categoryId: 'housing',
  },
  {
    id: 'investing',
    name: 'Investing Projection',
    description: 'Model a portfolio\'s growth from regular contributions.',
    icon: 'line-chart',
    concept: 'Future value',
    categoryId: 'investing',
  },
  {
    id: 'job-comparison',
    name: 'Job Comparison',
    description: 'Compare offers on effective hourly pay, not just salary.',
    icon: 'briefcase',
    concept: 'Effective wage',
    categoryId: 'job',
  },
  {
    id: 'break-even',
    name: 'Break-Even',
    description: 'How long until an upfront cost pays for itself.',
    icon: 'scale',
    concept: 'Break-even analysis',
  },
]
