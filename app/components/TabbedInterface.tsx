'use client'

import { useState } from 'react'
import { BookOpen, Play, Brain, Target, Code2, Settings } from 'lucide-react'
import ObjectExamples from './ObjectExamples'
import CodeRunner from './CodeRunner'
import LearningPath from './LearningPath'
import Quiz from './Quiz'

interface TabbedInterfaceProps {
  selectedObject: string
  onSelectObject: (objectName: string) => void
}

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType<any>
  description: string
}

export default function TabbedInterface({ selectedObject, onSelectObject }: TabbedInterfaceProps) {
  const [activeTab, setActiveTab] = useState('examples')

  const tabs: Tab[] = [
    {
      id: 'examples',
      label: 'Examples',
      icon: Code2,
      component: ObjectExamples,
      description: 'Interactive code examples and explanations'
    },
    {
      id: 'playground',
      label: 'Playground',
      icon: Play,
      component: CodeRunner,
      description: 'Write and test your own JavaScript code'
    },
    {
      id: 'learning',
      label: 'Learning Path',
      icon: BookOpen,
      component: LearningPath,
      description: 'Structured learning tracks and progress'
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: Brain,
      component: Quiz,
      description: 'Test your knowledge with interactive quizzes'
    }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                }`}
                title={tab.description}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-0">
        {ActiveComponent && (
          <ActiveComponent
            selectedObject={selectedObject}
            onSelectObject={onSelectObject}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Currently viewing: <span className="font-medium text-gray-900 dark:text-gray-100">{selectedObject}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('examples')}
              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Examples
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Try Code
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
