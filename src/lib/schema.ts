import { z } from 'zod'

// Common schemas
export const CTASchema = z.object({
  text: z.string(),
  href: z.string(),
  variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
  size: z.enum(['sm', 'md', 'lg']).default('md')
})

export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string().optional(),
  content: z.string(),
  rating: z.number().min(1).max(5).optional(),
  avatar: z.string().optional(),
  plan: z.string().optional()
})

export const FAQItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  category: z.string().optional()
})

export const PlanFeatureSchema = z.object({
  text: z.string(),
  included: z.boolean().default(true),
  highlight: z.boolean().default(false)
})

export const PlanCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  features: z.array(PlanFeatureSchema),
  popular: z.boolean().default(false),
  hsaEligible: z.boolean().default(false)
})

// Home page schema
export const HomeSchema = z.object({
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
    description: z.string(),
    ctas: z.array(CTASchema),
    backgroundImage: z.string().optional()
  }),
  valueProps: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string()
  })),
  mpbWay: z.object({
    title: z.string(),
    description: z.string(),
    benefits: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string()
    }))
  }),
  whatIsSharing: z.object({
    title: z.string(),
    description: z.string(),
    keyPoints: z.array(z.string())
  }),
  howItWorks: z.object({
    title: z.string(),
    description: z.string(),
    steps: z.array(z.object({
      step: z.number(),
      title: z.string(),
      description: z.string(),
      icon: z.string()
    }))
  }),
  testimonial: TestimonialSchema,
  faq: z.array(FAQItemSchema),
  appHighlight: z.object({
    title: z.string(),
    description: z.string(),
    features: z.array(z.string()),
    cta: CTASchema,
    image: z.string().optional()
  }),
  ctas: z.object({
    primary: CTASchema,
    secondary: CTASchema
  }),
  disclaimers: z.array(z.string())
})

// Individuals page schema
export const IndividualsSchema = z.object({
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
    description: z.string(),
    ctas: z.array(CTASchema)
  }),
  positioning: z.object({
    title: z.string(),
    description: z.string(),
    painPoints: z.array(z.string()),
    solutions: z.array(z.string())
  }),
  services: z.object({
    title: z.string(),
    description: z.string(),
    grid: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
      features: z.array(z.string())
    }))
  }),
  benefits: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string()
  })),
  ctas: z.array(CTASchema),
  testimonials: z.array(TestimonialSchema)
})

// Groups page schema
export const GroupsSchema = z.object({
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
    description: z.string(),
    ctas: z.array(CTASchema)
  }),
  employerFocus: z.object({
    title: z.string(),
    description: z.string(),
    benefits: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string()
    }))
  }),
  contractorFocus: z.object({
    title: z.string(),
    description: z.string(),
    benefits: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string()
    }))
  }),
  acaCompliance: z.object({
    title: z.string(),
    description: z.string(),
    pairings: z.array(z.string())
  }),
  advisorCTA: z.object({
    title: z.string(),
    description: z.string(),
    cta: CTASchema
  })
})

// Quote page schema
export const QuoteSchema = z.object({
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
    description: z.string()
  }),
  calculator: z.object({
    title: z.string(),
    description: z.string(),
    disclaimer: z.string()
  }),
  reassurance: z.object({
    title: z.string(),
    points: z.array(z.object({
      icon: z.string(),
      text: z.string()
    }))
  }),
  form: z.object({
    title: z.string(),
    description: z.string(),
    cta: CTASchema
  })
})

// Portal page schema
export const PortalSchema = z.object({
  hero: z.object({
    headline: z.string(),
    description: z.string(),
    cta: CTASchema
  }),
  appServices: z.object({
    title: z.string(),
    description: z.string(),
    features: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string()
    }))
  }),
  quickLinks: z.array(z.object({
    title: z.string(),
    href: z.string(),
    description: z.string(),
    icon: z.string()
  }))
})

// Plans page schema
export const PlansSchema = z.object({
  hero: z.object({
    headline: z.string(),
    description: z.string()
  }),
  plans: z.array(PlanCardSchema),
  comparison: z.object({
    title: z.string(),
    description: z.string()
  }),
  disclaimers: z.array(z.string())
})

// About page schema
export const AboutSchema = z.object({
  hero: z.object({
    headline: z.string(),
    description: z.string()
  }),
  mission: z.object({
    title: z.string(),
    description: z.string(),
    values: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string()
    }))
  }),
  differentiation: z.object({
    title: z.string(),
    description: z.string(),
    points: z.array(z.object({
      title: z.string(),
      description: z.string()
    }))
  }),
  transparency: z.object({
    title: z.string(),
    description: z.string(),
    commitments: z.array(z.string())
  }),
  community: z.object({
    title: z.string(),
    description: z.string(),
    model: z.string()
  })
})

// Contact page schema
export const ContactSchema = z.object({
  hero: z.object({
    headline: z.string(),
    description: z.string()
  }),
  contactInfo: z.object({
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string()
    }),
    phone: z.string(),
    email: z.string(),
    hours: z.string()
  }),
  form: z.object({
    title: z.string(),
    description: z.string(),
    cta: CTASchema
  }),
  links: z.array(z.object({
    title: z.string(),
    href: z.string(),
    description: z.string()
  }))
})

// FAQ schema
export const FAQSchema = z.object({
  hero: z.object({
    headline: z.string(),
    description: z.string()
  }),
  categories: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    faqs: z.array(FAQItemSchema)
  }))
})

// Export type definitions
export type CTA = z.infer<typeof CTASchema>
export type Testimonial = z.infer<typeof TestimonialSchema>
export type FAQItem = z.infer<typeof FAQItemSchema>
export type PlanFeature = z.infer<typeof PlanFeatureSchema>
export type PlanCard = z.infer<typeof PlanCardSchema>
export type Home = z.infer<typeof HomeSchema>
export type Individuals = z.infer<typeof IndividualsSchema>
export type Groups = z.infer<typeof GroupsSchema>
export type Quote = z.infer<typeof QuoteSchema>
export type Portal = z.infer<typeof PortalSchema>
export type Plans = z.infer<typeof PlansSchema>
export type About = z.infer<typeof AboutSchema>
export type Contact = z.infer<typeof ContactSchema>
export type FAQ = z.infer<typeof FAQSchema>
