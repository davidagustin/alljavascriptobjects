'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { cn } from '../utils/cn'

interface ThemeOption {
  value: 'light' | 'system' | 'dark'
  icon: React.ComponentType<{ className?: string }>
  label: string
  activeColor: string
}

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    icon: Sun,
    label: 'Light mode',
    activeColor: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    value: 'system',
    icon: Monitor,
    label: 'System theme',
    activeColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    value: 'dark',
    icon: Moon,
    label: 'Dark mode',
    activeColor: 'text-purple-400'
  }
]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div 
      className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1" 
      role="group" 
      aria-label="Theme selection"
    >
      {themeOptions.map(({ value, icon: Icon, label, activeColor }) => {
        const isActive = theme === value
        
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
              isActive
                ? cn('bg-white dark:bg-gray-700 shadow-sm', activeColor)
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            )}
            title={label}
            aria-label={label}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
