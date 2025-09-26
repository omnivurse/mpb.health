import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { ValueProps } from '@/components/sections/ValueProps'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { FeaturedTestimonial } from '@/components/sections/Testimonial'
import { FAQ } from '@/components/sections/FAQ'
import { RateCalculator } from '@/components/forms/RateCalculator'
import { getHomeContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Access Top Health Sharing Plans',
  description: 'Join thousands who\'ve discovered affordable healthcare through medical cost sharing. Compare plans, get instant quotes, and access quality care without high premiums.',
}

export default function Home() {
  const content = getHomeContent()

  return (
    <>
      {/* Hero Section */}
      <Hero
        headline={content.hero.headline}
        subheadline={content.hero.subheadline}
        description={content.hero.description}
        ctas={content.hero.ctas}
        backgroundImage={content.hero.backgroundImage}
      />

      {/* Value Propositions */}
      <ValueProps
        title="Why Choose Health Sharing?"
        description="Discover the benefits of community-driven healthcare that puts you first."
        valueProps={content.valueProps}
      />

      {/* MPB Way Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {content.mpbWay.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {content.mpbWay.description}
            </p>
          </div>
          <ValueProps
            valueProps={content.mpbWay.benefits}
            variant="cards"
            columns={3}
            className="py-0"
          />
        </div>
      </section>

      {/* What is Health Sharing */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {content.whatIsSharing.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {content.whatIsSharing.description}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {content.whatIsSharing.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-mpb-blue/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-mpb-blue"></div>
                  </div>
                  <p className="text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks
        title={content.howItWorks.title}
        description={content.howItWorks.description}
        steps={content.howItWorks.steps}
      />

      {/* Rate Calculator Teaser */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              See How Much You Can Save
            </h2>
            <p className="text-lg text-muted-foreground">
              Get instant rates for all health sharing plans. No personal information required.
            </p>
          </div>
          <RateCalculator
            showAllPlans={true}
            showQuickAmounts={true}
            className="max-w-5xl"
          />
        </div>
      </section>

      {/* Featured Testimonial */}
      <FeaturedTestimonial testimonial={content.testimonial} />

      {/* App Highlight */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {content.appHighlight.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {content.appHighlight.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {content.appHighlight.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-mpb-green/10 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-mpb-green"></div>
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={content.appHighlight.cta.href}
                  className="inline-flex items-center justify-center px-6 py-3 bg-mpb-blue text-white font-medium rounded-lg hover:bg-mpb-blue-dark transition-colors"
                >
                  {content.appHighlight.cta.text}
                </a>
              </div>
              <div className="lg:text-center">
                <div className="bg-gradient-to-br from-mpb-blue/10 to-mpb-light/20 rounded-2xl p-8 lg:p-12">
                  <div className="w-64 h-96 bg-white rounded-3xl shadow-2xl mx-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-mpb-blue to-mpb-blue-dark opacity-10"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-8 bg-mpb-blue/20 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-32 bg-gray-100 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ
        title="Frequently Asked Questions"
        description="Get answers to common questions about health sharing and how MPB Health works."
        faqs={content.faq}
        className="bg-muted/30"
      />

      {/* Final CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Access Affordable Healthcare?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of members who've discovered the benefits of health sharing. 
              Get your free quote and start saving today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={content.ctas.primary.href}
                className="inline-flex items-center justify-center px-8 py-4 bg-mpb-blue text-white font-medium text-lg rounded-lg hover:bg-mpb-blue-dark transition-colors"
              >
                {content.ctas.primary.text}
              </a>
              <a
                href={content.ctas.secondary.href}
                className="inline-flex items-center justify-center px-8 py-4 border border-mpb-blue text-mpb-blue font-medium text-lg rounded-lg hover:bg-mpb-blue/5 transition-colors"
              >
                {content.ctas.secondary.text}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs text-muted-foreground space-y-2">
              {content.disclaimers.map((disclaimer, index) => (
                <p key={index}>{disclaimer}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
