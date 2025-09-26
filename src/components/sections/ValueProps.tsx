'use client'

import { motion } from 'framer-motion'
import { 
  Heart, 
  DollarSign, 
  Users, 
  ShieldCheck,
  Activity,
  Brain,
  Stethoscope,
  Pill,
  Calendar,
  Smartphone,
  Video,
  Clock,
  Eye,
  Unlock,
  Lightbulb,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Icon mapping for dynamic icon selection
const iconMap = {
  heart: Heart,
  'dollar-sign': DollarSign,
  users: Users,
  'shield-check': ShieldCheck,
  activity: Activity,
  brain: Brain,
  stethoscope: Stethoscope,
  pill: Pill,
  calendar: Calendar,
  smartphone: Smartphone,
  video: Video,
  clock: Clock,
  eye: Eye,
  unlock: Unlock,
  lightbulb: Lightbulb,
  shield: Shield
}

interface ValueProp {
  icon: string
  title: string
  description: string
}

interface ValuePropsProps {
  title?: string
  description?: string
  valueProps: ValueProp[]
  className?: string
  columns?: 2 | 3 | 4
  variant?: 'default' | 'cards' | 'minimal'
}

export function ValueProps({
  title,
  description,
  valueProps,
  className,
  columns = 3,
  variant = 'default'
}: ValuePropsProps) {
  const getGridClasses = () => {
    switch (columns) {
      case 2:
        return 'md:grid-cols-2'
      case 3:
        return 'md:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'cards':
        return 'bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow'
      case 'minimal':
        return 'text-center'
      default:
        return 'text-center lg:text-left'
    }
  }

  return (
    <section className={cn('py-16 lg:py-24', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || description) && (
          <motion.div 
            className="text-center mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </motion.div>
        )}

        {/* Value Props Grid */}
        <div className={cn(
          'grid grid-cols-1 gap-8 lg:gap-12',
          getGridClasses()
        )}>
          {valueProps.map((prop, index) => {
            const IconComponent = iconMap[prop.icon as keyof typeof iconMap] || Heart
            
            return (
              <motion.div
                key={index}
                className={getVariantClasses()}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Icon */}
                <div className={cn(
                  'mb-4',
                  variant === 'cards' ? 'flex justify-center' : 'flex justify-center lg:justify-start'
                )}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-mpb-blue/10 text-mpb-blue">
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg lg:text-xl font-semibold text-foreground">
                    {prop.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Preset variants for common use cases
export function ValuePropsCards(props: Omit<ValuePropsProps, 'variant'>) {
  return <ValueProps {...props} variant="cards" />
}

export function ValuePropsMinimal(props: Omit<ValuePropsProps, 'variant'>) {
  return <ValueProps {...props} variant="minimal" />
}

export function BenefitsGrid(props: Omit<ValuePropsProps, 'variant' | 'columns'>) {
  return <ValueProps {...props} variant="cards" columns={2} />
}
