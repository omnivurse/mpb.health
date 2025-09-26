'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Check, AlertCircle, Phone, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAnalytics } from '@/lib/analytics'
import { cn } from '@/lib/utils'

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  source: z.string().optional()
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface ContactFormProps {
  title?: string
  description?: string
  source?: string
  className?: string
  variant?: 'default' | 'compact' | 'inline'
  onSuccess?: (data: ContactFormData) => void
}

const subjectOptions = [
  { value: 'quote', label: 'Get a Quote' },
  { value: 'plans', label: 'Plan Information' },
  { value: 'enrollment', label: 'Enrollment Help' },
  { value: 'member-support', label: 'Member Support' },
  { value: 'billing', label: 'Billing Question' },
  { value: 'group', label: 'Group Plans' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'other', label: 'Other' }
]

export function ContactForm({
  title = 'Send Us a Message',
  description = 'Fill out the form below and we\'ll get back to you within one business day.',
  source,
  className,
  variant = 'default',
  onSuccess
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { track } = useAnalytics()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      source: source || 'contact-form'
    }
  })

  const watchedSubject = watch('subject')

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Track form submission
      track('lead_submit', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: data.source
      })

      // Submit to API
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      // Success
      track('lead_submit_success', { email: data.email })
      setIsSubmitted(true)
      
      if (onSuccess) {
        onSuccess(data)
      }

      // Reset form after delay
      setTimeout(() => {
        reset()
        setIsSubmitted(false)
      }, 5000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setSubmitError(errorMessage)
      track('lead_submit_error', { error: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-4'
      case 'inline':
        return 'border-0 shadow-none bg-transparent p-0'
      default:
        return 'p-6'
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        className={cn('w-full max-w-2xl mx-auto', className)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center p-8 bg-green-50 border-green-200">
          <CardContent className="p-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Message Sent Successfully!
            </h3>
            <p className="text-green-700 mb-6">
              Thank you for contacting us. We'll get back to you within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline">
                <a href="/plans">View Plans</a>
              </Button>
              <Button asChild>
                <a href="/quote">Get Free Quote</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn('w-full max-w-2xl mx-auto', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className={getVariantClasses()}>
        {variant !== 'inline' && (
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <MessageSquare className="w-6 h-6 text-mpb-blue" />
              <span>{title}</span>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        )}
        
        <CardContent className={variant === 'inline' ? 'p-0' : undefined}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Phone and Subject Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  {...register('phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('subject', value)}>
                  <SelectTrigger className={errors.subject ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-sm text-red-500">{errors.subject.message}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us how we can help you..."
                rows={4}
                {...register('message')}
                className={errors.message ? 'border-red-500' : ''}
              />
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>

            {/* Error Display */}
            {submitError && (
              <motion.div
                className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>

            {/* Contact Alternative */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Prefer to call or email directly?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="tel:(855) 662-4325"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm border border-mpb-blue text-mpb-blue rounded-lg hover:bg-mpb-blue/5 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  (855) 662-4325
                </a>
                <a 
                  href="mailto:support@mpbhealth.com"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm border border-mpb-blue text-mpb-blue rounded-lg hover:bg-mpb-blue/5 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  support@mpbhealth.com
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Preset variants
export function CompactContactForm(props: Omit<ContactFormProps, 'variant'>) {
  return <ContactForm {...props} variant="compact" />
}

export function InlineContactForm(props: Omit<ContactFormProps, 'variant'>) {
  return <ContactForm {...props} variant="inline" />
}

// Quick quote request form
export function QuoteRequestForm({
  className,
  onSuccess
}: {
  className?: string
  onSuccess?: (data: ContactFormData) => void
}) {
  return (
    <ContactForm
      title="Request Your Free Quote"
      description="Get personalized plan recommendations and speak with a healthcare advisor."
      source="quote-request"
      className={className}
      variant="compact"
      onSuccess={onSuccess}
    />
  )
}
