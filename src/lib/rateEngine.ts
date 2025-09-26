import { RateTables, TobaccoKey } from "./rateConfig";
import { toBand } from "./ageBands";

export type MPBProduct =
  | "Essentials"
  | "Direct"
  | "Care Plus"
  | "Secure HSA"
  | "Premium Care"
  | "Premium HSA";

export type RateInput = {
  product: MPBProduct;
  state?: string;           // 2-letter, optional
  age: number;              // 0..120
  tobacco: Exclude<TobaccoKey, "ALL">; // "Yes" | "No"
};

export type RateResult = {
  monthly: number;
  path: { product: string; stateKey: string; ageBand: string; tobaccoKey: TobaccoKey };
  fallbacks: string[]; // notes of any fallback used
};

export type RateInputWithCompare = RateInput & { currentMonthly?: number | null };

export type RateResultWithCompare = RateResult & {
  comparison?: { 
    currentMonthly?: number; 
    deltaMonthly?: number; 
    deltaAnnual?: number; 
    direction: "savings" | "increase" | "same" 
  };
};

export function resolvePrice(tables: RateTables, input: RateInput): RateResult {
  const fallbacks: string[] = [];

  const P = tables.rate_tables[input.product];
  if (!P) throw new Error(`Unknown product: ${input.product}`);

  const stateKey = (input.state && P[input.state]) ? input.state : (P["ALL"] ? "ALL" : null);
  if (!stateKey) throw new Error(`No pricing for state ${input.state ?? "(none)"} and no ALL fallback.`);
  if (stateKey === "ALL") fallbacks.push("Used ALL-state fallback.");

  const stateTable = P[stateKey];
  const bands = Object.keys(stateTable);
  const ageBand = toBand(input.age, bands);
  if (!stateTable[ageBand]) {
    if (stateTable["ALL"]) {
      fallbacks.push("Used ALL-age fallback.");
    } else {
      throw new Error(`No matching age band for age=${input.age} and no ALL fallback.`);
    }
  }
  const bandTable = stateTable[ageBand] ?? stateTable["ALL"];

  const tobKey: TobaccoKey = (bandTable[input.tobacco] != null) ? input.tobacco : (
    bandTable["ALL"] != null ? "ALL" : null as any
  );
  if (!tobKey) throw new Error("No tobacco option and no ALL fallback.");
  if (tobKey === "ALL") fallbacks.push("Used ALL-tobacco fallback.");

  const monthly = bandTable[tobKey]!;
  return { monthly, path: { product: input.product, stateKey, ageBand, tobaccoKey: tobKey }, fallbacks };
}

export function attachComparison(res: RateResult, currentMonthly?: number | null): RateResultWithCompare {
  if (typeof currentMonthly !== "number") return res;
  const deltaMonthly = currentMonthly - res.monthly;
  const direction = deltaMonthly > 0 ? "savings" : deltaMonthly < 0 ? "increase" : "same";
  return { ...res, comparison: { currentMonthly, deltaMonthly, deltaAnnual: deltaMonthly * 12, direction } };
}

// Legacy functions for compatibility
export const PLAN_NAMES = [
  'Essentials',
  'Direct', 
  'Care Plus',
  'Secure HSA',
  'Premium Care',
  'Premium HSA'
] as const;

export type PlanName = typeof PLAN_NAMES[number];

export function isPlanName(name: string): name is PlanName {
  return PLAN_NAMES.includes(name as PlanName);
}

export function getQuickPaymentAmounts(): number[] {
  return [400, 600, 800, 1000, 1200];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(percentage: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(percentage / 100);
}