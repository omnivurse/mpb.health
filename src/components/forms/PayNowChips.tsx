'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/rateEngine'
import { cn } from '@/lib/utils'

interface PayNowChipsProps {
  amounts: number[]
  selectedAmount?: number
  onAmountSelect: (amount: number) => void
  label?: string
  className?: string
  variant?: 'default' | 'compact' | 'pills'
}

export function PayNowChips({
  amounts,
  selectedAmount,
  onAmountSelect,
  label = 'Quick select:',
  className,
  variant = 'default'
}: PayNowChipsProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'gap-1'
      case 'pills':
        return 'gap-2'
      default:
        return 'gap-2'
    }
  }

  const getButtonSize = (): 'sm' | 'default' | 'lg' | 'icon' => {
    switch (variant) {
      case 'compact':
        return 'sm'
      default:
        return 'sm'
    }
  }

  const getButtonVariant = (amount: number): 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' => {
    return selectedAmount === amount ? 'default' : 'outline'
  }

  return (
    <motion.div 
      className={cn('flex flex-wrap items-center', getVariantClasses(), className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {label && (
        <span className="text-sm text-muted-foreground py-2 mr-2">
          {label}
        </span>
      )}
      
      {amounts.map((amount, index) => (
        <motion.div
          key={amount}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Button
            type="button"
            variant={getButtonVariant(amount)}
            size={getButtonSize()}
            onClick={() => onAmountSelect(amount)}
            className={cn(
              'transition-all duration-200',
              selectedAmount === amount && 'ring-2 ring-mpb-blue/20',
              variant === 'pills' && 'rounded-full'
            )}
          >
            {formatCurrency(amount)}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Preset variants
export function CompactPayNowChips(props: Omit<PayNowChipsProps, 'variant'>) {
  return <PayNowChips {...props} variant="compact" />
}

export function PillPayNowChips(props: Omit<PayNowChipsProps, 'variant'>) {
  return <PayNowChips {...props} variant="pills" />
}

// Quick amount selector with common healthcare premium amounts
export function HealthcarePremiumChips({
  onAmountSelect,
  selectedAmount,
  className
}: {
  onAmountSelect: (amount: number) => void
  selectedAmount?: number
  className?: string
}) {
  const commonAmounts = [300, 400, 500, 600, 800, 1000, 1200, 1500]
  
  return (
    <PayNowChips
      amounts={commonAmounts}
      selectedAmount={selectedAmount}
      onAmountSelect={onAmountSelect}
      label="Common amounts:"
      className={className}
    />
  )
}

// Budget-friendly amounts for individuals
export function IndividualBudgetChips({
  onAmountSelect,
  selectedAmount,
  className
}: {
  onAmountSelect: (amount: number) => void
  selectedAmount?: number
  className?: string
}) {
  const budgetAmounts = [150, 200, 250, 300, 400, 500]
  
  return (
    <PayNowChips
      amounts={budgetAmounts}
      selectedAmount={selectedAmount}
      onAmountSelect={onAmountSelect}
      label="Individual plans:"
      className={className}
      variant="pills"
    />
  )
}

// Family premium amounts
export function FamilyPremiumChips({
  onAmountSelect,
  selectedAmount,
  className
}: {
  onAmountSelect: (amount: number) => void
  selectedAmount?: number
  className?: string
}) {
  const familyAmounts = [600, 800, 1000, 1200, 1500, 1800, 2000]
  
  return (
    <PayNowChips
      amounts={familyAmounts}
      selectedAmount={selectedAmount}
      onAmountSelect={onAmountSelect}
      label="Family plans:"
      className={className}
    />
  )
}
