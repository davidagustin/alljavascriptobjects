import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { AppProvider } from './contexts/AppContext'
import ServiceWorkerRegistration from './components/ServiceWorkerRegistration'
import ErrorBoundary from './components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'JavaScript Objects Tutorial',
    template: '%s | JavaScript Objects Tutorial'
  },
  description: 'A comprehensive tutorial on all JavaScript objects with examples and code compilation',
  keywords: ['JavaScript', 'Objects', 'Tutorial', 'Reference', 'Examples', 'TypeScript', 'React'],
  authors: [{ name: 'JavaScript Objects Tutorial' }],
  creator: 'JavaScript Objects Tutorial',
  publisher: 'JavaScript Objects Tutorial',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://javascript-objects-tutorial.vercel.app'),
  openGraph: {
    title: 'JavaScript Objects Tutorial',
    description: 'A comprehensive tutorial on all JavaScript objects with examples and code compilation',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JavaScript Objects Tutorial',
    description: 'A comprehensive tutorial on all JavaScript objects with examples and code compilation',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="JS Objects" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ServiceWorkerRegistration />
        <ErrorBoundary>
          <ThemeProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
