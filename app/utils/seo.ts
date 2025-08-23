import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  structuredData?: Record<string, any>
}

// Generate metadata for Next.js pages
export function generateMetadata({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/images/og-default.jpg',
  structuredData
}: SEOConfig): Metadata {
  const fullTitle = title.includes('JavaScript Objects Tutorial') 
    ? title 
    : `${title} | JavaScript Objects Tutorial`
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      images: [ogImage],
      type: 'website',
      siteName: 'JavaScript Objects Tutorial',
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    
    // Canonical URL
    alternates: canonicalUrl ? {
      canonical: canonicalUrl
    } : undefined,
    
    // Additional meta tags
    other: {
      'application-name': 'JavaScript Objects Tutorial',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'theme-color': '#3b82f6',
      ...(structuredData && {
        'script': JSON.stringify(structuredData)
      })
    }
  }
}

// Pre-defined metadata for common pages
export const seoConfigs = {
  home: {
    title: 'Learn JavaScript Objects - Interactive Tutorial & Reference',
    description: 'Master JavaScript objects with our comprehensive interactive tutorial. Explore built-in objects, methods, properties, and advanced concepts with hands-on examples.',
    keywords: [
      'JavaScript objects',
      'JavaScript tutorial',
      'JavaScript reference',
      'Object methods',
      'JavaScript learning',
      'Web development',
      'Programming tutorial',
      'Interactive coding'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      'name': 'JavaScript Objects Tutorial',
      'description': 'Comprehensive interactive tutorial for learning JavaScript objects',
      'url': 'https://javascript-objects-tutorial.com',
      'sameAs': []
    }
  },
  
  object: (objectName: string, category?: string) => ({
    title: `${objectName} - JavaScript Object Reference`,
    description: `Learn about the JavaScript ${objectName} object. Explore methods, properties, examples, and use cases with interactive code samples.`,
    keywords: [
      `JavaScript ${objectName}`,
      `${objectName} object`,
      `${objectName} methods`,
      `${objectName} properties`,
      'JavaScript reference',
      category && `JavaScript ${category}`,
      'Web development'
    ].filter(Boolean) as string[],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': `JavaScript ${objectName} Object Reference`,
      'description': `Comprehensive guide to the JavaScript ${objectName} object`,
      'author': {
        '@type': 'Organization',
        'name': 'JavaScript Objects Tutorial'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'JavaScript Objects Tutorial'
      },
      'mainEntityOfPage': `https://javascript-objects-tutorial.com/objects/${objectName.toLowerCase()}`,
      'keywords': `JavaScript, ${objectName}, object, methods, properties, tutorial`
    }
  }),
  
  category: (categoryName: string) => ({
    title: `${categoryName} - JavaScript Objects Category`,
    description: `Explore ${categoryName} JavaScript objects. Learn about related objects, their methods, properties, and practical applications.`,
    keywords: [
      `JavaScript ${categoryName}`,
      `${categoryName} objects`,
      'JavaScript categories',
      'JavaScript reference',
      'Web development',
      'Programming tutorial'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `JavaScript ${categoryName} Objects`,
      'description': `Collection of JavaScript objects in the ${categoryName} category`,
      'url': `https://javascript-objects-tutorial.com/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`
    }
  }),
  
  search: (query: string, resultCount: number) => ({
    title: query ? `Search: ${query} - JavaScript Objects` : 'Search JavaScript Objects',
    description: query 
      ? `Search results for "${query}". Found ${resultCount} JavaScript objects and topics.`
      : 'Search JavaScript objects, methods, properties, and examples. Find what you need quickly.',
    keywords: [
      'JavaScript search',
      'JavaScript objects search',
      'Find JavaScript objects',
      ...(query ? [query] : [])
    ]
  })
}

// Generate sitemap data
export function generateSitemapUrls(objects: string[], categories: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://javascript-objects-tutorial.com'
  
  const urls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    }
  ]
  
  // Add object pages
  objects.forEach(objectName => {
    urls.push({
      url: `${baseUrl}/objects/${objectName.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    })
  })
  
  // Add category pages
  categories.forEach(categoryName => {
    urls.push({
      url: `${baseUrl}/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    })
  })
  
  return urls
}

// Breadcrumb generation
export function generateBreadcrumbs(path: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://javascript-objects-tutorial.com'
  
  const breadcrumbs = [
    {
      name: 'Home',
      url: baseUrl,
      position: 1
    }
  ]
  
  let currentUrl = baseUrl
  path.forEach((segment, index) => {
    currentUrl += `/${segment}`
    breadcrumbs.push({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      url: currentUrl,
      position: index + 2
    })
  })
  
  return {
    breadcrumbs,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map(item => ({
        '@type': 'ListItem',
        'position': item.position,
        'name': item.name,
        'item': item.url
      }))
    }
  }
}

// Performance and Core Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return
  
  // LCP - Largest Contentful Paint
  const observeLCP = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      // Track LCP
      if (process.env.NODE_ENV === 'production') {
        // Send to analytics
        console.log('LCP:', lastEntry.startTime)
      }
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  }
  
  // FID - First Input Delay
  const observeFID = () => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime
        
        if (process.env.NODE_ENV === 'production') {
          // Send to analytics
          console.log('FID:', fid)
        }
      })
    })
    
    observer.observe({ entryTypes: ['first-input'] })
  }
  
  // CLS - Cumulative Layout Shift
  const observeCLS = () => {
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      
      if (process.env.NODE_ENV === 'production') {
        // Send to analytics
        console.log('CLS:', clsValue)
      }
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
  }
  
  // Initialize observers
  try {
    observeLCP()
    observeFID()
    observeCLS()
  } catch (error) {
    console.warn('Web Vitals tracking not supported:', error)
  }
}

// Rich snippets for code examples
export function generateCodeSnippetStructuredData(
  objectName: string,
  codeExample: string,
  description: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    'codeRepository': 'https://github.com/javascript-objects-tutorial',
    'codeSampleType': 'code snippet',
    'programmingLanguage': 'JavaScript',
    'name': `${objectName} Example`,
    'description': description,
    'text': codeExample,
    'author': {
      '@type': 'Organization',
      'name': 'JavaScript Objects Tutorial'
    }
  }
}

// Generate robots.txt content
export function generateRobotsTxt() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://javascript-objects-tutorial.com'
  
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Block specific paths if needed
# Disallow: /api/
# Disallow: /admin/`
}