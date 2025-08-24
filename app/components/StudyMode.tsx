'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Timer, Target, CheckCircle, X, Play, Pause, RotateCcw } from 'lucide-react'

interface StudyModeProps {
  onObjectSelect: (objectName: string) => void
  objects: string[]
}

interface StudySession {
  id: string
  startTime: string
  endTime?: string
  duration: number
  objectsStudied: string[]
  completed: boolean
}

export default function StudyMode({ onObjectSelect, objects }: StudyModeProps) {
  const [isActive, setIsActive] = useState(false)
  const [session, setSession] = useState<StudySession | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [targetObjects, setTargetObjects] = useState<string[]>([])
  const [studiedObjects, setStudiedObjects] = useState<string[]>([])
  const [showSessionHistory, setShowSessionHistory] = useState(false)
  const [sessions, setSessions] = useState<StudySession[]>([])

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && session) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, session])

  const loadSessions = () => {
    if (typeof window === 'undefined') return
    
    const saved = localStorage.getItem('study-sessions')
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading sessions:', error)
      }
    }
  }

  const saveSessions = (newSessions: StudySession[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('study-sessions', JSON.stringify(newSessions))
    }
    setSessions(newSessions)
  }

  const startSession = () => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      duration: 0,
      objectsStudied: [],
      completed: false
    }
    setSession(newSession)
    setIsActive(true)
    setTimeElapsed(0)
    setStudiedObjects([])
  }

  const pauseSession = () => {
    setIsActive(false)
  }

  const resumeSession = () => {
    setIsActive(true)
  }

  const endSession = () => {
    if (!session) return

    const completedSession: StudySession = {
      ...session,
      endTime: new Date().toISOString(),
      duration: timeElapsed,
      objectsStudied: studiedObjects,
      completed: true
    }

    const updatedSessions = [completedSession, ...sessions]
    saveSessions(updatedSessions)

    setSession(null)
    setIsActive(false)
    setTimeElapsed(0)
    setStudiedObjects([])
    setTargetObjects([])
  }

  const markObjectStudied = (objectName: string) => {
    if (!studiedObjects.includes(objectName)) {
      setStudiedObjects(prev => [...prev, objectName])
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!targetObjects || targetObjects.length === 0) return 0
    return (studiedObjects.length / targetObjects.length) * 100
  }

  const getStudyStreak = () => {
    if (!sessions || sessions.length === 0) return 0
    
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    const hasStudiedToday = sessions.some(s => 
      new Date(s.startTime).toDateString() === today
    )
    const hasStudiedYesterday = sessions.some(s => 
      new Date(s.startTime).toDateString() === yesterday
    )

    if (hasStudiedToday && hasStudiedYesterday) return 2
    if (hasStudiedToday) return 1
    return 0
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Study Mode
        </h3>
        <button
          onClick={() => setShowSessionHistory(!showSessionHistory)}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {showSessionHistory ? 'Hide' : 'Show'} History
        </button>
      </div>

      {!session ? (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Start a Focused Study Session
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Set learning goals and track your progress with timed study sessions.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Objects (optional)
            </label>
            <select
              multiple
              value={targetObjects}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value)
                setTargetObjects(selected)
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              size={5}
            >
              {(objects || []).map(obj => (
                <option key={obj} value={obj}>
                  {obj}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Hold Ctrl/Cmd to select multiple objects
            </p>
          </div>

          <button
            onClick={startSession}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Study Session
          </button>

          {/* Study Streak */}
          <div className="flex items-center justify-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Target className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              Study Streak: {getStudyStreak()} day{getStudyStreak() !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Timer */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Study Time
            </div>
          </div>

          {/* Progress */}
          {targetObjects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {studiedObjects.length} / {targetObjects.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          )}

          {/* Target Objects */}
          {targetObjects.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Objects
              </h4>
              <div className="space-y-1">
                {(targetObjects || []).map(obj => (
                  <button
                    key={obj}
                    onClick={() => {
                      onObjectSelect(obj)
                      markObjectStudied(obj)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      studiedObjects.includes(obj)
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{obj}</span>
                      {studiedObjects.includes(obj) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {isActive ? (
              <button
                onClick={pauseSession}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </button>
            ) : (
              <button
                onClick={resumeSession}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="h-4 w-4 mr-2" />
                Resume
              </button>
            )}
            <button
              onClick={endSession}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              End Session
            </button>
          </div>
        </div>
      )}

      {/* Session History */}
      {showSessionHistory && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recent Sessions
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No study sessions yet
              </p>
            ) : (
              (sessions || []).slice(0, 5).map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatTime(session.duration)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(session.startTime).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {session.objectsStudied.length} objects
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {session.completed ? 'Completed' : 'Incomplete'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
