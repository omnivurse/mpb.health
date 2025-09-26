'use client'

import { motion } from 'framer-motion'
import { 
  UserPlus, 
  FileText, 
  HeartHandshake,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Icon mapping for dynamic icon selection
const iconMap = {
  'user-plus': UserPlus,
  'file-text': FileText,
  'heart-handshake': HeartHandshake,
  'check-circle': CheckCircle
}

interface Step {
  step: number
  title: string
  description: string
  icon: string
}

interface HowItWorksProps {
  title: string
  description?: string
  steps: Step[]
  className?: string
  variant?: 'default' | 'horizontal' | 'timeline'
}

export function HowItWorks({
  title,
  description,
  steps,
  className,
  variant = 'default'
}: HowItWorksProps) {
  const renderStep = (step: Step, index: number, isLast: boolean) => {
    const IconComponent = iconMap[step.icon as keyof typeof iconMap] || UserPlus
    
    return (
      <motion.div
        key={step.step}
        className={cn(
          'relative',
          variant === 'horizontal' && 'flex-1',
          variant === 'timeline' && 'flex items-start space-x-4'
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        viewport={{ once: true }}
      >
        {/* Step Number & Icon */}
        <div className={cn(
          'relative z-10 mb-4',
          variant === 'timeline' && 'mb-0 flex-shrink-0'
        )}>
          <div className="flex items-center justify-center w-16 h-16 bg-mpb-blue text-white rounded-2xl shadow-lg">
            <IconComponent className="w-8 h-8" />
          </div>
          {/* Step Number Badge */}
          <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-mpb-green text-white text-sm font-bold rounded-full">
            {step.step}
          </div>
        </div>

        {/* Connector Line for Timeline */}
        {variant === 'timeline' && !isLast && (
          <div className="absolute left-8 top-16 w-px h-full bg-border" />
        )}

        {/* Content */}
        <div className={cn(
          variant === 'timeline' && 'flex-1 pb-8'
        )}>
          <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3">
            {step.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Arrow for Horizontal Layout */}
        {variant === 'horizontal' && !isLast && (
          <div className="hidden lg:flex absolute top-8 -right-6 z-20">
            <div className="flex items-center justify-center w-12 h-12 bg-background border-2 border-mpb-blue/20 rounded-full">
              <ArrowRight className="w-5 h-5 text-mpb-blue" />
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  const getContainerClasses = () => {
    switch (variant) {
      case 'horizontal':
        return 'flex flex-col lg:flex-row gap-8 lg:gap-16 relative'
      case 'timeline':
        return 'space-y-0'
      default:
        return 'grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12'
    }
  }

  return (
    <section className={cn('py-16 lg:py-24 bg-muted/30', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        {/* Steps */}
        <div className={getContainerClasses()}>
          {steps.map((step, index) => 
            renderStep(step, index, index === steps.length - 1)
          )}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-card border rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of members who've discovered the benefits of health sharing. 
              Get your free quote in just 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/quote"
                className="inline-flex items-center justify-center px-6 py-3 bg-mpb-blue text-white font-medium rounded-lg hover:bg-mpb-blue-dark transition-colors"
              >
                Get Free Quote
              </a>
              <a 
                href="/plans"
                className="inline-flex items-center justify-center px-6 py-3 border border-mpb-blue text-mpb-blue font-medium rounded-lg hover:bg-mpb-blue/5 transition-colors"
              >
                Compare Plans
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Preset variants
export function HowItWorksHorizontal(props: Omit<HowItWorksProps, 'variant'>) {
  return <HowItWorks {...props} variant="horizontal" />
}

export function HowItWorksTimeline(props: Omit<HowItWorksProps, 'variant'>) {
  return <HowItWorks {...props} variant="timeline" />
}
