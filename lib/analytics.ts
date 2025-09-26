'use client'

import { useCallback } from 'react'

// Analytics event types
export type AnalyticsEvent = 
  | 'page_view'
  | 'nav_click'
  | 'cta_click'
  | 'calculator_submit'
  | 'calculator_result'
  | 'savings_shown'
  | 'lead_submit'
  | 'lead_submit_success'
  | 'lead_submit_error'
  | 'plan_view'
  | 'plan_compare'
  | 'quote_request'
  | 'download_start'
  | 'form_start'
  | 'form_abandon'
  | 'external_link_click'

export interface AnalyticsEventData {
  event: AnalyticsEvent
  properties?: Record<string, any>
  timestamp?: number
  page?: string
  userId?: string
  sessionId?: string
}

// Analytics provider interface (can be swapped for GA4, Pixel, etc.)
interface AnalyticsProvider {
  track: (event: AnalyticsEventData) => void
  identify: (userId: string, traits?: Record<string, any>) => void
  page: (name: string, properties?: Record<string, any>) => void
}

// Console analytics provider (for development)
class ConsoleAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEventData) {
    console.log('📊 Analytics Event:', {
      ...event,
      timestamp: event.timestamp || Date.now()
    })
  }

  identify(userId: string, traits?: Record<string, any>) {
    console.log('👤 Analytics Identify:', { userId, traits })
  }

  page(name: string, properties?: Record<string, any>) {
    console.log('📄 Analytics Page View:', { name, properties })
  }
}

// Google Analytics 4 provider (placeholder for future implementation)
class GA4AnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEventData) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, {
        custom_properties: event.properties,
        page_title: event.page,
        timestamp: event.timestamp || Date.now()
      })
    }
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        user_id: userId,
        custom_map: traits
      })
    }
  }

  page(name: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title: name,
        page_location: window.location.href,
        ...properties
      })
    }
  }
}

// Meta Pixel provider (placeholder for future implementation)
class MetaPixelProvider implements AnalyticsProvider {
  track(event: AnalyticsEventData) {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const eventMap: Record<string, string> = {
        'lead_submit': 'Lead',
        'calculator_submit': 'ViewContent',
        'plan_view': 'ViewContent',
        'quote_request': 'InitiateCheckout',
        'cta_click': 'PageView'
      }
      
      const fbEvent = eventMap[event.event] || 'CustomEvent'
      ;(window as any).fbq('track', fbEvent, event.properties)
    }
  }

  identify(userId: string, traits?: Record<string, any>) {
    // Meta Pixel doesn't have direct identify method
    this.track({
      event: 'page_view',
      properties: { user_id: userId, ...traits }
    })
  }

  page(name: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView', { page_name: name, ...properties })
    }
  }
}

// Analytics manager
class AnalyticsManager {
  private providers: AnalyticsProvider[] = []
  private isEnabled = true

  constructor() {
    // Initialize providers based on environment
    if (process.env.NODE_ENV === 'development') {
      this.providers.push(new ConsoleAnalyticsProvider())
    } else {
      // In production, add configured providers
      if (process.env.NEXT_PUBLIC_GA_ID) {
        this.providers.push(new GA4AnalyticsProvider())
      }
      if (process.env.NEXT_PUBLIC_META_PIXEL_ID) {
        this.providers.push(new MetaPixelProvider())
      }
      // Fallback to console if no providers configured
      if (this.providers.length === 0) {
        this.providers.push(new ConsoleAnalyticsProvider())
      }
    }
  }

  track(event: AnalyticsEvent, properties?: Record<string, any>) {
    if (!this.isEnabled) return

    const eventData: AnalyticsEventData = {
      event,
      properties,
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : undefined
    }

    this.providers.forEach(provider => {
      try {
        provider.track(eventData)
      } catch (error) {
        console.error('Analytics provider error:', error)
      }
    })
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (!this.isEnabled) return

    this.providers.forEach(provider => {
      try {
        provider.identify(userId, traits)
      } catch (error) {
        console.error('Analytics identify error:', error)
      }
    })
  }

  page(name: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return

    this.providers.forEach(provider => {
      try {
        provider.page(name, properties)
      } catch (error) {
        console.error('Analytics page error:', error)
      }
    })
  }

  disable() {
    this.isEnabled = false
  }

  enable() {
    this.isEnabled = true
  }
}

// Global analytics instance
const analytics = new AnalyticsManager()

// React hook for analytics
export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent, properties?: Record<string, any>) => {
    analytics.track(event, properties)
  }, [])

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
    analytics.identify(userId, traits)
  }, [])

  const page = useCallback((name: string, properties?: Record<string, any>) => {
    analytics.page(name, properties)
  }, [])

  return {
    track,
    identify,
    page
  }
}

// Utility functions for common events
export const trackEvent = {
  navClick: (item: string) => 
    analytics.track('nav_click', { item }),
  
  ctaClick: (text: string, location: string) => 
    analytics.track('cta_click', { text, location }),
  
  calculatorSubmit: (product: string, state: string, age: number, tobacco: boolean) =>
    analytics.track('calculator_submit', { product, state, age, tobacco }),
  
  calculatorResult: (product: string, monthlyPremium: number, annualPremium: number) =>
    analytics.track('calculator_result', { product, monthlyPremium, annualPremium }),
  
  savingsShown: (currentMonthly: number, newMonthly: number, monthlySavings: number) =>
    analytics.track('savings_shown', { currentMonthly, newMonthly, monthlySavings }),
  
  leadSubmit: (name: string, email: string, phone?: string, source?: string) =>
    analytics.track('lead_submit', { name, email, phone, source }),
  
  leadSubmitSuccess: (email: string) =>
    analytics.track('lead_submit_success', { email }),
  
  leadSubmitError: (error: string) =>
    analytics.track('lead_submit_error', { error }),
  
  planView: (planName: string) =>
    analytics.track('plan_view', { planName }),
  
  planCompare: (plans: string[]) =>
    analytics.track('plan_compare', { plans }),
  
  quoteRequest: (source: string) =>
    analytics.track('quote_request', { source }),
  
  externalLinkClick: (url: string, text: string) =>
    analytics.track('external_link_click', { url, text })
}

export default analytics
