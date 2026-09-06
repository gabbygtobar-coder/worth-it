import {
  ArrowLeftRight,
  Bus,
  Briefcase,
  Car,
  Clock,
  Coins,
  CreditCard,
  Flame,
  GraduationCap,
  Home,
  LineChart,
  type LucideIcon,
  Repeat,
  Scale,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

/** Maps the string icon keys used in data files to Lucide components. */
export const ICONS: Record<string, LucideIcon> = {
  'shopping-bag': ShoppingBag,
  car: Car,
  home: Home,
  'credit-card': CreditCard,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  repeat: Repeat,
  bus: Bus,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  coins: Coins,
  'line-chart': LineChart,
  scale: Scale,
  flame: Flame,
  clock: Clock,
  'plus-minus': ArrowLeftRight,
}

export function getIcon(key: string): LucideIcon {
  return ICONS[key] ?? Coins
}
