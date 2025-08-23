'use client'

import { useState } from 'react'
import { Bookmark, BookmarkCheck, Plus, X, Star } from 'lucide-react'

interface BookmarkManagerProps {
  bookmarkedObjects: string[]
  onToggleBookmark: (objectName: string) => void
  onObjectClick: (objectName: string) => void
}

export default function BookmarkManager({ bookmarkedObjects, onToggleBookmark, onObjectClick }: BookmarkManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [newBookmark, setNewBookmark] = useState('')

  const addBookmark = () => {
    if (newBookmark.trim() && !bookmarkedObjects.includes(newBookmark.trim())) {
      onToggleBookmark(newBookmark.trim())
      setNewBookmark('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addBookmark()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Bookmark className="h-5 w-5 mr-2" />
          Bookmarks
          {bookmarkedObjects.length > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {bookmarkedObjects.length}
            </span>
          )}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Add New Bookmark */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newBookmark}
            onChange={(e) => setNewBookmark(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add object name..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addBookmark}
            disabled={!newBookmark.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bookmarked Objects */}
      {isExpanded && (
        <div className="space-y-2">
          {bookmarkedObjects.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Star className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No bookmarks yet</p>
              <p className="text-xs">Add your favorite JavaScript objects here</p>
            </div>
          ) : (
            bookmarkedObjects.map((objectName) => (
              <div
                key={objectName}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <button
                  onClick={() => onObjectClick(objectName)}
                  className="flex items-center text-left flex-1"
                >
                  <BookmarkCheck className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{objectName}</span>
                </button>
                <button
                  onClick={() => onToggleBookmark(objectName)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Quick Stats */}
      {!isExpanded && bookmarkedObjects.length > 0 && (
        <div className="text-sm text-gray-600">
          {bookmarkedObjects.length} object{bookmarkedObjects.length !== 1 ? 's' : ''} bookmarked
        </div>
      )}
    </div>
  )
}
