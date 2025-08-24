'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Users, UserPlus, Share2, Globe, Lock, Copy, Check, X, MessageSquare, Video, Mic, MicOff, VideoOff } from 'lucide-react'

interface CollaboratorCursor {
  id: string
  name: string
  color: string
  x: number
  y: number
  lastActive: Date
}

interface CollaborationSession {
  id: string
  name: string
  host: string
  participants: string[]
  isPublic: boolean
  createdAt: Date
  code?: string
  messages: ChatMessage[]
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  type: 'text' | 'code' | 'system'
}

export default function CollaborationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<CollaborationSession | null>(null)
  const [sessionId, setSessionId] = useState('')
  const [userName, setUserName] = useState('')
  const [cursors, setCursors] = useState<CollaboratorCursor[]>([])
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isJoiningSession, setIsJoiningSession] = useState(false)
  const [copied, setCopied] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Simulate real-time cursor movements
  useEffect(() => {
    if (!session) return
    
    const interval = setInterval(() => {
      setCursors(prev => prev.map(cursor => ({
        ...cursor,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        lastActive: new Date()
      })))
    }, 3000)
    
    return () => clearInterval(interval)
  }, [session])

  // Track mouse movement
  useEffect(() => {
    if (!session) return
    
    const handleMouseMove = (e: MouseEvent) => {
      // In a real app, this would broadcast to other users
      if (userName) {
        // Broadcast cursor position
      }
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [session, userName])

  const createSession = useCallback(() => {
    if (!userName) return
    
    setIsCreatingSession(true)
    
    // Simulate session creation
    setTimeout(() => {
      const newSession: CollaborationSession = {
        id: Math.random().toString(36).substring(7),
        name: `${userName}'s Session`,
        host: userName,
        participants: [userName],
        isPublic: true,
        createdAt: new Date(),
        messages: [{
          id: '1',
          user: 'System',
          message: `${userName} created the session`,
          timestamp: new Date(),
          type: 'system'
        }]
      }
      
      setSession(newSession)
      setSessionId(newSession.id)
      setIsCreatingSession(false)
      
      // Add sample collaborators
      setTimeout(() => {
        setCursors([
          {
            id: '1',
            name: 'Alice',
            color: '#ef4444',
            x: 100,
            y: 100,
            lastActive: new Date()
          },
          {
            id: '2',
            name: 'Bob',
            color: '#3b82f6',
            x: 200,
            y: 200,
            lastActive: new Date()
          }
        ])
      }, 1000)
    }, 1000)
  }, [userName])

  const joinSession = useCallback(() => {
    if (!userName || !sessionId) return
    
    setIsJoiningSession(true)
    
    // Simulate joining session
    setTimeout(() => {
      const newSession: CollaborationSession = {
        id: sessionId,
        name: `Collaborative Session`,
        host: 'Host',
        participants: ['Host', userName],
        isPublic: true,
        createdAt: new Date(),
        messages: [{
          id: '1',
          user: 'System',
          message: `${userName} joined the session`,
          timestamp: new Date(),
          type: 'system'
        }]
      }
      
      setSession(newSession)
      setIsJoiningSession(false)
    }, 1000)
  }, [userName, sessionId])

  const leaveSession = useCallback(() => {
    setSession(null)
    setSessionId('')
    setCursors([])
    setChatOpen(false)
    
    // Stop media streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  const copySessionLink = useCallback(() => {
    if (session) {
      navigator.clipboard.writeText(`https://jsobj.app/collab/${session.id}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [session])

  const sendMessage = useCallback(() => {
    if (!message.trim() || !session) return
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: userName,
      message,
      timestamp: new Date(),
      type: 'text'
    }
    
    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null)
    
    setMessage('')
  }, [message, userName, session])

  const toggleVideo = useCallback(async () => {
    if (!isVideoOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setIsVideoOn(true)
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(track => track.stop())
      }
      setIsVideoOn(false)
    }
  }, [isVideoOn])

  const toggleAudio = useCallback(async () => {
    if (!isAudioOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        streamRef.current = stream
        setIsAudioOn(true)
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(track => track.stop())
      }
      setIsAudioOn(false)
    }
  }, [isAudioOn])

  return (
    <>
      {/* Collaboration Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-40 p-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
        title="Collaboration"
      >
        <Users className="h-5 w-5" />
        {session && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Collaboration Panel */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Collaboration
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!session ? (
            <div className="p-4 space-y-4">
              {/* User Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Create Session */}
              <button
                onClick={createSession}
                disabled={!userName || isCreatingSession}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                         bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isCreatingSession ? 'Creating...' : 'Create Session'}</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">OR</span>
                </div>
              </div>

              {/* Join Session */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter session ID"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={joinSession}
                  disabled={!userName || !sessionId || isJoiningSession}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                           border border-purple-600 text-purple-600 dark:text-purple-400 
                           rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span>{isJoiningSession ? 'Joining...' : 'Join Session'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Session Info */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {session.isPublic ? (
                      <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Lock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {session.name}
                    </span>
                  </div>
                  <button
                    onClick={leaveSession}
                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Leave
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Session ID: {session.id}
                  </div>
                  <button
                    onClick={copySessionLink}
                    className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Participants */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Participants ({session.participants.length})
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {session.participants.map((participant, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 px-2 py-1 rounded bg-gray-50 dark:bg-gray-700"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][index % 4] }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {participant}
                        {participant === session.host && (
                          <span className="ml-1 text-xs text-purple-600 dark:text-purple-400">(Host)</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaboration Tools */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className={`p-2 rounded-lg transition-colors ${
                      chatOpen 
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Chat"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleVideo}
                    className={`p-2 rounded-lg transition-colors ${
                      isVideoOn 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Video"
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={toggleAudio}
                    className={`p-2 rounded-lg transition-colors ${
                      isAudioOn 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Audio"
                  >
                    {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </button>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs"
                >
                  <Share2 className="h-3 w-3" />
                  <span>Share Screen</span>
                </button>
              </div>

              {/* Chat Panel */}
              {chatOpen && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="h-40 bg-gray-50 dark:bg-gray-900 rounded-lg p-2 overflow-y-auto mb-2">
                    {session.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-2 ${
                          msg.type === 'system' 
                            ? 'text-center text-xs text-gray-500 dark:text-gray-400 italic'
                            : ''
                        }`}
                      >
                        {msg.type !== 'system' && (
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {msg.user}
                          </div>
                        )}
                        <div className={`text-sm ${
                          msg.type === 'code' 
                            ? 'font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                               focus:ring-1 focus:ring-purple-500 focus:border-transparent
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* Video Preview */}
              {isVideoOn && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-32 bg-black rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Cursor Overlays */}
      {session && cursors.map((cursor) => (
        <div
          key={cursor.id}
          className="fixed pointer-events-none z-50 transition-all duration-200"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div
            className="w-4 h-4 rounded-full opacity-75"
            style={{ backgroundColor: cursor.color }}
          />
          <div
            className="absolute top-4 left-0 px-2 py-1 text-xs text-white rounded shadow-lg whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </>
  )
}