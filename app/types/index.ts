/**
 * Global type definitions for the JavaScript Objects Tutorial application
 */

// Base component props interface
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Interactive component props interface
export interface InteractiveComponentProps extends BaseComponentProps {
  onSelect?: (value: any) => void
  onToggle?: (value: any) => void
  onUpdate?: (value: any) => void
}

// Difficulty levels
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

// JavaScript object interface
export interface JavaScriptObject {
  name: string
  category: string
  difficulty: DifficultyLevel
  tags: string[]
  description: string
  hasExamples: boolean
  mdnUrl: string
  exampleCount: number
  deprecated?: boolean
  since?: string
  browser?: {
    chrome: string
    firefox: string
    safari: string
    edge: string
  }
}

// Object category interface
export interface ObjectCategory {
  name: string
  description: string
  difficulty: DifficultyLevel
  objects: string[]
  icon?: string
}

// Code example interface
export interface CodeExample {
  id: string
  title: string
  description: string
  code: string
  difficulty: DifficultyLevel
  tags: string[]
  output?: string
  explanation?: string
  relatedObjects?: string[]
}

// User progress interface
export interface UserProgress {
  visitedObjects: string[]
  favorites: string[]
  completedQuizzes: string[]
  studySessions: StudySession[]
  lastVisited?: Date
  totalTimeSpent: number
}

// Study session interface
export interface StudySession {
  id: string
  startTime: Date
  endTime?: Date
  duration: number
  objectsStudied: string[]
  completed: boolean
  score?: number
}

// Quiz interface
export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  difficulty: DifficultyLevel
  timeLimit?: number
  passingScore: number
}

// Quiz question interface
export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: DifficultyLevel
  category: string
  object?: string
}

// Quiz result interface
export interface QuizResult {
  quizId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  completedAt: Date
  answers: QuizAnswer[]
}

// Quiz answer interface
export interface QuizAnswer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
}

// Code snippet interface
export interface CodeSnippet {
  id: string
  name: string
  code: string
  objectName: string
  createdAt: Date
  updatedAt: Date
  tags?: string[]
  description?: string
}

// Notification interface
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    url: string
  }
}

// Performance metric interface
export interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

// User interaction interface
export interface UserInteraction {
  action: string
  target: string
  timestamp: number
  duration?: number
  metadata?: Record<string, any>
}

// Search result interface
export interface SearchResult {
  objectName: string
  score: number
  matchType: 'exact' | 'starts' | 'contains' | 'tag' | 'category'
  matchedText: string
}

// Search options interface
export interface SearchOptions {
  caseSensitive?: boolean
  includeDescriptions?: boolean
  boostFavorites?: boolean
  boostVisited?: boolean
  maxResults?: number
}

// Filter options interface
export interface FilterOptions {
  categories?: string[]
  difficulties?: string[]
  tags?: string[]
  favorites?: boolean
  visited?: boolean
  hasExamples?: boolean
}

// Code execution result interface
export interface CodeExecutionResult {
  result: unknown
  consoleOutput: Array<{
    type: 'log' | 'error' | 'warn' | 'info'
    content: unknown[]
  }>
  errors: string[]
  executionTime: number
  memoryUsage?: number
}

// Execution options interface
export interface ExecutionOptions {
  timeout?: number
  maxMemory?: number
  allowNetwork?: boolean
  allowFileSystem?: boolean
  allowEval?: boolean
  sandbox?: boolean
}

// Theme interface
export type Theme = 'light' | 'dark' | 'system'

// App context interface
export interface AppContextType {
  favorites: string[]
  visitedObjects: string[]
  addToFavorites: (objectName: string) => void
  removeFromFavorites: (objectName: string) => void
  markAsVisited: (objectName: string) => void
  isObjectFavorited: (objectName: string) => boolean
  isObjectVisited: (objectName: string) => boolean
  getProgress: () => { visited: number; total: number; percentage: number }
  clearProgress: () => void
}

// Theme context interface
export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Notification context interface
export interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  clearAll: () => void
  removeNotification: (id: string) => void
}

// Error analysis result interface
export interface ErrorAnalysis {
  type: 'syntax' | 'runtime' | 'reference' | 'type' | 'range' | 'uri' | 'eval' | 'aggregate' | 'unknown'
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'parsing' | 'execution' | 'security' | 'performance' | 'other'
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Learning path interface
export interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: DifficultyLevel
  estimatedTime: number
  modules: LearningModule[]
  prerequisites: string[]
  objectives: string[]
}

// Learning module interface
export interface LearningModule {
  id: string
  title: string
  description: string
  difficulty: DifficultyLevel
  estimatedTime: number
  objectives: string[]
  objects: string[]
  prerequisites: string[]
  exercises: Exercise[]
  isCompleted: boolean
  isUnlocked: boolean
  completionDate?: Date
  score?: number
}

// Exercise interface
export interface Exercise {
  id: string
  title: string
  description: string
  type: 'coding' | 'quiz' | 'reading' | 'practice'
  difficulty: DifficultyLevel
  estimatedTime: number
  isCompleted: boolean
  score?: number
}

// PWA install prompt interface
export interface PWAInstallPrompt {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Service worker registration interface
export interface ServiceWorkerRegistration {
  installing?: ServiceWorker
  waiting?: ServiceWorker
  active?: ServiceWorker
  scope: string
  updateViaCache: 'all' | 'imports' | 'none'
  onupdatefound: ((this: ServiceWorkerRegistration, ev: Event) => any) | null
  oncontrollerchange: ((this: ServiceWorkerRegistration, ev: Event) => any) | null
  update(): Promise<void>
  unregister(): Promise<boolean>
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>

export type Nullable<T> = T | null

export type Undefinable<T> = T | undefined

// Event handler types
export type EventHandler<T = Event> = (event: T) => void

export type KeyboardEventHandler = EventHandler<KeyboardEvent>

export type MouseEventHandler = EventHandler<MouseEvent>

export type ChangeEventHandler = EventHandler<ChangeEvent<HTMLInputElement>>

export type FocusEventHandler = EventHandler<FocusEvent>

// Component prop types
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never

export type ComponentRef<T> = T extends React.ComponentType<any> 
  ? React.ComponentRef<T> 
  : never

// Async result types
export type AsyncResult<T, E = Error> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E }

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Storage types
export interface StorageData {
  favorites: string[]
  visitedObjects: string[]
  theme: Theme
  notifications: Notification[]
  codeSnippets: CodeSnippet[]
  studySessions: StudySession[]
  quizResults: QuizResult[]
  performanceMetrics: PerformanceMetric[]
  userInteractions: UserInteraction[]
}

// Export all types
export type {
  BaseComponentProps,
  InteractiveComponentProps,
  DifficultyLevel,
  JavaScriptObject,
  ObjectCategory,
  CodeExample,
  UserProgress,
  StudySession,
  Quiz,
  QuizQuestion,
  QuizResult,
  QuizAnswer,
  CodeSnippet,
  Notification,
  PerformanceMetric,
  UserInteraction,
  SearchResult,
  SearchOptions,
  FilterOptions,
  CodeExecutionResult,
  ExecutionOptions,
  Theme,
  AppContextType,
  ThemeContextType,
  NotificationContextType,
  ErrorAnalysis,
  ValidationResult,
  LearningPath,
  LearningModule,
  Exercise,
  PWAInstallPrompt,
  ServiceWorkerRegistration,
  DeepPartial,
  Optional,
  Required,
  Nullable,
  Undefinable,
  EventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ChangeEventHandler,
  FocusEventHandler,
  ComponentProps,
  ComponentRef,
  AsyncResult,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  StorageData
}