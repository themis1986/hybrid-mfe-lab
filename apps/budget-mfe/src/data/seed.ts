import type { ExpenseCategoryId } from '../lib/categories'
import { addMonths, endOfMonth, startOfMonth } from '../lib/dates'
import { budgetSchema, transactionInputSchema } from '../lib/schemas'
import type { Budget, CategoryId, Transaction, TransactionInput } from '../types'
import type { LedgerSnapshot } from './repository'

// Sample content: twelve months of a household's money, with dates relative to today so the dashboard is
// never empty. A seeded generator makes it the same on every mount. Like any other input, it goes through
// the schemas: an entry that doesn't pass is left out with a warning.

/** mulberry32: a small, fast, seeded generator. */
function createRandom(seed: number) {
  let state = seed
  const next = () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    between: (min: number, max: number) =>
      Math.round((min + next() * (max - min)) * 100) / 100,
    int: (min: number, max: number) => Math.floor(min + next() * (max - min + 1)),
    pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)]!,
    chance: (probability: number) => next() < probability,
  }
}

const GROCERIES = ['Supermarket', 'Farmers market', 'Bakery', 'Organic store']
const DINING = [
  'Lunch with colleagues',
  'Pizza night',
  'Coffee and cake',
  'Sushi dinner',
  'Weekend brunch',
  'Takeaway curry',
]
const TRAVEL = ['Taxi', 'Fuel', 'Train tickets', 'Bike repair']
const LEISURE = ['Cinema', 'Concert tickets', 'Books', 'Museum visit']
const OTHER = ['Clothes', 'Gift for a friend', 'Household supplies', 'Haircut']
const FREELANCE = [
  'Website project',
  'Logo design',
  'Consulting call',
  'Photo editing',
]
const OTHER_INCOME = ['Tax refund', 'Sold old bike', 'Birthday gift', 'Cashback']

const BUDGETS: Record<ExpenseCategoryId, number> = {
  housing: 1300,
  groceries: 420,
  dining: 200,
  transport: 140,
  utilities: 190,
  health: 90,
  leisure: 180,
  other: 150,
}

export function createSeedLedger(now: string, seed = 20261105): LedgerSnapshot {
  const random = createRandom(seed)
  const entries: TransactionInput[] = []

  const add = (
    date: string,
    category: CategoryId,
    description: string,
    amount: number,
    notes?: string,
  ) => {
    if (date > now) return
    entries.push({
      type: category === 'salary' || category === 'freelance' || category === 'other-income'
        ? 'income'
        : 'expense',
      category,
      description,
      amount,
      date,
      ...(notes ? { notes } : {}),
    })
  }

  for (let offset = -11; offset <= 0; offset++) {
    const first = startOfMonth(addMonths(now, offset))
    const lastDay = Number(endOfMonth(first).slice(8))
    const day = (n: number) => `${first.slice(0, 8)}${String(Math.min(n, lastDay)).padStart(2, '0')}`
    const month = Number(first.slice(5, 7))
    const winter = month <= 2 || month >= 11

    add(day(28), 'salary', 'Monthly salary', 3450)
    if (month === 12) add(day(20), 'salary', 'Year-end bonus', 1200)
    for (let i = random.int(0, 2); i > 0; i--) {
      add(day(random.int(3, 26)), 'freelance', random.pick(FREELANCE), random.between(300, 1400))
    }
    if (random.chance(0.35)) {
      add(day(random.int(1, 27)), 'other-income', random.pick(OTHER_INCOME), random.between(30, 280))
    }

    add(day(1), 'housing', 'Rent', 1250)
    if (month % 3 === 1) add(day(14), 'housing', 'Home insurance', 84)

    add(day(10), 'utilities', 'Internet', 39.99)
    add(day(12), 'utilities', 'Mobile phone', 19.99)
    add(day(15), 'utilities', 'Electricity', random.between(winter ? 85 : 50, winter ? 125 : 80))
    if (month % 2 === 0) add(day(20), 'utilities', 'Water', 38.4)

    for (let d = random.int(1, 4); d <= lastDay; d += random.int(5, 8)) {
      add(day(d), 'groceries', random.pick(GROCERIES), random.between(28, 128))
    }
    for (let i = random.int(3, 7); i > 0; i--) {
      add(
        day(random.int(1, lastDay)),
        'dining',
        random.pick(DINING),
        random.between(9, 72),
        random.chance(0.15) ? 'Split the bill' : undefined,
      )
    }

    add(day(2), 'transport', 'Monthly transit pass', 49)
    for (let i = random.int(0, 3); i > 0; i--) {
      add(day(random.int(1, lastDay)), 'transport', random.pick(TRAVEL), random.between(12, 85))
    }

    add(day(5), 'health', 'Gym membership', 34.9)
    if (random.chance(0.6)) add(day(random.int(1, lastDay)), 'health', 'Pharmacy', random.between(8, 35))
    if (random.chance(0.15)) add(day(random.int(1, lastDay)), 'health', 'Dentist', 85)

    add(day(18), 'leisure', 'Streaming subscription', 12.99)
    add(day(20), 'leisure', 'Music subscription', 10.99)
    for (let i = random.int(0, 3); i > 0; i--) {
      add(day(random.int(1, lastDay)), 'leisure', random.pick(LEISURE), random.between(15, 110))
    }
    if (random.chance(0.15)) {
      add(day(random.int(1, lastDay)), 'leisure', 'Weekend trip', random.between(180, 420), 'Train and two nights')
    }

    for (let i = random.int(1, 3); i > 0; i--) {
      add(day(random.int(1, lastDay)), 'other', random.pick(OTHER), random.between(15, 95))
    }
  }

  // This month starts with a few fixed entries, so every budget tone shows on the first mount.
  add(startOfMonth(now), 'dining', 'Birthday dinner', 168.5, 'Six people, booked weeks ahead')
  add(startOfMonth(now), 'other', 'New running shoes', 119.95)

  const transactions: Transaction[] = []
  entries
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((entry, index) => {
      const result = transactionInputSchema.safeParse(entry)
      if (!result.success) {
        console.warn('Left a seed entry out:', entry, result.error.issues)
        return
      }
      transactions.push({
        ...result.data,
        id: `seed-${String(index).padStart(4, '0')}`,
        createdAt: `${entry.date}T09:00:00.${String(index % 1000).padStart(3, '0')}Z`,
      })
    })

  const budgets: Budget[] = Object.entries(BUDGETS).map(([category, monthlyLimit]) =>
    budgetSchema.parse({ category, monthlyLimit }),
  )

  return { transactions, budgets }
}
