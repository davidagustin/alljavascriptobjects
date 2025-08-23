'use client'

import { useState, useCallback, useMemo } from 'react'
import { BookOpen, Play, Brain, Target, Code2, Settings, Share2, Star, Clock, TrendingUp, Bot, BarChart3 } from 'lucide-react'
import ObjectExamples from './ObjectExamples'
import CodeRunner from './CodeRunner'
import LearningPath from './LearningPath'
import Quiz from './Quiz'
import CodeSnippets from './CodeSnippets'
import StudyMode from './StudyMode'
import AIAssistant from './AIAssistant'
import VisualizationHub from './VisualizationHub'
import { useApp } from '../contexts/AppContext'
import { usePerformanceTracking } from '../utils/performance'
import { isFeatureEnabled } from '../config/app'

interface TabbedInterfaceProps {
  selectedObject: string
  onSelectObject: (objectName: string) => void
}

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType<any>
  badge?: number | string
  disabled?: boolean
}

export default function TabbedInterface({ selectedObject, onSelectObject }: TabbedInterfaceProps) {
  const [activeTab, setActiveTab] = useState('examples')
  const { favorites, visitedObjects, totalObjects } = useApp()
  const { trackInteraction } = usePerformanceTracking()

  const tabs: Tab[] = useMemo(() => {
    const baseTabs = [
      {
        id: 'examples',
        label: 'Examples',
        icon: BookOpen,
        component: ObjectExamples,
        badge: undefined
      },
      {
        id: 'playground',
        label: 'Playground',
        icon: Play,
        component: CodeRunner,
        badge: undefined
      },
      {
        id: 'learning',
        label: 'Learning Path',
        icon: Brain,
        component: LearningPath,
        badge: undefined
      },
      {
        id: 'quiz',
        label: 'Quiz',
        icon: Target,
        component: Quiz,
        badge: undefined
      },
      {
        id: 'snippets',
        label: 'Snippets',
        icon: Code2,
        component: CodeSnippets,
        badge: undefined
      },
      {
        id: 'study',
        label: 'Study Mode',
        icon: Clock,
        component: StudyMode,
        badge: undefined
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: BarChart3,
        component: VisualizationHub,
        badge: undefined
      }
    ]

    // Add AI Assistant tab if feature is enabled
    if (isFeatureEnabled('enableAIAssistant')) {
      baseTabs.push({
        id: 'ai-assistant',
        label: 'AI Assistant',
        icon: Bot,
        component: AIAssistant,
        badge: '✨'
      })
    }

    return baseTabs
  }, [])

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
    trackInteraction('tab_change', tabId, {
      previousTab: activeTab,
      selectedObject
    })
  }, [activeTab, selectedObject, trackInteraction])

  const activeTabData = useMemo(() => 
    tabs.find(tab => tab.id === activeTab), 
    [tabs, activeTab]
  )

  const ActiveComponent = activeTabData?.component

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isDisabled = tab.disabled

            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && handleTabChange(tab.id)}
                disabled={isDisabled}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  }
                  ${isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {ActiveComponent ? (
          <ActiveComponent 
            selectedObject={selectedObject}
            onSelectObject={onSelectObject}
          />
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Select a tab to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
