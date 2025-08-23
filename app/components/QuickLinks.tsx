'use client'

import { ExternalLink, BookOpen, Github, Code, Globe } from 'lucide-react'

export default function QuickLinks() {
  const links = [
    {
      name: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference',
      icon: BookOpen,
      description: 'Official JavaScript reference'
    },
    {
      name: 'ECMAScript Spec',
      url: 'https://tc39.es/ecma262/',
      icon: Code,
      description: 'Latest ECMAScript specification'
    },
    {
      name: 'GitHub Repository',
      url: 'https://github.com/your-username/javascript-objects-tutorial',
      icon: Github,
      description: 'Source code and contributions'
    },
    {
      name: 'JavaScript.info',
      url: 'https://javascript.info/',
      icon: Globe,
      description: 'Modern JavaScript tutorial'
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Quick Links
      </h3>
      <div className="space-y-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <link.icon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {link.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {link.description}
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </a>
        ))}
      </div>
    </div>
  )
}