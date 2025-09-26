'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Testimonial as TestimonialType } from '@/lib/schema'

interface TestimonialProps {
  testimonial: TestimonialType
  className?: string
  variant?: 'default' | 'card' | 'featured'
}

interface TestimonialsGridProps {
  title?: string
  description?: string
  testimonials: TestimonialType[]
  className?: string
  columns?: 1 | 2 | 3
}

// Single Testimonial Component
export function Testimonial({ 
  testimonial, 
  className, 
  variant = 'default' 
}: TestimonialProps) {
  const renderStars = (rating?: number) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center space-x-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-4 h-4',
              i < rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            )}
          />
        ))}
      </div>
    )
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'
      case 'featured':
        return 'bg-gradient-to-br from-mpb-blue/5 to-mpb-light/10 border border-mpb-blue/20 rounded-2xl p-8'
      default:
        return 'text-center'
    }
  }

  return (
    <motion.div
      className={cn(getVariantClasses(), className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {variant === 'featured' && (
        <div className="flex justify-center mb-4">
          <Quote className="w-8 h-8 text-mpb-blue/40" />
        </div>
      )}

      {renderStars(testimonial.rating)}
      
      <blockquote className="text-foreground mb-4">
        {variant === 'featured' ? (
          <p className="text-lg lg:text-xl leading-relaxed font-medium">
            "{testimonial.content}"
          </p>
        ) : (
          <p className="leading-relaxed">
            "{testimonial.content}"
          </p>
        )}
      </blockquote>

      <footer className="flex items-center justify-center space-x-3">
        {testimonial.avatar && (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="text-center">
          <div className="font-semibold text-foreground">
            {testimonial.name}
          </div>
          <div className="text-sm text-muted-foreground">
            {testimonial.location}
            {testimonial.plan && (
              <span className="ml-2">• {testimonial.plan} Member</span>
            )}
          </div>
        </div>
      </footer>
    </motion.div>
  )
}

// Testimonials Grid Component
export function TestimonialsGrid({
  title,
  description,
  testimonials,
  className,
  columns = 3
}: TestimonialsGridProps) {
  const getGridClasses = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'md:grid-cols-2'
      case 3:
        return 'md:grid-cols-2 lg:grid-cols-3'
      default:
        return 'md:grid-cols-2 lg:grid-cols-3'
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

        {/* Testimonials Grid */}
        <div className={cn(
          'grid grid-cols-1 gap-8',
          getGridClasses()
        )}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Testimonial 
                testimonial={testimonial} 
                variant="card"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Featured Testimonial Component (for home page)
export function FeaturedTestimonial({ 
  testimonial, 
  className 
}: { 
  testimonial: TestimonialType
  className?: string 
}) {
  return (
    <section className={cn('py-16 lg:py-24 bg-muted/30', className)}>
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Testimonial 
            testimonial={testimonial} 
            variant="featured" 
          />
        </motion.div>
        
        {/* Call to Action */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Join {testimonial.name} and thousands of other satisfied members
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/quote"
              className="inline-flex items-center justify-center px-6 py-3 bg-mpb-blue text-white font-medium rounded-lg hover:bg-mpb-blue-dark transition-colors"
            >
              Get Your Free Quote
            </a>
            <a 
              href="/testimonials"
              className="inline-flex items-center justify-center px-6 py-3 border border-mpb-blue text-mpb-blue font-medium rounded-lg hover:bg-mpb-blue/5 transition-colors"
            >
              Read More Stories
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Preset variants
export function TestimonialCard(props: Omit<TestimonialProps, 'variant'>) {
  return <Testimonial {...props} variant="card" />
}

export function TestimonialDefault(props: Omit<TestimonialProps, 'variant'>) {
  return <Testimonial {...props} variant="default" />
}
