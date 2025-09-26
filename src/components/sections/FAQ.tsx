'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import type { FAQItem } from '@/lib/schema'

interface FAQProps {
  title?: string
  description?: string
  faqs: FAQItem[]
  className?: string
  variant?: 'default' | 'compact' | 'categorized'
}

interface FAQCategoryProps {
  title: string
  description?: string
  faqs: FAQItem[]
  className?: string
}

// Single FAQ Section Component
export function FAQ({ 
  title, 
  description, 
  faqs, 
  className, 
  variant = 'default' 
}: FAQProps) {
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

        {/* FAQ Accordion */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={faq.id}
                  className={cn(
                    'border rounded-lg px-6 bg-card',
                    variant === 'compact' && 'px-4'
                  )}
                >
                  <AccordionTrigger className="text-left hover:no-underline hover:text-mpb-blue transition-colors">
                    <span className="font-medium">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-muted/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our healthcare advisors are here to help you understand health sharing 
              and find the right plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-mpb-blue text-white font-medium rounded-lg hover:bg-mpb-blue-dark transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="/quote"
                className="inline-flex items-center justify-center px-6 py-3 border border-mpb-blue text-mpb-blue font-medium rounded-lg hover:bg-mpb-blue/5 transition-colors"
              >
                Get Free Quote
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// FAQ Category Component (for full FAQ page)
export function FAQCategory({ 
  title, 
  description, 
  faqs, 
  className 
}: FAQCategoryProps) {
  return (
    <motion.div
      className={cn('mb-12 lg:mb-16', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Category Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Category FAQs */}
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            <AccordionItem 
              value={faq.id}
              className="border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-left hover:no-underline hover:text-mpb-blue transition-colors">
                <span className="font-medium">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  )
}

// Categorized FAQ Component (for full FAQ page with categories)
export function CategorizedFAQ({ 
  categories, 
  className 
}: { 
  categories: Array<{
    id: string
    title: string
    description: string
    faqs: FAQItem[]
  }>
  className?: string 
}) {
  return (
    <section className={cn('py-16 lg:py-24', className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {categories.map((category) => (
            <FAQCategory
              key={category.id}
              title={category.title}
              description={category.description}
              faqs={category.faqs}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Compact FAQ for sidebars or smaller sections
export function CompactFAQ(props: Omit<FAQProps, 'variant'>) {
  return <FAQ {...props} variant="compact" />
}
