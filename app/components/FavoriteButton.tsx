'use client'

import { Heart } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

interface FavoriteButtonProps {
  objectName: string
  className?: string
}

export default function FavoriteButton({ objectName, className = '' }: FavoriteButtonProps) {
  const { isObjectFavorited, addToFavorites, removeFromFavorites } = useApp()
  const isFavorited = isObjectFavorited(objectName)

  const toggleFavorite = () => {
    if (isFavorited) {
      removeFromFavorites(objectName)
    } else {
      addToFavorites(objectName)
    }
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite()
      }}
      className={`p-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 ${
        isFavorited
          ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20'
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
      } ${className}`}
      aria-label={`${isFavorited ? 'Remove from' : 'Add to'} favorites`}
      title={`${isFavorited ? 'Remove from' : 'Add to'} favorites`}
    >
      <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
    </button>
  )
}
