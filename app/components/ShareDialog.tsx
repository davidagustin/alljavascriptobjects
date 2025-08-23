'use client'

import { useState, useEffect } from 'react'
import { Share2, Copy, Check, X, Twitter, Facebook, Linkedin } from 'lucide-react'

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  code?: string
}

export default function ShareDialog({ isOpen, onClose, title, code }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  const shareText = `Check out this JavaScript ${title} example on JS Objects Tutorial!`
  const shareUrl = currentUrl

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareToSocial = (platform: string) => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)
    
    let url = ''
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `JavaScript ${title} - JS Objects Tutorial`,
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close share dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Copy URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={() => copyToClipboard(shareUrl)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
                title="Copy URL"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Copy Code */}
          {code && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share Code
              </label>
              <button
                onClick={() => copyToClipboard(code)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors flex items-center justify-center"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code Example
              </button>
            </div>
          )}

          {/* Social Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share on Social Media
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => shareToSocial('twitter')}
                className="flex-1 px-3 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md transition-colors flex items-center justify-center"
                title="Share on Twitter"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </button>
              <button
                onClick={() => shareToSocial('facebook')}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center"
                title="Share on Facebook"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </button>
              <button
                onClick={() => shareToSocial('linkedin')}
                className="flex-1 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition-colors flex items-center justify-center"
                title="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </button>
            </div>
          </div>

          {/* Native Share API */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share with System
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
