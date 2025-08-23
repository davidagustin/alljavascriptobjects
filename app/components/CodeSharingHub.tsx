'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Share2, ThumbsUp, ThumbsDown, MessageCircle, Copy, Download, Flag, Filter, Search, Bookmark, Users, Star, Clock, Code, Tag, Eye, GitFork } from 'lucide-react'

interface CodeSnippet {
  id: string
  title: string
  description: string
  code: string
  language: string
  author: {
    id: string
    name: string
    avatar: string
    reputation: number
  }
  tags: string[]
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  likes: number
  dislikes: number
  views: number
  forks: number
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
  isBookmarked?: boolean
  isLiked?: boolean
  isDisliked?: boolean
}

interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar: string
  }
  content: string
  createdAt: Date
  likes: number
  replies?: Comment[]
}

interface CodeCollection {
  id: string
  title: string
  description: string
  snippets: string[]
  author: {
    id: string
    name: string
    avatar: string
  }
  isPublic: boolean
  tags: string[]
  createdAt: Date
  likes: number
}

// Mock data
const mockSnippets: CodeSnippet[] = [
  {
    id: '1',
    title: 'Array Methods Chaining',
    description: 'Demonstrates powerful array method chaining for data processing',
    code: `// Advanced array processing pipeline
const users = [
  { name: 'Alice', age: 25, department: 'Engineering', salary: 75000 },
  { name: 'Bob', age: 30, department: 'Marketing', salary: 65000 },
  { name: 'Charlie', age: 35, department: 'Engineering', salary: 85000 },
  { name: 'Diana', age: 28, department: 'Design', salary: 70000 }
];

const result = users
  .filter(user => user.department === 'Engineering')
  .map(user => ({
    ...user,
    bonus: user.salary * 0.1,
    level: user.age > 30 ? 'Senior' : 'Junior'
  }))
  .sort((a, b) => b.salary - a.salary)
  .reduce((acc, user) => ({
    totalSalary: acc.totalSalary + user.salary,
    totalBonus: acc.totalBonus + user.bonus,
    engineers: acc.engineers + 1
  }), { totalSalary: 0, totalBonus: 0, engineers: 0 });

console.log(result);
// Output: { totalSalary: 160000, totalBonus: 16000, engineers: 2 }`,
    language: 'javascript',
    author: {
      id: 'user1',
      name: 'Sarah Chen',
      avatar: '👩‍💻',
      reputation: 1250
    },
    tags: ['arrays', 'functional-programming', 'data-processing', 'methods'],
    category: 'Collections',
    difficulty: 'intermediate',
    likes: 42,
    dislikes: 2,
    views: 156,
    forks: 8,
    comments: [
      {
        id: 'c1',
        author: { id: 'user2', name: 'Alex Kim', avatar: '👨‍💼' },
        content: 'Great example! Love how you combined multiple array methods. Very clean and readable.',
        createdAt: new Date('2024-01-15T10:30:00Z'),
        likes: 5,
        replies: [
          {
            id: 'c1r1',
            author: { id: 'user1', name: 'Sarah Chen', avatar: '👩‍💻' },
            content: 'Thanks! Method chaining is one of my favorite JavaScript patterns.',
            createdAt: new Date('2024-01-15T11:00:00Z'),
            likes: 2
          }
        ]
      }
    ],
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T09:00:00Z')
  },
  {
    id: '2',
    title: 'Promise Error Handling',
    description: 'Robust error handling patterns for async operations',
    code: `// Comprehensive Promise error handling
class APIClient {
  constructor(baseURL, retries = 3) {
    this.baseURL = baseURL;
    this.retries = retries;
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    let lastError;

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        });

        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        
        if (attempt < this.retries) {
          console.warn(\`Attempt \${attempt} failed, retrying...\`, error.message);
          await this.delay(1000 * attempt); // Exponential backoff
        }
      }
    }

    throw new Error(\`Failed after \${this.retries} attempts: \${lastError.message}\`);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Parallel requests with error handling
  async fetchMultiple(endpoints) {
    const results = await Promise.allSettled(
      endpoints.map(endpoint => this.request(endpoint))
    );

    return results.map((result, index) => ({
      endpoint: endpoints[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }));
  }
}

// Usage example
const api = new APIClient('https://api.example.com');

async function fetchUserData() {
  try {
    const user = await api.request('/users/123');
    console.log('User data:', user);
  } catch (error) {
    console.error('Failed to fetch user:', error.message);
  }
}`,
    language: 'javascript',
    author: {
      id: 'user3',
      name: 'Mike Rodriguez',
      avatar: '👨‍🚀',
      reputation: 2100
    },
    tags: ['promises', 'async-await', 'error-handling', 'api', 'retry-logic'],
    category: 'Async',
    difficulty: 'advanced',
    likes: 67,
    dislikes: 1,
    views: 234,
    forks: 15,
    comments: [],
    createdAt: new Date('2024-01-14T14:20:00Z'),
    updatedAt: new Date('2024-01-14T14:20:00Z')
  }
]

const mockCollections: CodeCollection[] = [
  {
    id: 'col1',
    title: 'JavaScript Design Patterns',
    description: 'Common design patterns implemented in JavaScript',
    snippets: ['1', '2'],
    author: {
      id: 'user1',
      name: 'Sarah Chen',
      avatar: '👩‍💻'
    },
    isPublic: true,
    tags: ['patterns', 'architecture', 'best-practices'],
    createdAt: new Date('2024-01-10T00:00:00Z'),
    likes: 23
  }
]

export default function CodeSharingHub() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(mockSnippets)
  const [collections, setCollections] = useState<CodeCollection[]>(mockCollections)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'most-liked'>('popular')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null)
  const [newComment, setNewComment] = useState('')

  // Filter and sort snippets
  const filteredSnippets = useMemo(() => {
    let filtered = snippets

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.description.toLowerCase().includes(query) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(query)) ||
        snippet.code.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(snippet => snippet.category === selectedCategory)
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(snippet => snippet.difficulty === selectedDifficulty)
    }

    // Sort snippets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'popular':
          return b.views - a.views
        case 'most-liked':
          return b.likes - a.likes
        default:
          return 0
      }
    })

    return filtered
  }, [snippets, searchQuery, selectedCategory, selectedDifficulty, sortBy])

  // Handle snippet interactions
  const handleLike = useCallback((snippetId: string) => {
    setSnippets(prev => prev.map(snippet => 
      snippet.id === snippetId
        ? { 
            ...snippet, 
            likes: snippet.isLiked ? snippet.likes - 1 : snippet.likes + 1,
            isLiked: !snippet.isLiked,
            isDisliked: false
          }
        : snippet
    ))
  }, [])

  const handleDislike = useCallback((snippetId: string) => {
    setSnippets(prev => prev.map(snippet => 
      snippet.id === snippetId
        ? { 
            ...snippet, 
            dislikes: snippet.isDisliked ? snippet.dislikes - 1 : snippet.dislikes + 1,
            isDisliked: !snippet.isDisliked,
            isLiked: false
          }
        : snippet
    ))
  }, [])

  const handleBookmark = useCallback((snippetId: string) => {
    setSnippets(prev => prev.map(snippet => 
      snippet.id === snippetId
        ? { ...snippet, isBookmarked: !snippet.isBookmarked }
        : snippet
    ))
  }, [])

  const handleFork = useCallback((snippetId: string) => {
    const snippet = snippets.find(s => s.id === snippetId)
    if (snippet) {
      // In a real app, this would create a copy for the user to edit
      console.log('Forking snippet:', snippet.title)
      setSnippets(prev => prev.map(s => 
        s.id === snippetId ? { ...s, forks: s.forks + 1 } : s
      ))
    }
  }, [snippets])

  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code)
  }, [])

  const handleAddComment = useCallback(() => {
    if (!selectedSnippet || !newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'You',
        avatar: '😊'
      },
      content: newComment.trim(),
      createdAt: new Date(),
      likes: 0
    }

    setSnippets(prev => prev.map(snippet =>
      snippet.id === selectedSnippet.id
        ? { ...snippet, comments: [...snippet.comments, comment] }
        : snippet
    ))

    setNewComment('')
  }, [selectedSnippet, newComment])

  // Get unique categories and tags
  const categories = useMemo(() => {
    const cats = new Set(snippets.map(s => s.category))
    return Array.from(cats)
  }, [snippets])

  const popularTags = useMemo(() => {
    const tagCount = new Map<string, number>()
    snippets.forEach(snippet => {
      snippet.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
      })
    })
    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag)
  }, [snippets])

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Code Sharing Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover, share, and collaborate on JavaScript code snippets
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share Code
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filters and Tags */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Filters
            </h3>
            
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="most-liked">Most Liked</option>
              </select>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code snippets, tags, or authors..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredSnippets.length} code snippet{filteredSnippets.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Code Snippets */}
          <div className="space-y-6">
            {filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {snippet.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          snippet.difficulty === 'beginner'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : snippet.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {snippet.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {snippet.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <span className="mr-1">{snippet.author.avatar}</span>
                          <span>{snippet.author.name}</span>
                          <span className="ml-1 text-xs">({snippet.author.reputation} rep)</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {snippet.createdAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {snippet.views} views
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {snippet.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Code */}
                <div className="relative">
                  <pre className="p-6 bg-gray-900 text-gray-100 overflow-x-auto text-sm">
                    <code>{snippet.code}</code>
                  </pre>
                  <button
                    onClick={() => handleCopyCode(snippet.code)}
                    className="absolute top-4 right-4 p-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(snippet.id)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                          snippet.isLiked
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{snippet.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => handleDislike(snippet.id)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                          snippet.isDisliked
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400'
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>{snippet.dislikes}</span>
                      </button>
                      
                      <button
                        onClick={() => setSelectedSnippet(snippet)}
                        className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-md transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{snippet.comments.length}</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBookmark(snippet.id)}
                        className={`p-2 rounded-md transition-colors ${
                          snippet.isBookmarked
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-gray-600 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400'
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleFork(snippet.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        title="Fork this snippet"
                      >
                        <GitFork className="h-4 w-4" />
                        <span>{snippet.forks}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSnippets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Code className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No code snippets found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comment Modal */}
      {selectedSnippet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Comments - {selectedSnippet.title}
              </h3>
              <button
                onClick={() => setSelectedSnippet(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {selectedSnippet.comments.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedSnippet.comments.map(comment => (
                    <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{comment.author.avatar}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {comment.createdAt.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-2">
                            {comment.content}
                          </p>
                          <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            👍 {comment.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
