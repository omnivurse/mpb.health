'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Info, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { 
  resolvePrice, 
  getAllPlanRates, 
  calculateSavings,
  getQuickPaymentAmounts,
  formatCurrency,
  PLAN_NAMES,
  type PlanName,
  type RateCalculationResult,
  type SavingsCalculation
} from '@/lib/rateEngine'
import { getStateOptions, isValidAge, type StateCode } from '@/lib/ageBands'
import { useAnalytics } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface RateCalculatorProps {
  defaultProduct?: PlanName
  showQuickAmounts?: boolean
  showAllPlans?: boolean
  className?: string
  variant?: 'default' | 'compact' | 'embedded'
}

interface CalculationState {
  product: PlanName | ''
  state: StateCode | ''
  age: string
  tobacco: boolean
  currentMonthly: string
  results: RateCalculationResult | null
  allPlanResults: Array<{
    plan: PlanName
    monthlyPremium: number
    annualPremium: number
    fallbacks: string[]
  }> | null
  savings: SavingsCalculation | null
  loading: boolean
  error: string | null
}

export function RateCalculator({
  defaultProduct,
  showQuickAmounts = true,
  showAllPlans = false,
  className,
  variant = 'default'
}: RateCalculatorProps) {
  const { track } = useAnalytics()
  const [state, setState] = useState<CalculationState>({
    product: defaultProduct || '',
    state: '',
    age: '',
    tobacco: false,
    currentMonthly: '',
    results: null,
    allPlanResults: null,
    savings: null,
    loading: false,
    error: null
  })

  const quickAmounts = getQuickPaymentAmounts()
  const stateOptions = getStateOptions()

  // Calculate rates when inputs change
  useEffect(() => {
    if (state.product && state.state && state.age) {
      calculateRates()
    }
  }, [state.product, state.state, state.age, state.tobacco])

  // Calculate savings when current monthly changes
  useEffect(() => {
    if (state.results && state.currentMonthly) {
      const currentAmount = parseFloat(state.currentMonthly)
      if (currentAmount > 0) {
        const savings = calculateSavings(currentAmount, state.results.monthlyPremium)
        setState(prev => ({ ...prev, savings }))
        
        track('savings_shown', {
          currentMonthly: currentAmount,
          newMonthly: state.results.monthlyPremium,
          monthlySavings: savings.monthlySavings
        })
      } else {
        setState(prev => ({ ...prev, savings: null }))
      }
    }
  }, [state.results, state.currentMonthly])

  const calculateRates = async () => {
    if (!state.product || !state.state || !state.age) return

    const age = parseInt(state.age)
    if (!isValidAge(age)) {
      setState(prev => ({ ...prev, error: 'Please enter a valid age between 0 and 120' }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      if (showAllPlans) {
        // Calculate rates for all plans
        const allRates = getAllPlanRates(state.state as StateCode, age, state.tobacco)
        setState(prev => ({ 
          ...prev, 
          allPlanResults: allRates,
          results: null,
          loading: false 
        }))
      } else {
        // Calculate rate for specific plan
        const result = resolvePrice({
          product: state.product,
          state: state.state as StateCode,
          age,
          tobacco: state.tobacco
        })
        
        setState(prev => ({ 
          ...prev, 
          results: result,
          allPlanResults: null,
          loading: false 
        }))
        
        track('calculator_result', {
          product: state.product,
          monthlyPremium: result.monthlyPremium,
          annualPremium: result.annualPremium
        })
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false 
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    track('calculator_submit', {
      product: state.product,
      state: state.state,
      age: parseInt(state.age),
      tobacco: state.tobacco
    })
    
    calculateRates()
  }

  const handleQuickAmountClick = (amount: number) => {
    setState(prev => ({ ...prev, currentMonthly: amount.toString() }))
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-4'
      case 'embedded':
        return 'border-0 shadow-none bg-transparent p-0'
      default:
        return 'p-6'
    }
  }

  return (
    <motion.div
      className={cn('w-full max-w-4xl mx-auto', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className={getVariantClasses()}>
        {variant !== 'embedded' && (
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Calculator className="w-6 h-6 text-mpb-blue" />
              <span>Rate Calculator</span>
            </CardTitle>
            <CardDescription>
              Get instant rates for health sharing plans. No personal information required.
            </CardDescription>
          </CardHeader>
        )}
        
        <CardContent className={variant === 'embedded' ? 'p-0' : undefined}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Plan Selection */}
              {!showAllPlans && (
                <div className="space-y-2">
                  <Label htmlFor="product">Plan</Label>
                  <Select 
                    value={state.product} 
                    onValueChange={(value) => setState(prev => ({ ...prev, product: value as PlanName }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_NAMES.map((plan) => (
                        <SelectItem key={plan} value={plan}>
                          {plan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* State Selection */}
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select 
                  value={state.state} 
                  onValueChange={(value) => setState(prev => ({ ...prev, state: value as StateCode }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age Input */}
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  value={state.age}
                  onChange={(e) => setState(prev => ({ ...prev, age: e.target.value }))}
                  min="0"
                  max="120"
                />
              </div>

              {/* Tobacco Selection */}
              <div className="space-y-2">
                <Label htmlFor="tobacco">Tobacco Use</Label>
                <Select 
                  value={state.tobacco ? 'yes' : 'no'} 
                  onValueChange={(value) => setState(prev => ({ ...prev, tobacco: value === 'yes' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Current Monthly (Optional) */}
            <div className="space-y-3">
              <Label htmlFor="current-monthly">
                What are you paying now? (Optional)
              </Label>
              <div className="flex flex-col space-y-3">
                <Input
                  id="current-monthly"
                  type="number"
                  placeholder="Enter current monthly amount"
                  value={state.currentMonthly}
                  onChange={(e) => setState(prev => ({ ...prev, currentMonthly: e.target.value }))}
                  min="0"
                />
                
                {/* Quick Amount Chips */}
                {showQuickAmounts && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground py-2">Quick select:</span>
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAmountClick(amount)}
                        className="text-xs"
                      >
                        {formatCurrency(amount)}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={state.loading || !state.state || !state.age}
            >
              {state.loading ? 'Calculating...' : 'Calculate Rates'}
            </Button>
          </form>

          {/* Error Display */}
          {state.error && (
            <motion.div
              className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start space-x-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/80">{state.error}</p>
              </div>
            </motion.div>
          )}

          {/* Results Display */}
          {(state.results || state.allPlanResults) && (
            <motion.div
              className="mt-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Single Plan Result */}
              {state.results && (
                <div className="bg-mpb-blue/5 border border-mpb-blue/20 rounded-xl p-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {formatCurrency(state.results.monthlyPremium)}
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    </h3>
                    <p className="text-muted-foreground">
                      {formatCurrency(state.results.annualPremium)} annually
                    </p>
                    
                    {state.results.fallbacks.length > 0 && (
                      <div className="mt-4 p-3 bg-background/50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Info className="w-4 h-4 text-mpb-blue mt-0.5" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">Rate Adjustments:</p>
                            {state.results.fallbacks.map((fallback, index) => (
                              <p key={index} className="text-xs text-muted-foreground">
                                {fallback}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* All Plans Results */}
              {state.allPlanResults && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center">All Plan Rates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {state.allPlanResults.map((plan) => (
                      <div
                        key={plan.plan}
                        className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-foreground mb-2">{plan.plan}</h4>
                        <div className="text-center">
                          <p className="text-xl font-bold text-mpb-blue">
                            {formatCurrency(plan.monthlyPremium)}
                            <span className="text-sm font-normal text-muted-foreground">/mo</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(plan.annualPremium)}/year
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Savings Display */}
              {state.savings && (
                <div className={cn(
                  'border rounded-xl p-6',
                  state.savings.isIncrease 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-green-50 border-green-200'
                )}>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold mb-2">
                      {state.savings.isIncrease ? 'Cost Increase' : 'Your Savings'}
                    </h4>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(state.savings.monthlySavings)}/month
                      </p>
                      <p className="text-lg text-muted-foreground">
                        {formatCurrency(state.savings.annualSavings)}/year
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {state.savings.isIncrease ? 'Increase' : 'Savings'} of {state.savings.percentageSavings.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>Important:</strong> Rates shown are estimates only. 
                  Final sharing amounts are determined at enrollment and subject to underwriting.
                </p>
                <p>
                  Medical cost sharing is not traditional health insurance and is not guaranteed.
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
