'use client'

import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react'
import { BookOpen } from 'lucide-react'
import ThemeToggle from './components/ThemeToggle'
import Notifications, { NotificationProvider, useNotifications } from './components/Notifications'

// Lazy load heavy components for better performance
const TabbedInterface = lazy(() => import('./components/TabbedInterface'))
const NavigationEnhanced = lazy(() => import('./components/NavigationEnhanced'))
const MobileNav = lazy(() => import('./components/MobileNav'))
const FavoriteButton = lazy(() => import('./components/FavoriteButton'))
const ProgressBar = lazy(() => import('./components/ProgressBar'))
const KeyboardShortcuts = lazy(() => import('./components/KeyboardShortcuts'))
const QuickLinks = lazy(() => import('./components/QuickLinks'))
const LearningStats = lazy(() => import('./components/LearningStats'))
const PWAInstallButton = lazy(() => import('./components/PWAInstallButton'))
const StudyMode = lazy(() => import('./components/StudyMode'))
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'))
const AccessibilityToolbar = lazy(() => import('./components/AccessibilityToolbar'))
import { useApp } from './contexts/AppContext'
import { getAllObjects } from './constants/objects'
import { usePerformanceTracking } from './utils/performance'

// Loading fallback components
const ComponentFallback = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-4 ${className}`}>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
  </div>
)

const ButtonFallback = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-8 h-8"></div>
)

function HomeContent() {
  const [selectedObject, setSelectedObject] = useState<string>('Object')
  
  const { markAsVisited } = useApp()
  const { notifications, markAsRead, clearAll } = useNotifications()
  const { trackInteraction } = usePerformanceTracking()

  const objects = useMemo(() => getAllObjects(), [])


  const handleObjectSelect = useCallback((objectName: string) => {
    setSelectedObject(objectName)
    markAsVisited(objectName)
    
    // Track user interaction for analytics
    trackInteraction('object_select', objectName, {
      source: 'navigation'
    })
  }, [markAsVisited, trackInteraction])




  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                <span className="hidden sm:inline">JavaScript Objects Tutorial</span>
                <span className="sm:hidden">JS Objects</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block">
                <Suspense fallback={<ButtonFallback />}>
                  <PWAInstallButton showPromoBanner={true} />
                </Suspense>
              </div>
              <Notifications 
                notifications={notifications} 
                onMarkAsRead={markAsRead} 
                onClearAll={clearAll} 
              />
              <ThemeToggle />
              <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
                {objects.length} Objects
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Sidebar - Object Navigation */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 lg:space-y-6 order-2 lg:order-1">
            {/* Enhanced Navigation */}
            <Suspense fallback={<ComponentFallback className="h-96" />}>
              <NavigationEnhanced 
                selectedObject={selectedObject}
                onSelectObject={handleObjectSelect}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              />
            </Suspense>
            
            {/* Quick Links */}
            <Suspense fallback={<ComponentFallback />}>
              <QuickLinks />
            </Suspense>
            
            {/* Study Mode */}
            <Suspense fallback={<ComponentFallback />}>
              <StudyMode onObjectSelect={handleObjectSelect} objects={objects} />
            </Suspense>
            
            {/* Learning Stats */}
            <Suspense fallback={<ComponentFallback />}>
              <LearningStats />
            </Suspense>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-8 order-1 lg:order-2">
            {/* Tabbed Interface */}
            <Suspense fallback={<ComponentFallback className="h-96" />}>
              <TabbedInterface 
                selectedObject={selectedObject} 
                onSelectObject={handleObjectSelect} 
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <Suspense fallback={null}>
        <KeyboardShortcuts />
      </Suspense>

      {/* Analytics Dashboard */}
      <Suspense fallback={<ComponentFallback className="h-64" />}>
        <AnalyticsDashboard />
      </Suspense>

      {/* PWA Install Banner */}
      <Suspense fallback={null}>
        <PWAInstallButton />
      </Suspense>

      {/* Mobile Navigation */}
      <Suspense fallback={null}>
        <MobileNav 
          selectedObject={selectedObject}
          onSelectObject={handleObjectSelect}
        />
      </Suspense>

      {/* Accessibility Toolbar */}
      <Suspense fallback={null}>
        <AccessibilityToolbar />
      </Suspense>
      
    </div>
  )
}

export default function Home() {
  return (
    <NotificationProvider>
      <HomeContent />
    </NotificationProvider>
  )
}
