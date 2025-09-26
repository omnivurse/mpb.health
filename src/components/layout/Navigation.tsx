'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAnalytics } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Plans',
    href: '/plans',
    description: 'Compare all health sharing plans'
  },
  {
    name: 'Individuals',
    href: '/individuals-and-families',
    description: 'Health sharing for individuals and families'
  },
  {
    name: 'Groups',
    href: '/group-plans',
    description: 'Employer and contractor solutions'
  },
  {
    name: 'About',
    href: '/about',
    description: 'Learn about MPB Health'
  },
  {
    name: 'Blog',
    href: '/blog',
    description: 'Health and wellness resources'
  },
  {
    name: 'Member Portal',
    href: '/member-portal',
    description: 'Access your account'
  }
]

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { track } = useAnalytics()

  const handleLinkClick = (name: string, href: string) => {
    track('nav_click', { item: name, href })
    setIsOpen(false)
  }

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 font-bold text-xl text-mpb-blue"
            onClick={() => handleLinkClick('Logo', '/')}
          >
            <div className="h-8 w-8 rounded-lg bg-mpb-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">MPB</span>
            </div>
            <span>MPB Health</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-mpb-blue transition-colors"
                onClick={() => handleLinkClick(item.name, item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link 
                href="/contact"
                className="flex items-center space-x-2"
                onClick={() => handleLinkClick('Contact Phone', '/contact')}
              >
                <Phone className="h-4 w-4" />
                <span>(855) 662-4325</span>
              </Link>
            </Button>
            <Button 
              size="sm"
              asChild
            >
              <Link 
                href="/quote"
                className="flex items-center space-x-2"
                onClick={() => handleLinkClick('Get Quote CTA', '/quote')}
              >
                <Calculator className="h-4 w-4" />
                <span>Get Free Quote</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex flex-col space-y-1 text-left"
                      onClick={() => handleLinkClick(item.name, item.href)}
                    >
                      <span className="font-medium text-foreground hover:text-mpb-blue transition-colors">
                        {item.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </nav>

                {/* Mobile CTAs */}
                <div className="flex flex-col space-y-3 pt-6 border-t">
                  <Button 
                    variant="outline" 
                    asChild
                    className="w-full justify-start"
                  >
                    <Link 
                      href="/contact"
                      className="flex items-center space-x-2"
                      onClick={() => handleLinkClick('Contact Phone Mobile', '/contact')}
                    >
                      <Phone className="h-4 w-4" />
                      <span>(855) 662-4325</span>
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    className="w-full justify-start"
                  >
                    <Link 
                      href="/quote"
                      className="flex items-center space-x-2"
                      onClick={() => handleLinkClick('Get Quote CTA Mobile', '/quote')}
                    >
                      <Calculator className="h-4 w-4" />
                      <span>Get Free Quote</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
