'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Bot, Send, Loader2, Copy, Check } from 'lucide-react'
import { getObjectTags, getCategoryByObject, getRelatedObjects, getAllObjects } from '../constants/objects'
import { usePerformanceTracking } from '../utils/performance'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

interface AIAssistantProps {
  selectedObject?: string
  className?: string
}

export default function AIAssistant({
  selectedObject = 'Object',
  className = ''
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { trackInteraction } = usePerformanceTracking()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: `Hi! I'm your AI JavaScript assistant. I can help you understand ${selectedObject} with explanations, examples, and best practices. What would you like to learn?`,
      timestamp: Date.now()
    }
    setMessages([welcomeMessage])
  }, [selectedObject])

  // Helper functions for generating responses
  const getObjectDescription = (objectName: string): string => {
    const descriptions: Record<string, string> = {
      'Array': 'Arrays store multiple values in a single variable with indexed access. Perfect for ordered collections and iteration.',
      'Object': 'The fundamental building block of JavaScript. Objects store key-value pairs and form the basis of all complex data structures.',
      'Promise': 'Handles asynchronous operations with elegant chaining. Essential for modern JavaScript and avoiding callback hell.',
      'String': 'Represents textual data with powerful manipulation methods. Immutable and supports Unicode.',
      'Number': 'Represents both integers and floating-point numbers. Includes special values like Infinity and NaN.',
      'Map': 'Key-value pairs with any data type as keys. Maintains insertion order and provides better performance than objects for frequent additions/deletions.',
      'Set': 'Collection of unique values. Great for removing duplicates and checking membership.'
    }
    return descriptions[objectName] || `${objectName} is a built-in JavaScript object with specialized functionality for specific use cases.`
  }

  const getObjectExamples = (objectName: string): string => {
    const examples: Record<string, string> = {
      'Array': `\`\`\`javascript
// Creating and manipulating arrays
const fruits = ['apple', 'banana', 'orange']
fruits.push('grape')           // Add element
fruits.map(fruit => fruit.toUpperCase()) // Transform
fruits.filter(fruit => fruit.length > 5)  // Filter
\`\`\``,
      'Object': `\`\`\`javascript
// Creating and working with objects
const person = { name: 'John', age: 30 }
person.city = 'New York'       // Add property
Object.keys(person)            // Get keys
Object.assign({}, person)      // Clone object
\`\`\``,
      'Promise': `\`\`\`javascript
// Handling asynchronous operations
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))

// Modern async/await syntax
const data = await fetch('/api/data')
\`\`\``
    }
    return examples[objectName] || `\`\`\`javascript\n// ${objectName} usage example\nconst example = new ${objectName}()\n\`\`\``
  }

  const getObjectBestPractices = (objectName: string): string => {
    const practices: Record<string, string> = {
      'Array': '• Use appropriate methods (map, filter, reduce) over loops\n• Check array length before accessing elements\n• Consider performance for large arrays',
      'Object': '• Use const for object declarations when possible\n• Prefer Object.create() or {} over new Object()\n• Use hasOwnProperty() to check for properties',
      'Promise': '• Always handle rejections with .catch()\n• Prefer async/await over .then() chains\n• Use Promise.all() for parallel operations'
    }
    return practices[objectName] || '• Follow MDN documentation guidelines\n• Consider browser compatibility\n• Use appropriate error handling'
  }

  const getObjectMethodsInfo = (objectName: string): string => {
    const methods: Record<string, string> = {
      'Array': '**Common Methods:**\n• `push(), pop()` - Add/remove from end\n• `map(), filter(), reduce()` - Functional programming\n• `forEach()` - Iteration\n• `indexOf(), includes()` - Searching\n• `slice(), splice()` - Manipulation',
      'Object': '**Static Methods:**\n• `Object.keys(), Object.values()` - Get properties\n• `Object.assign()` - Merge objects\n• `Object.create()` - Create with prototype\n• `Object.freeze()` - Make immutable\n• `Object.hasOwnProperty()` - Check properties',
      'Promise': '**Instance Methods:**\n• `.then()` - Handle success\n• `.catch()` - Handle errors\n• `.finally()` - Always executes\n**Static Methods:**\n• `Promise.all()` - Wait for all\n• `Promise.race()` - First to complete'
    }
    return methods[objectName] || `**Methods:** Check MDN documentation for ${objectName} methods and properties.`
  }

  const getObjectComparison = (obj1: string, obj2: string): string => {
    const comparisons: Record<string, string> = {
      'Array-Object': '**Array:** Ordered, indexed access, built-in iteration methods\n**Object:** Key-value pairs, property access, more flexible structure\n\n**Use Array for:** Lists, sequences, iteration\n**Use Object for:** Records, mappings, complex data',
      'Map-Object': '**Map:** Any key type, maintains insertion order, size property\n**Object:** String/Symbol keys only, prototype inheritance\n\n**Use Map for:** Key-value with non-string keys, frequent additions/deletions\n**Use Object for:** Records, configuration, when you need prototype methods',
      'Set-Array': '**Set:** Unique values only, faster lookups, no indexing\n**Array:** Allows duplicates, indexed access, rich methods\n\n**Use Set for:** Unique collections, membership testing\n**Use Array for:** Ordered data, when you need duplicates or indexing'
    }
    const key = [obj1, obj2].sort().join('-')
    return comparisons[key] || `Both ${obj1} and ${obj2} have unique strengths. Consider your specific use case: data structure needs, performance requirements, and API design.`
  }

  const getPerformanceNotes = (objectName: string): string => {
    const notes: Record<string, string> = {
      'Array': '• O(1) access by index, O(n) for searching\n• `push()/pop()` are O(1), `shift()/unshift()` are O(n)\n• Methods like `map/filter` create new arrays (memory cost)\n• Sparse arrays can impact performance',
      'Object': '• Property access is generally O(1)\n• JSON operations can be expensive for large objects\n• Prototype chain lookups add overhead\n• Use Maps for frequent key additions/deletions',
      'Map': '• O(1) average for get/set/has operations\n• Better than Objects for frequent additions/deletions\n• Maintains insertion order (Objects do too since ES2015)\n• Slightly more memory overhead than Objects'
    }
    return notes[objectName] || `Performance characteristics vary based on usage patterns. Profile your specific use case for optimization opportunities.`
  }

  const extractObjectFromMessage = (message: string): string | null => {
    const allObjects = getAllObjects()
    for (const obj of allObjects) {
      if (message.toLowerCase().includes(obj.toLowerCase())) {
        return obj
      }
    }
    return null
  }

  const simulateAIResponse = async (userMessage: string): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500))

    let response = ''
    const lowerMessage = userMessage.toLowerCase()
    const category = getCategoryByObject(selectedObject)
    const tags = getObjectTags(selectedObject)
    const relatedObjects = getRelatedObjects(selectedObject, 3)

    // Enhanced response patterns
    if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
      response = `${selectedObject} is a JavaScript object in the **${category}** category.

**Key Information:**
• **Category:** ${category}
• **Tags:** ${tags.slice(0, 4).join(', ')}
• **Difficulty:** Based on category complexity

**Core Purpose:**
${getObjectDescription(selectedObject)}

**Related Objects:**
You might also find these useful: ${relatedObjects.join(', ')}`

    } else if (lowerMessage.includes('example') || lowerMessage.includes('how to use')) {
      response = `Here are practical examples for **${selectedObject}**:

${getObjectExamples(selectedObject)}

**Best Practices:**
${getObjectBestPractices(selectedObject)}

Need more specific examples? Ask about particular methods or use cases!`

    } else if (lowerMessage.includes('method') || lowerMessage.includes('property')) {
      response = `**${selectedObject} Methods & Properties:**

${getObjectMethodsInfo(selectedObject)}

**Pro Tips:**
• Check browser compatibility for newer methods
• Consider performance implications for large datasets
• Use appropriate methods for your specific use case

Want to know more about a specific method?`

    } else if (lowerMessage.includes('difference') || lowerMessage.includes('vs')) {
      const otherObj = extractObjectFromMessage(lowerMessage)
      if (otherObj && otherObj !== selectedObject) {
        response = `**${selectedObject} vs ${otherObj}:**

${getObjectComparison(selectedObject, otherObj)}

Both are useful in different scenarios. Choose based on your specific needs!`
      } else {
        response = `I can help you compare **${selectedObject}** with other JavaScript objects. Just ask something like "What's the difference between ${selectedObject} and Array?" or "${selectedObject} vs Map"`
      }
    } else if (lowerMessage.includes('performance') || lowerMessage.includes('speed')) {
      response = `**Performance Considerations for ${selectedObject}:**

${getPerformanceNotes(selectedObject)}

**Optimization Tips:**
• Choose the right method for your use case
• Consider time complexity for large datasets
• Profile your code when performance is critical`

    } else {
      response = `Hi! I'm specialized in **${selectedObject}** from the ${category} category.

**I can help you with:**
• 📚 Explanations and concepts
• 💡 Practical examples and usage
• ⚡ Methods and properties
• 🔍 Comparisons with other objects
• 🚀 Performance considerations
• 🛠️ Best practices and patterns

**Quick Facts:**
• Category: ${category}
• Related: ${relatedObjects.join(', ')}
• Tags: ${tags.slice(0, 3).join(', ')}

What would you like to learn about ${selectedObject}?`
    }

    return {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: response,
      timestamp: Date.now()
    }
  }

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    
    trackInteraction('ai_chat', 'send_message', { selectedObject })

    try {
      const aiResponse = await simulateAIResponse(userMessage.content)
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('AI Assistant error:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, selectedObject, trackInteraction, simulateAIResponse])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const handleCopyMessage = useCallback(async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }, [])

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Specialized in {selectedObject}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 group ${
              message.type === 'user'
                ? 'bg-blue-600 text-white ml-4'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mr-4'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {message.type !== 'user' && (
                    <div className="flex items-center space-x-1 mb-1">
                      <Bot className="h-3 w-3" />
                      <span className="text-xs opacity-75">AI Assistant</span>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                </div>
                <button
                  onClick={() => handleCopyMessage(message.id, message.content)}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedMessageId === message.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mr-4">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask about ${selectedObject}...`}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}