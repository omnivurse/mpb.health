import fs from 'fs'
import path from 'path'
import {
  HomeSchema,
  IndividualsSchema,
  GroupsSchema,
  QuoteSchema,
  PortalSchema,
  PlansSchema,
  AboutSchema,
  ContactSchema,
  FAQSchema,
  type Home,
  type Individuals,
  type Groups,
  type Quote,
  type Portal,
  type Plans,
  type About,
  type Contact,
  type FAQ
} from './schema'

const contentDir = path.join(process.cwd(), 'content')

// Generic content loader with Zod validation
function loadContent<T>(filename: string, schema: any): T {
  try {
    const filePath = path.join(contentDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const rawData = JSON.parse(fileContents)
    return schema.parse(rawData)
  } catch (error) {
    console.error(`Error loading content from ${filename}:`, error)
    throw new Error(`Failed to load content: ${filename}`)
  }
}

// Content loaders for each page
export function getHomeContent(): Home {
  return loadContent<Home>('home.json', HomeSchema)
}

export function getIndividualsContent(): Individuals {
  return loadContent<Individuals>('individuals.json', IndividualsSchema)
}

export function getGroupsContent(): Groups {
  return loadContent<Groups>('groups.json', GroupsSchema)
}

export function getQuoteContent(): Quote {
  return loadContent<Quote>('quote.json', QuoteSchema)
}

export function getPortalContent(): Portal {
  return loadContent<Portal>('portal.json', PortalSchema)
}

export function getPlansContent(): Plans {
  return loadContent<Plans>('plans.json', PlansSchema)
}

export function getAboutContent(): About {
  return loadContent<About>('about.json', AboutSchema)
}

export function getContactContent(): Contact {
  return loadContent<Contact>('contact.json', ContactSchema)
}

export function getFAQContent(): FAQ {
  return loadContent<FAQ>('faq.json', FAQSchema)
}

// MDX blog helpers
export function getBlogPosts(): Array<{
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  author: string
  readTime: number
}> {
  try {
    const blogDir = path.join(contentDir, 'blog')
    if (!fs.existsSync(blogDir)) {
      return []
    }
    
    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'))
    
    return files.map(file => {
      const filePath = path.join(blogDir, file)
      const content = fs.readFileSync(filePath, 'utf8')
      const slug = file.replace('.mdx', '')
      
      // Extract frontmatter (simplified)
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      const frontmatter = frontmatterMatch ? frontmatterMatch[1] : ''
      
      // Parse basic frontmatter
      const title = extractFrontmatterValue(frontmatter, 'title') || 'Untitled'
      const excerpt = extractFrontmatterValue(frontmatter, 'excerpt') || ''
      const date = extractFrontmatterValue(frontmatter, 'date') || new Date().toISOString()
      const category = extractFrontmatterValue(frontmatter, 'category') || 'General'
      const author = extractFrontmatterValue(frontmatter, 'author') || 'MPB Health'
      const readTime = Math.ceil(content.length / 1000) // Rough estimate
      
      return {
        slug,
        title,
        excerpt,
        date,
        category,
        author,
        readTime
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}

export function getBlogPost(slug: string): {
  content: string
  frontmatter: Record<string, string>
} | null {
  try {
    const filePath = path.join(contentDir, 'blog', `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const content = fs.readFileSync(filePath, 'utf8')
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : ''
    const mdxContent = content.replace(/^---\n[\s\S]*?\n---\n/, '')
    
    // Parse frontmatter into object
    const frontmatterObj: Record<string, string> = {}
    frontmatter.split('\n').forEach(line => {
      const match = line.match(/^(\w+):\s*(.*)$/)
      if (match) {
        frontmatterObj[match[1]] = match[2].replace(/^["']|["']$/g, '')
      }
    })
    
    return {
      content: mdxContent,
      frontmatter: frontmatterObj
    }
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error)
    return null
  }
}

// Helper function to extract frontmatter values
function extractFrontmatterValue(frontmatter: string, key: string): string | null {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))
  return match ? match[1].replace(/^["']|["']$/g, '') : null
}

// Event helpers (similar to blog)
export function getEvents(): Array<{
  slug: string
  title: string
  description: string
  date: string
  location: string
  type: string
}> {
  try {
    const eventsDir = path.join(contentDir, 'events')
    if (!fs.existsSync(eventsDir)) {
      return []
    }
    
    const files = fs.readdirSync(eventsDir).filter(file => file.endsWith('.mdx'))
    
    return files.map(file => {
      const filePath = path.join(eventsDir, file)
      const content = fs.readFileSync(filePath, 'utf8')
      const slug = file.replace('.mdx', '')
      
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      const frontmatter = frontmatterMatch ? frontmatterMatch[1] : ''
      
      return {
        slug,
        title: extractFrontmatterValue(frontmatter, 'title') || 'Untitled Event',
        description: extractFrontmatterValue(frontmatter, 'description') || '',
        date: extractFrontmatterValue(frontmatter, 'date') || new Date().toISOString(),
        location: extractFrontmatterValue(frontmatter, 'location') || 'TBD',
        type: extractFrontmatterValue(frontmatter, 'type') || 'Event'
      }
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error('Error loading events:', error)
    return []
  }
}

export function getEvent(slug: string): {
  content: string
  frontmatter: Record<string, string>
} | null {
  try {
    const filePath = path.join(contentDir, 'events', `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const content = fs.readFileSync(filePath, 'utf8')
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : ''
    const mdxContent = content.replace(/^---\n[\s\S]*?\n---\n/, '')
    
    const frontmatterObj: Record<string, string> = {}
    frontmatter.split('\n').forEach(line => {
      const match = line.match(/^(\w+):\s*(.*)$/)
      if (match) {
        frontmatterObj[match[1]] = match[2].replace(/^["']|["']$/g, '')
      }
    })
    
    return {
      content: mdxContent,
      frontmatter: frontmatterObj
    }
  } catch (error) {
    console.error(`Error loading event ${slug}:`, error)
    return null
  }
}
