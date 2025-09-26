import { getAgeBandKey, type StateCode } from './ageBands'

// Rate table interfaces
interface RateTable {
  plans: Record<string, Record<string, Record<string, Record<string, number>>>>
  metadata: {
    lastUpdated: string
    version: string
    description: string
    disclaimer: string
  }
}

// Import the rate table configuration
import rateTableConfig from './rateTablesConfig.json'

const rateTable = rateTableConfig as RateTable

export interface RateCalculationInput {
  product: string
  state: StateCode | 'ALL'
  age: number
  tobacco: boolean
}

export interface RateCalculationResult {
  monthlyPremium: number
  annualPremium: number
  path: {
    product: string
    stateKey: string
    ageBand: string
    tobaccoKey: string
  }
  found: boolean
  fallbacks: string[]
}

export interface SavingsCalculation {
  currentMonthly: number
  newMonthly: number
  monthlySavings: number
  annualSavings: number
  percentageSavings: number
  isIncrease: boolean
}

// Available plan names (must match exactly)
export const PLAN_NAMES = [
  'Essentials',
  'Direct', 
  'Care Plus',
  'Secure HSA',
  'Premium Care',
  'Premium HSA'
] as const

export type PlanName = typeof PLAN_NAMES[number]

export function isPlanName(name: string): name is PlanName {
  return PLAN_NAMES.includes(name as PlanName)
}

export function resolvePrice(input: RateCalculationInput): RateCalculationResult {
  const { product, state, age, tobacco } = input
  const fallbacks: string[] = []
  let found = false
  let monthlyPremium = 0

  // Convert inputs to keys
  const ageBandKey = getAgeBandKey(age)
  const tobaccoKey = tobacco ? 'YES' : 'NO'
  let stateKey: string = state

  // Validate product exists
  if (!rateTable.plans[product]) {
    throw new Error(`Unknown product: ${product}`)
  }

  const productRates = rateTable.plans[product]

  // Fallback hierarchy for state
  const stateKeys = [state, 'ALL']
  for (const currentStateKey of stateKeys) {
    if (productRates[currentStateKey]) {
      stateKey = currentStateKey
      if (currentStateKey !== state) {
        fallbacks.push(`State fallback: ${state} → ${currentStateKey}`)
      }
      break
    }
  }

  const stateRates = productRates[stateKey]
  if (!stateRates) {
    throw new Error(`No rates found for product ${product}`)
  }

  // Fallback hierarchy for age band
  const ageBandKeys = [ageBandKey, 'ALL']
  let selectedAgeBand = ageBandKey
  
  for (const currentAgeBand of ageBandKeys) {
    if (stateRates[currentAgeBand]) {
      selectedAgeBand = currentAgeBand
      if (currentAgeBand !== ageBandKey) {
        fallbacks.push(`Age band fallback: ${ageBandKey} → ${currentAgeBand}`)
      }
      break
    }
  }

  const ageBandRates = stateRates[selectedAgeBand]
  if (!ageBandRates) {
    throw new Error(`No rates found for age band ${selectedAgeBand}`)
  }

  // Fallback hierarchy for tobacco
  const tobaccoKeys = [tobaccoKey, 'NO', 'YES']
  let selectedTobacco = tobaccoKey
  
  for (const currentTobacco of tobaccoKeys) {
    if (ageBandRates[currentTobacco] !== undefined) {
      monthlyPremium = ageBandRates[currentTobacco]
      selectedTobacco = currentTobacco
      found = true
      if (currentTobacco !== tobaccoKey) {
        fallbacks.push(`Tobacco fallback: ${tobaccoKey} → ${currentTobacco}`)
      }
      break
    }
  }

  if (!found) {
    throw new Error(`No rate found for ${product} in ${state} for age ${age} with tobacco=${tobacco}`)
  }

  return {
    monthlyPremium,
    annualPremium: monthlyPremium * 12,
    path: {
      product,
      stateKey,
      ageBand: selectedAgeBand,
      tobaccoKey: selectedTobacco
    },
    found,
    fallbacks
  }
}

export function calculateSavings(
  currentMonthly: number,
  newMonthly: number
): SavingsCalculation {
  const monthlySavings = currentMonthly - newMonthly
  const annualSavings = monthlySavings * 12
  const percentageSavings = currentMonthly > 0 
    ? (monthlySavings / currentMonthly) * 100 
    : 0
  const isIncrease = monthlySavings < 0

  return {
    currentMonthly,
    newMonthly,
    monthlySavings: Math.abs(monthlySavings),
    annualSavings: Math.abs(annualSavings),
    percentageSavings: Math.abs(percentageSavings),
    isIncrease
  }
}

export function getAllPlanRates(
  state: StateCode | 'ALL',
  age: number,
  tobacco: boolean
): Array<{
  plan: PlanName
  monthlyPremium: number
  annualPremium: number
  fallbacks: string[]
}> {
  return PLAN_NAMES.map(plan => {
    const result = resolvePrice({ product: plan, state, age, tobacco })
    return {
      plan,
      monthlyPremium: result.monthlyPremium,
      annualPremium: result.annualPremium,
      fallbacks: result.fallbacks
    }
  }).sort((a, b) => a.monthlyPremium - b.monthlyPremium)
}

export function getQuickPaymentAmounts(): number[] {
  return [400, 600, 800, 1000, 1200]
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatPercentage(percentage: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(percentage / 100)
}

// Get rate table metadata
export function getRateTableMetadata() {
  return rateTable.metadata
}
