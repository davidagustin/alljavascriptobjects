'use client'

import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationsProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

export default function Notifications({ notifications, onMarkAsRead, onClearAll }: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
    }
  }

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5)

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 5 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {showAll ? 'Show less' : `Show all ${notifications.length} notifications`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Notification Context and Hook
import { createContext, useContext, useCallback } from 'react'

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  clearAll: () => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]) // Keep max 20 notifications
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const clearAll = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      clearAll,
      removeNotification
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
