'use client'

import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAnalytics } from '@/lib/analytics'

const footerSections = [
  {
    title: 'Health Sharing Plans',
    links: [
      { name: 'Individuals & Families', href: '/individuals-and-families' },
      { name: 'Group Plans', href: '/group-plans' },
      { name: 'Compare All Plans', href: '/plans' },
      { name: 'Get Free Quote', href: '/quote' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'New to Health Sharing', href: '/new-to-health-sharing' },
      { name: 'Frequently Asked Questions', href: '/faq' },
      { name: 'Blog & Resources', href: '/blog' },
      { name: 'Member Testimonials', href: '/testimonials' }
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Member Portal', href: '/member-portal' },
      { name: 'Contact Support', href: '/contact' },
      { name: 'Submit Sharing Request', href: '/member-portal' },
      { name: 'Virtual Care Access', href: '/member-portal' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About MPB Health', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Careers', href: '/contact' },
      { name: 'Partner with Us', href: '/contact' }
    ]
  }
]

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'State Notices', href: '/state-notices' },
  { name: 'Washington Statement', href: '/washington-statement' }
]

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/mpbhealth', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com/mpbhealth', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/mpbhealth', icon: Linkedin },
  { name: 'Instagram', href: 'https://instagram.com/mpbhealth', icon: Instagram }
]

export function Footer() {
  const { track } = useAnalytics()

  const handleLinkClick = (name: string, href: string, external = false) => {
    if (external) {
      track('external_link_click', { url: href, text: name })
    } else {
      track('nav_click', { item: name, href, location: 'footer' })
    }
  }

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link 
                href="/" 
                className="flex items-center space-x-2 font-bold text-xl text-mpb-blue mb-4"
                onClick={() => handleLinkClick('Footer Logo', '/')}
              >
                <div className="h-8 w-8 rounded-lg bg-mpb-blue flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MPB</span>
                </div>
                <span>MPB Health</span>
              </Link>
              
              <p className="text-muted-foreground mb-6 max-w-md">
                MPB Health facilitates access to qualified health share programs, 
                making quality healthcare accessible and affordable through 
                community-driven medical cost sharing.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-mpb-blue" />
                  <span>(855) 662-4325</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-mpb-blue" />
                  <span>support@mpbhealth.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="h-4 w-4 text-mpb-blue" />
                  <span>Austin, TX</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-mpb-blue transition-colors"
                      onClick={() => handleLinkClick(social.name, social.href, true)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{social.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-mpb-blue transition-colors"
                        onClick={() => handleLinkClick(link.name, link.href)}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-mpb-blue transition-colors"
                  onClick={() => handleLinkClick(link.name, link.href)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-right">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} MPB Health. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Not traditional health insurance. Not guaranteed.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t">
            <div className="text-xs text-muted-foreground space-y-2 max-w-4xl">
              <p>
                <strong>Important:</strong> Medical cost sharing is not traditional health insurance 
                and is not regulated by state insurance departments. Members should be aware that 
                sharing of medical expenses is voluntary and there are no guarantees that expenses 
                will be shared or that you will be reimbursed for out-of-pocket payments.
              </p>
              <p>
                MPB Health facilitates access to qualified Health Care Sharing Ministry (HCSM) 
                programs and is not itself an HCSM or Health Share Organization. Whether or not 
                you receive any payments for medical expenses and whether or not this program 
                continues to operate, you are always liable for any unpaid bills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
