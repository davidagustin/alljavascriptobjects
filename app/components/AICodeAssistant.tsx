'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Bot, Send, MessageCircle, Code, Lightbulb, BookOpen, Zap, Trash2, Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  codeSnippet?: string
  suggestions?: string[]
  isTyping?: boolean
  rating?: 'up' | 'down'
}

interface CodeAnalysis {
  complexity: 'low' | 'medium' | 'high'
  suggestions: string[]
  performance: string[]
  bestPractices: string[]
  errors: string[]
  warnings: string[]
}

interface AssistantCapability {
  id: string
  name: string
  description: string
  icon: any
  examples: string[]
}

export default function AICodeAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'examples' | 'help'>('chat')
  const [codeToAnalyze, setCodeToAnalyze] = useState('')
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedCapability, setSelectedCapability] = useState<string>('')

  // Assistant capabilities
  const capabilities: AssistantCapability[] = useMemo(() => [
    {
      id: 'explain',
      name: 'Code Explanation',
      description: 'Explain how JavaScript code works, line by line',
      icon: BookOpen,
      examples: [
        'Explain this array method chain',
        'How does this async function work?',
        'What does this regex pattern match?'
      ]
    },
    {
      id: 'debug',
      name: 'Debug Helper',
      description: 'Find and fix bugs in your JavaScript code',
      icon: Code,
      examples: [
        'Why is this function returning undefined?',
        'Fix this promise chain error',
        'Debug this loop issue'
      ]
    },
    {
      id: 'optimize',
      name: 'Code Optimization',
      description: 'Improve performance and best practices',
      icon: Zap,
      examples: [
        'Optimize this array operation',
        'Improve memory usage',
        'Make this code more efficient'
      ]
    },
    {
      id: 'suggest',
      name: 'Smart Suggestions',
      description: 'Get intelligent code completion and suggestions',
      icon: Lightbulb,
      examples: [
        'Complete this function',
        'Suggest better variable names',
        'What methods can I use on this object?'
      ]
    }
  ], [])

  // Mock AI responses based on user input patterns
  const generateAIResponse = useCallback(async (userMessage: string, codeSnippet?: string): Promise<Message> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const lowerMessage = userMessage.toLowerCase()
    let response = ''
    let suggestions: string[] = []

    // Pattern-based responses
    if (lowerMessage.includes('array') || lowerMessage.includes('map') || lowerMessage.includes('filter')) {
      response = `I can help you with array methods! Here are some key points:

**Array.map()**: Creates a new array by transforming each element
**Array.filter()**: Creates a new array with elements that pass a test
**Array.reduce()**: Reduces array to a single value

Would you like me to show you specific examples or explain chaining these methods?`
      suggestions = ['Show map examples', 'Explain method chaining', 'Performance comparison']
    }
    else if (lowerMessage.includes('promise') || lowerMessage.includes('async') || lowerMessage.includes('await')) {
      response = `Great question about asynchronous JavaScript! Let me break this down:

**Promises**: Represent eventual completion of async operations
**async/await**: Syntactic sugar for working with promises
**Error handling**: Use try/catch with async/await or .catch() with promises

Here's a pattern you can follow:
\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
\`\`\``
      suggestions = ['Show error handling patterns', 'Promise chaining examples', 'Async best practices']
    }
    else if (lowerMessage.includes('debug') || lowerMessage.includes('error') || lowerMessage.includes('bug')) {
      response = `Let's debug this together! Here's my debugging approach:

1. **Check the console** for error messages
2. **Add console.logs** to trace execution flow  
3. **Verify data types** using typeof or console.log
4. **Check for typos** in variable/function names
5. **Validate assumptions** about data structure

If you share the specific code that's not working, I can provide targeted help!`
      suggestions = ['Common debugging techniques', 'Console methods guide', 'Error types explained']
    }
    else if (lowerMessage.includes('optimize') || lowerMessage.includes('performance') || lowerMessage.includes('faster')) {
      response = `Performance optimization is crucial! Here are key strategies:

**Array Operations**:
- Use \`.map()\` instead of \`.forEach()\` + push
- Prefer \`.find()\` over \`.filter()[0]\`
- Use \`.some()\` for existence checks

**Object Operations**:
- Cache object property lookups
- Use Map for frequent key-value operations
- Avoid deep object nesting

**Memory**:
- Remove event listeners when done
- Clear references to large objects
- Use WeakMap for metadata storage`
      suggestions = ['Show before/after examples', 'Memory leak prevention', 'Bundle size optimization']
    }
    else if (lowerMessage.includes('explain') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      if (codeSnippet) {
        response = `Let me explain this code step by step:

Looking at your code snippet, I can see several important concepts. Each line serves a specific purpose in the overall logic.

**Key concepts I notice**:
- Variable declarations and scope
- Function calls and return values  
- Data transformation or manipulation
- Possible side effects or state changes

Would you like me to go through it line by line or focus on a specific part?`
        suggestions = ['Line by line explanation', 'Focus on specific functions', 'Related concepts to learn']
      } else {
        response = `I'd be happy to explain JavaScript concepts! Here are some topics I can help with:

**Fundamentals**: Variables, functions, scope, closures
**Objects & Arrays**: Methods, destructuring, iteration
**Async Programming**: Promises, async/await, callbacks
**ES6+ Features**: Arrow functions, classes, modules
**DOM Manipulation**: Events, element selection, modifications
**Advanced**: Prototypes, generators, proxies

What specific topic would you like me to explain?`
        suggestions = ['Closures explained', 'Prototype chain', 'Event loop', 'Module systems']
      }
    }
    else if (lowerMessage.includes('best practice') || lowerMessage.includes('clean code')) {
      response = `Here are essential JavaScript best practices:

**Naming & Structure**:
- Use descriptive variable/function names
- Keep functions small and focused
- Follow consistent indentation and formatting

**Error Handling**:
- Always handle promise rejections
- Validate inputs and edge cases
- Use meaningful error messages

**Performance**:
- Avoid global variables
- Use const/let instead of var
- Minimize DOM queries and updates

**Modern JavaScript**:
- Use arrow functions appropriately
- Leverage destructuring and spread syntax
- Prefer template literals for string building`
      suggestions = ['Code style guides', 'Common anti-patterns', 'Refactoring techniques']
    }
    else {
      // Generic helpful response
      response = `I'm here to help with your JavaScript questions! I can assist with:

🔍 **Code Explanation**: Understanding how code works
🐛 **Debugging**: Finding and fixing issues  
⚡ **Optimization**: Improving performance
💡 **Best Practices**: Writing clean, maintainable code
📚 **Learning**: Explaining concepts and patterns

Feel free to ask me anything or share code you'd like me to review!`
      suggestions = ['Show me array methods', 'Explain async/await', 'Help debug my code', 'Optimize this function']
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: Date.now(),
      suggestions,
      codeSnippet: codeSnippet && response.includes('```') ? codeSnippet : undefined
    }
  }, [])

  // Analyze code
  const analyzeCode = useCallback(async (code: string): Promise<CodeAnalysis> => {
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock analysis based on code patterns
    const analysis: CodeAnalysis = {
      complexity: 'medium',
      suggestions: [],
      performance: [],
      bestPractices: [],
      errors: [],
      warnings: []
    }

    // Basic pattern detection
    if (code.includes('for') && code.includes('for')) {
      analysis.complexity = 'high'
      analysis.suggestions.push('Consider using array methods instead of nested loops')
    }

    if (code.includes('var ')) {
      analysis.warnings.push('Consider using const or let instead of var')
      analysis.bestPractices.push('Use const for values that don\'t change, let for values that do')
    }

    if (code.includes('==') && !code.includes('===')) {
      analysis.warnings.push('Use strict equality (===) instead of loose equality (==)')
    }

    if (code.includes('document.getElementById')) {
      analysis.performance.push('Consider caching DOM queries if used multiple times')
    }

    if (code.includes('.map(') && code.includes('.filter(')) {
      analysis.suggestions.push('Method chaining looks good! Consider the order for better performance')
    }

    if (!code.includes('try') && (code.includes('await') || code.includes('.then('))) {
      analysis.warnings.push('Consider adding error handling for async operations')
    }

    if (code.split('\n').length > 20) {
      analysis.suggestions.push('Function is getting long. Consider breaking it into smaller functions')
    }

    // Set complexity based on findings
    const issueCount = analysis.errors.length + analysis.warnings.length
    if (issueCount === 0) analysis.complexity = 'low'
    else if (issueCount > 3) analysis.complexity = 'high'

    return analysis
  }, [])

  // Send message
  const sendMessage = useCallback(async () => {
    if (!currentMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsTyping(true)

    try {
      const aiResponse = await generateAIResponse(currentMessage)
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }, [currentMessage, generateAIResponse])

  // Handle code analysis
  const handleAnalyzeCode = useCallback(async () => {
    if (!codeToAnalyze.trim()) return

    try {
      const analysis = await analyzeCode(codeToAnalyze)
      setAnalysisResult(analysis)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }, [codeToAnalyze, analyzeCode])

  // Copy message content
  const copyMessage = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  // Rate message
  const rateMessage = useCallback((messageId: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ))
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: `Hi! I'm your AI JavaScript assistant! 🤖

I can help you with:
• **Code explanation** - Understand how your code works
• **Debugging** - Find and fix issues
• **Optimization** - Improve performance  
• **Best practices** - Write better code
• **Learning** - Explain concepts and patterns

What would you like to work on today?`,
        timestamp: Date.now(),
        suggestions: ['Explain array methods', 'Debug my function', 'Optimize this code', 'JavaScript best practices']
      }
      setMessages([welcomeMessage])
    }
  }, [messages.length])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg transition-colors z-40 animate-pulse"
        title="AI Code Assistant"
      >
        <Bot className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Bot className="h-5 w-5 mr-2 text-emerald-600" />
            AI Code Assistant
            <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          {[
            { id: 'chat', label: 'Chat', icon: MessageCircle },
            { id: 'analyze', label: 'Code Analysis', icon: Code },
            { id: 'examples', label: 'Capabilities', icon: Lightbulb },
            { id: 'help', label: 'Help', icon: BookOpen }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white dark:bg-gray-800 dark:text-emerald-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="h-[calc(90vh-180px)]">
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3xl rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-emerald-600 text-white ml-12'
                        : message.type === 'system'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mr-12'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {message.type === 'assistant' && (
                            <div className="flex items-center mb-2">
                              <Bot className="h-4 w-4 mr-2 text-emerald-600" />
                              <span className="text-sm font-medium">AI Assistant</span>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                          
                          {message.codeSnippet && (
                            <div className="mt-3 p-3 bg-gray-900 rounded text-gray-300 text-sm font-mono overflow-x-auto">
                              <code>{message.codeSnippet}</code>
                            </div>
                          )}

                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentMessage(suggestion)}
                                  className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {message.type === 'assistant' && (
                          <div className="flex items-center space-x-1 ml-3">
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                              title="Copy message"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => rateMessage(message.id, 'up')}
                              className={`p-1 ${
                                message.rating === 'up'
                                  ? 'text-green-600'
                                  : 'text-gray-400 hover:text-green-600'
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => rateMessage(message.id, 'down')}
                              className={`p-1 ${
                                message.rating === 'down'
                                  ? 'text-red-600'
                                  : 'text-gray-400 hover:text-red-600'
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mr-12">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-emerald-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Ask me about JavaScript code, debugging, optimization..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    disabled={isTyping}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setMessages([])}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    title="Clear chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analyze' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Code Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Paste your JavaScript code below for AI-powered analysis and suggestions.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    JavaScript Code
                  </label>
                  <textarea
                    value={codeToAnalyze}
                    onChange={(e) => setCodeToAnalyze(e.target.value)}
                    placeholder="// Paste your JavaScript code here...
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];

function getAdults(users) {
  return users.filter(user => user.age >= 18);
}"
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyzeCode}
                    disabled={!codeToAnalyze.trim()}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Analyze Code</span>
                  </button>
                </div>
              </div>

              {analysisResult && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Analysis Results</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysisResult.complexity === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      analysisResult.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {analysisResult.complexity} complexity
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysisResult.suggestions.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                          Suggestions
                        </h5>
                        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {analysisResult.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-500 mr-2">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.performance.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-blue-500" />
                          Performance
                        </h5>
                        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {analysisResult.performance.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.warnings.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                          <span className="text-yellow-500 mr-2">⚠️</span>
                          Warnings
                        </h5>
                        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {analysisResult.warnings.map((warning, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-500 mr-2">•</span>
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.bestPractices.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                          <span className="text-green-500 mr-2">✅</span>
                          Best Practices
                        </h5>
                        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {analysisResult.bestPractices.map((practice, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">AI Capabilities</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Explore what I can help you with. Click on any capability to learn more.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {capabilities.map(capability => (
                  <div
                    key={capability.id}
                    className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                      selectedCapability === capability.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedCapability(selectedCapability === capability.id ? '' : capability.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <capability.icon className="h-6 w-6 text-emerald-600 mr-3" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{capability.name}</h4>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{capability.description}</p>
                    
                    {selectedCapability === capability.id && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Try asking:</h5>
                        <div className="space-y-2">
                          {capability.examples.map((example, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation()
                                setCurrentMessage(example)
                                setActiveTab('chat')
                              }}
                              className="block w-full text-left px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              "{example}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">How to Use the AI Assistant</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get the most out of your AI coding companion with these tips and guidelines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">💬 Asking Questions</h4>
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="font-medium mb-1">Be Specific:</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        "How do I filter an array of objects by property?" is better than "Help with arrays"
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Include Context:</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Share what you're trying to accomplish and any relevant code
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Ask Follow-ups:</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Feel free to ask for clarification or dive deeper into topics
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">🔧 Code Help</h4>
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="font-medium mb-1">Share Your Code:</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Paste code snippets directly in chat for specific help
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Describe the Issue:</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Explain what you expected vs. what's actually happening
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Include Error Messages:</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Share any console errors or unexpected outputs
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">⚡ Quick Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      Use the suggestion buttons for quick follow-up questions
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      Rate my responses to help me improve
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      Try the Code Analysis tab for automatic code review
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      Copy useful code snippets and explanations
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">📚 Best Results</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Start with simpler concepts before advanced topics
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Ask about specific JavaScript features or methods
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Request examples and explanations together
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Practice the solutions I provide in your own code
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                <div className="flex items-start">
                  <Bot className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Remember</h5>
                    <p className="text-emerald-800 dark:text-emerald-200 text-sm">
                      I'm here to help you learn and solve problems! Don't hesitate to ask questions, 
                      share code that's not working, or request explanations for concepts you're curious about. 
                      The more specific your questions, the better I can assist you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}