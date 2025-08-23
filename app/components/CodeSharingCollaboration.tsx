'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Share2, Users, Link, Download, Upload, Heart, MessageCircle, Eye, Copy, Check, Globe, Lock, Save, Edit3, Trash2, Star } from 'lucide-react'

interface SharedCode {
  id: string
  title: string
  description: string
  code: string
  language: string
  author: string
  authorId: string
  createdAt: number
  updatedAt: number
  likes: number
  views: number
  comments: Comment[]
  tags: string[]
  visibility: 'public' | 'private' | 'unlisted'
  forkedFrom?: string
  forks: number
  isLiked?: boolean
  category: string
}

interface Comment {
  id: string
  author: string
  authorId: string
  content: string
  createdAt: number
  likes: number
  replies: Comment[]
  isLiked?: boolean
}

interface Collaboration {
  id: string
  name: string
  description: string
  members: CollaborationMember[]
  sharedCodes: string[]
  createdAt: number
  isPrivate: boolean
  inviteCode?: string
}

interface CollaborationMember {
  userId: string
  username: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: number
  lastActive: number
}

export default function CodeSharingCollaboration() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'share' | 'browse' | 'collaborate' | 'my-codes'>('share')
  const [sharedCodes, setSharedCodes] = useState<SharedCode[]>([])
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [selectedCode, setSelectedCode] = useState<SharedCode | null>(null)
  const [currentUser] = useState({ id: 'user-123', username: 'JavaScriptLearner' })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'likes' | 'views'>('recent')
  
  // Share form state
  const [shareForm, setShareForm] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: '',
    visibility: 'public' as 'public' | 'private' | 'unlisted',
    category: 'general'
  })

  // Mock data for demonstration
  const mockSharedCodes: SharedCode[] = useMemo(() => [
    {
      id: '1',
      title: 'Array Methods Cheat Sheet',
      description: 'A comprehensive example of common array methods with practical examples',
      code: `// Array Methods Cheat Sheet
const numbers = [1, 2, 3, 4, 5];
const fruits = ['apple', 'banana', 'orange'];

// Transform arrays
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter arrays  
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]

// Reduce arrays
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15

// Find elements
const found = fruits.find(fruit => fruit.startsWith('b'));
console.log(found); // 'banana'

// Check conditions
const hasOrange = fruits.includes('orange');
console.log(hasOrange); // true`,
      language: 'javascript',
      author: 'ArrayMaster',
      authorId: 'user-456',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      likes: 42,
      views: 156,
      comments: [],
      tags: ['arrays', 'methods', 'cheatsheet'],
      visibility: 'public',
      forks: 8,
      category: 'tutorial'
    },
    {
      id: '2',
      title: 'Promise Chain Example',
      description: 'Demonstrating promise chaining and error handling patterns',
      code: `// Promise Chain Example
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: \`User \${id}\` });
      } else {
        reject(new Error('Invalid user ID'));
      }
    }, 1000);
  });
}

function fetchUserPosts(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { title: 'Post 1', author: user.name },
        { title: 'Post 2', author: user.name }
      ]);
    }, 500);
  });
}

// Promise chaining
fetchUser(1)
  .then(user => {
    console.log('User:', user);
    return fetchUserPosts(user);
  })
  .then(posts => {
    console.log('Posts:', posts);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });`,
      language: 'javascript',
      author: 'AsyncExpert',
      authorId: 'user-789',
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 172800000,
      likes: 23,
      views: 89,
      comments: [
        {
          id: 'c1',
          author: 'LearnJS',
          authorId: 'user-101',
          content: 'Great example! Could you also show async/await version?',
          createdAt: Date.now() - 3600000,
          likes: 5,
          replies: []
        }
      ],
      tags: ['promises', 'async', 'chaining'],
      visibility: 'public',
      forks: 3,
      category: 'example'
    },
    {
      id: '3',
      title: 'Object Destructuring Patterns',
      description: 'Advanced destructuring techniques for objects and arrays',
      code: `// Object Destructuring Patterns

// Basic destructuring
const user = { name: 'John', age: 30, city: 'NYC' };
const { name, age } = user;
console.log(name, age); // John 30

// Renaming variables
const { name: userName, city: userCity } = user;
console.log(userName, userCity); // John NYC

// Default values
const { country = 'USA' } = user;
console.log(country); // USA

// Nested destructuring
const profile = {
  user: { name: 'Jane', details: { email: 'jane@example.com' } },
  preferences: { theme: 'dark' }
};

const { 
  user: { name: profileName, details: { email } },
  preferences: { theme }
} = profile;

console.log(profileName, email, theme); // Jane jane@example.com dark

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first, second, rest); // 1 2 [3, 4, 5]

// Function parameter destructuring
function greetUser({ name, age = 'unknown' }) {
  console.log(\`Hello \${name}, age: \${age}\`);
}

greetUser({ name: 'Bob' }); // Hello Bob, age: unknown`,
      language: 'javascript',
      author: 'JSNinja',
      authorId: 'user-202',
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 259200000,
      likes: 67,
      views: 234,
      comments: [],
      tags: ['destructuring', 'objects', 'es6'],
      visibility: 'public',
      forks: 12,
      category: 'tutorial'
    }
  ], [])

  useEffect(() => {
    setSharedCodes(mockSharedCodes)
  }, [mockSharedCodes])

  // Filter and sort codes
  const filteredAndSortedCodes = useMemo(() => {
    const filtered = sharedCodes.filter(code => {
      const matchesSearch = code.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          code.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = filterCategory === 'all' || code.category === filterCategory
      return matchesSearch && matchesCategory
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes + b.views) - (a.likes + a.views)
        case 'likes':
          return b.likes - a.likes
        case 'views':
          return b.views - a.views
        case 'recent':
        default:
          return b.createdAt - a.createdAt
      }
    })
  }, [sharedCodes, searchTerm, filterCategory, sortBy])

  // Share code
  const shareCode = useCallback(async () => {
    if (!shareForm.title || !shareForm.code) return

    const newCode: SharedCode = {
      id: Date.now().toString(),
      title: shareForm.title,
      description: shareForm.description,
      code: shareForm.code,
      language: shareForm.language,
      author: currentUser.username,
      authorId: currentUser.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      likes: 0,
      views: 0,
      comments: [],
      tags: shareForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      visibility: shareForm.visibility,
      forks: 0,
      category: shareForm.category
    }

    setSharedCodes(prev => [newCode, ...prev])
    setShareForm({
      title: '',
      description: '',
      code: '',
      language: 'javascript',
      tags: '',
      visibility: 'public',
      category: 'general'
    })

    setActiveTab('my-codes')
  }, [shareForm, currentUser])

  // Like code
  const likeCode = useCallback((codeId: string) => {
    setSharedCodes(prev => prev.map(code => 
      code.id === codeId 
        ? { 
            ...code, 
            likes: code.isLiked ? code.likes - 1 : code.likes + 1,
            isLiked: !code.isLiked 
          }
        : code
    ))
  }, [])

  // Fork code
  const forkCode = useCallback((code: SharedCode) => {
    const forkedCode: SharedCode = {
      ...code,
      id: Date.now().toString(),
      title: `${code.title} (Fork)`,
      author: currentUser.username,
      authorId: currentUser.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      likes: 0,
      views: 0,
      comments: [],
      forkedFrom: code.id,
      forks: 0
    }

    setSharedCodes(prev => [forkedCode, ...prev.map(c => 
      c.id === code.id ? { ...c, forks: c.forks + 1 } : c
    )])
    setActiveTab('my-codes')
  }, [currentUser])

  // Copy share link
  const copyShareLink = useCallback(async (codeId: string) => {
    const link = `${window.location.origin}/shared/${codeId}`
    try {
      await navigator.clipboard.writeText(link)
      setCopiedId(codeId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }, [])

  // Add comment
  const addComment = useCallback((codeId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser.username,
      authorId: currentUser.id,
      content,
      createdAt: Date.now(),
      likes: 0,
      replies: []
    }

    setSharedCodes(prev => prev.map(code =>
      code.id === codeId
        ? { ...code, comments: [...code.comments, newComment] }
        : code
    ))
  }, [currentUser])

  // Get user's codes
  const userCodes = useMemo(() => {
    return sharedCodes.filter(code => code.authorId === currentUser.id)
  }, [sharedCodes, currentUser.id])

  const categories = useMemo(() => {
    return Array.from(new Set(sharedCodes.map(code => code.category))).sort()
  }, [sharedCodes])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/4 right-4 bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Code Sharing & Collaboration"
      >
        <Share2 className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Code Sharing & Collaboration
          </h2>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {sharedCodes.length} codes shared
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          {[
            { id: 'share', label: 'Share Code', icon: Upload },
            { id: 'browse', label: 'Browse', icon: Globe },
            { id: 'collaborate', label: 'Collaborate', icon: Users },
            { id: 'my-codes', label: 'My Codes', icon: Edit3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-600 border-b-2 border-cyan-600 bg-white dark:bg-gray-800 dark:text-cyan-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'share' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Share Your Code</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Share your JavaScript code examples, snippets, and projects with the community
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={shareForm.title}
                    onChange={(e) => setShareForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a descriptive title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={shareForm.category}
                    onChange={(e) => setShareForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="general">General</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="example">Example</option>
                    <option value="snippet">Snippet</option>
                    <option value="project">Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={shareForm.description}
                  onChange={(e) => setShareForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what your code does and how it works"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code *
                </label>
                <textarea
                  value={shareForm.code}
                  onChange={(e) => setShareForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Paste your JavaScript code here..."
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={shareForm.language}
                    onChange={(e) => setShareForm(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="jsx">JSX</option>
                    <option value="tsx">TSX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={shareForm.tags}
                    onChange={(e) => setShareForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="arrays, promises, react (comma-separated)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visibility
                  </label>
                  <select
                    value={shareForm.visibility}
                    onChange={(e) => setShareForm(prev => ({ ...prev, visibility: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={shareCode}
                  disabled={!shareForm.title || !shareForm.code}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Code</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search codes by title, description, or tags..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="likes">Most Liked</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>

              {/* Code List */}
              <div className="space-y-6">
                {filteredAndSortedCodes.map(code => (
                  <div key={code.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{code.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              code.visibility === 'public' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              code.visibility === 'unlisted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {code.visibility === 'public' ? <Globe className="h-3 w-3 inline mr-1" /> : <Lock className="h-3 w-3 inline mr-1" />}
                              {code.visibility}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{code.description}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                            <span>by {code.author}</span>
                            <span>{new Date(code.createdAt).toLocaleDateString()}</span>
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {code.likes}
                              </span>
                              <span className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {code.views}
                              </span>
                              <span className="flex items-center">
                                <Share2 className="h-4 w-4 mr-1" />
                                {code.forks}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {code.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => likeCode(code.id)}
                            className={`p-2 rounded-md transition-colors ${
                              code.isLiked 
                                ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                                : 'text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                            }`}
                            title="Like this code"
                          >
                            <Heart className={`h-4 w-4 ${code.isLiked ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => copyShareLink(code.id)}
                            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Copy share link"
                          >
                            {copiedId === code.id ? <Check className="h-4 w-4 text-green-600" /> : <Link className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => forkCode(code)}
                            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Fork this code"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Code Preview */}
                    <div className="bg-gray-900 p-4">
                      <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                        <code>{code.code.slice(0, 500)}{code.code.length > 500 ? '\n...\n[Click to view full code]' : ''}</code>
                      </pre>
                    </div>

                    {/* Comments */}
                    {code.comments.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                          Comments ({code.comments.length})
                        </h4>
                        <div className="space-y-3">
                          {code.comments.slice(0, 2).map(comment => (
                            <div key={comment.id} className="flex space-x-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 text-sm">
                                  <span className="font-medium text-gray-900 dark:text-gray-100">{comment.author}</span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {filteredAndSortedCodes.length === 0 && (
                  <div className="text-center py-12">
                    <Share2 className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No codes found</h3>
                    <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'collaborate' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Collaboration Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create teams, work on projects together, and share knowledge with other developers
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {[
                    {
                      icon: '👥',
                      title: 'Create Teams',
                      description: 'Invite colleagues and friends to collaborate on code projects'
                    },
                    {
                      icon: '🔄',
                      title: 'Real-time Editing',
                      description: 'Edit code together with live synchronization and conflict resolution'
                    },
                    {
                      icon: '💬',
                      title: 'Team Chat',
                      description: 'Discuss code changes and share ideas with built-in messaging'
                    },
                    {
                      icon: '📊',
                      title: 'Code Reviews',
                      description: 'Review team members code and provide feedback with annotations'
                    },
                    {
                      icon: '🎯',
                      title: 'Project Management',
                      description: 'Track progress, assign tasks, and manage deadlines'
                    },
                    {
                      icon: '📈',
                      title: 'Analytics',
                      description: 'Monitor team productivity and code quality metrics'
                    }
                  ].map((feature, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-codes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  My Shared Codes ({userCodes.length})
                </h3>
                <button
                  onClick={() => setActiveTab('share')}
                  className="px-4 py-2 bg-cyan-600 text-white text-sm rounded-md hover:bg-cyan-700"
                >
                  Share New Code
                </button>
              </div>

              {userCodes.length > 0 ? (
                <div className="space-y-4">
                  {userCodes.map(code => (
                    <div key={code.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{code.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{code.description}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mb-3">
                            <span>{new Date(code.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {code.likes}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {code.views}
                            </span>
                            <span className="flex items-center">
                              <Share2 className="h-4 w-4 mr-1" />
                              {code.forks} forks
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {code.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => copyShareLink(code.id)}
                            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Copy share link"
                          >
                            {copiedId === code.id ? <Check className="h-4 w-4 text-green-600" /> : <Link className="h-4 w-4" />}
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-md p-4">
                        <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                          <code>{code.code.slice(0, 300)}{code.code.length > 300 ? '\n...' : ''}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No codes shared yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Share your first code snippet with the community</p>
                  <button
                    onClick={() => setActiveTab('share')}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
                  >
                    Share Your First Code
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}