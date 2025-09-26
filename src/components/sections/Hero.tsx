'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAnalytics } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import type { CTA } from '@/lib/schema'

interface HeroProps {
  headline: string
  subheadline?: string
  description: string
  ctas?: CTA[]
  backgroundImage?: string
  className?: string
  variant?: 'default' | 'centered' | 'split'
}

export function Hero({
  headline,
  subheadline,
  description,
  ctas = [],
  backgroundImage,
  className,
  variant = 'default'
}: HeroProps) {
  const { track } = useAnalytics()

  const handleCTAClick = (cta: CTA) => {
    track('cta_click', { 
      text: cta.text, 
      href: cta.href, 
      location: 'hero',
      variant: cta.variant 
    })
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'centered':
        return 'text-center items-center'
      case 'split':
        return 'lg:grid-cols-2 lg:gap-12'
      default:
        return ''
    }
  }

  return (
    <section className={cn(
      'relative py-16 lg:py-24 overflow-hidden',
      backgroundImage && 'bg-cover bg-center bg-no-repeat',
      className
    )} style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}>
      
      {/* Background Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-background/80" />
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-mpb-light/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={cn(
          'grid grid-cols-1 gap-8 max-w-5xl mx-auto',
          getVariantClasses()
        )}>
          
          {/* Content */}
          <motion.div 
            className={cn(
              'space-y-6',
              variant === 'centered' && 'mx-auto max-w-3xl'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {subheadline && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-block"
              >
                <span className="px-3 py-1 text-sm font-medium bg-mpb-blue/10 text-mpb-blue rounded-full">
                  {subheadline}
                </span>
              </motion.div>
            )}

            <motion.h1 
              className="text-4xl lg:text-6xl font-bold text-foreground leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {headline}
            </motion.h1>

            <motion.p 
              className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {description}
            </motion.p>

            {ctas.length > 0 && (
              <motion.div 
                className={cn(
                  'flex flex-col sm:flex-row gap-4',
                  variant === 'centered' && 'justify-center'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {ctas.map((cta, index) => (
                  <Button
                    key={index}
                    variant={cta.variant}
                    size={cta.size}
                    asChild
                    className={cn(
                      'min-w-[140px]',
                      cta.variant === 'primary' && 'shadow-lg hover:shadow-xl transition-shadow'
                    )}
                  >
                    <Link 
                      href={cta.href}
                      onClick={() => handleCTAClick(cta)}
                    >
                      {cta.text}
                    </Link>
                  </Button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Optional Image for Split Layout */}
          {variant === 'split' && backgroundImage && (
            <motion.div
              className="relative lg:block hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={backgroundImage}
                  alt="Hero illustration"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-mpb-blue/5 rounded-full blur-3xl -translate-y-48 translate-x-48" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-mpb-green/5 rounded-full blur-2xl translate-y-32 -translate-x-32" />
    </section>
  )
}

// Preset hero variants for common use cases
export function HomeHero(props: Omit<HeroProps, 'variant'>) {
  return <Hero {...props} variant="default" />
}

export function CenteredHero(props: Omit<HeroProps, 'variant'>) {
  return <Hero {...props} variant="centered" />
}

export function SplitHero(props: Omit<HeroProps, 'variant'>) {
  return <Hero {...props} variant="split" />
}
