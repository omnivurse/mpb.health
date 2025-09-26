'use client'

import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatPercentage } from '@/lib/rateEngine'
import { cn } from '@/lib/utils'

interface SavingsPanelProps {
  currentMonthly: number
  newMonthly: number
  monthlySavings: number
  annualSavings: number
  percentageSavings: number
  isIncrease: boolean
  className?: string
  variant?: 'default' | 'compact' | 'featured'
}

export function SavingsPanel({
  currentMonthly,
  newMonthly,
  monthlySavings,
  annualSavings,
  percentageSavings,
  isIncrease,
  className,
  variant = 'default'
}: SavingsPanelProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-4'
      case 'featured':
        return 'p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
      default:
        return 'p-6'
    }
  }

  const getIconAndColors = () => {
    if (isIncrease) {
      return {
        icon: TrendingUp,
        colorClasses: 'text-orange-600 bg-orange-50 border-orange-200',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-50'
      }
    } else {
      return {
        icon: TrendingDown,
        colorClasses: 'text-green-600 bg-green-50 border-green-200',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50'
      }
    }
  }

  const { icon: Icon, colorClasses, textColor, bgColor } = getIconAndColors()

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(colorClasses, getVariantClasses())}>
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-center mb-4">
            <div className={cn('p-3 rounded-full', bgColor)}>
              <Icon className={cn('w-6 h-6', textColor)} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {isIncrease ? 'Cost Comparison' : 'Your Potential Savings'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Compared to your current monthly amount
            </p>
          </div>

          {/* Savings Amount */}
          <div className="text-center mb-6">
            <div className="space-y-2">
              <p className={cn('text-3xl font-bold', textColor)}>
                {formatCurrency(monthlySavings)}
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </p>
              <p className={cn('text-xl font-semibold', textColor)}>
                {formatCurrency(annualSavings)}
                <span className="text-sm font-normal text-muted-foreground">/year</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {isIncrease ? 'Additional cost' : 'Savings'} of {formatPercentage(percentageSavings)}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Current monthly:</span>
              <span className="font-medium">{formatCurrency(currentMonthly)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">New monthly:</span>
              <span className="font-medium">{formatCurrency(newMonthly)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className={cn('text-sm font-medium', textColor)}>
                {isIncrease ? 'Monthly increase:' : 'Monthly savings:'}
              </span>
              <span className={cn('font-bold', textColor)}>
                {formatCurrency(monthlySavings)}
              </span>
            </div>
          </div>

          {/* Call to Action (for featured variant) */}
          {variant === 'featured' && !isIncrease && (
            <motion.div 
              className="mt-6 pt-6 border-t border-border/50 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-sm text-muted-foreground mb-3">
                Ready to start saving on healthcare?
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a 
                  href="/quote"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-mpb-blue text-white text-sm font-medium rounded-lg hover:bg-mpb-blue-dark transition-colors"
                >
                  Get Full Quote
                </a>
                <a 
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-mpb-blue text-mpb-blue text-sm font-medium rounded-lg hover:bg-mpb-blue/5 transition-colors"
                >
                  Speak with Advisor
                </a>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Preset variants
export function CompactSavingsPanel(props: Omit<SavingsPanelProps, 'variant'>) {
  return <SavingsPanel {...props} variant="compact" />
}

export function FeaturedSavingsPanel(props: Omit<SavingsPanelProps, 'variant'>) {
  return <SavingsPanel {...props} variant="featured" />
}

// Simplified savings display for inline use
export function InlineSavings({
  monthlySavings,
  isIncrease,
  className
}: {
  monthlySavings: number
  isIncrease: boolean
  className?: string
}) {
  return (
    <div className={cn(
      'inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium',
      isIncrease 
        ? 'bg-orange-100 text-orange-700' 
        : 'bg-green-100 text-green-700',
      className
    )}>
      <DollarSign className="w-4 h-4" />
      <span>
        {isIncrease ? '+' : '-'}{formatCurrency(monthlySavings)}/mo
      </span>
    </div>
  )
}
