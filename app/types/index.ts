// Core application types
export interface JavaScriptObject {
  name: string
  category: ObjectCategory
  difficulty: Difficulty
  description: string
  overview?: string
  syntax?: string
  useCases?: string[]
  browserSupport?: string
  tags?: string[]
  examples?: CodeExample[]
  methods?: ObjectMethod[]
  properties?: ObjectProperty[]
}

export interface CodeExample {
  id: string
  title: string
  code: string
  explanation: string
  language?: ProgrammingLanguage
  difficulty?: Difficulty
  tags?: string[]
}

export interface ObjectMethod {
  name: string
  description: string
  syntax: string
  parameters?: Parameter[]
  returnType?: string
  examples?: CodeExample[]
}

export interface ObjectProperty {
  name: string
  description: string
  type: string
  readonly?: boolean
  examples?: CodeExample[]
}

export interface Parameter {
  name: string
  type: string
  optional?: boolean
  description: string
  defaultValue?: string
}

// Enums and Union Types
export type ObjectCategory = 
  | 'Fundamental'
  | 'Numbers & Math'
  | 'Text'
  | 'Collections'
  | 'Typed Arrays'
  | 'Errors'
  | 'Control Flow'
  | 'Memory Management'
  | 'Meta Programming'
  | 'Internationalization'
  | 'Data Processing'
  | 'Global Functions'

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type ProgrammingLanguage = 'javascript' | 'typescript' | 'jsx' | 'tsx'
export type ThemeMode = 'light' | 'dark' | 'system'

// User and Progress Types
export interface UserProgress {
  visitedObjects: string[]
  favorites: string[]
  completedExamples: string[]
  testResults: TestResult[]
  learningPaths: LearningPathProgress[]
  settings: UserSettings
  stats: UserStats
}

export interface UserSettings {
  theme: ThemeMode
  fontSize: number
  autoSave: boolean
  notifications: NotificationSettings
  accessibility: AccessibilitySettings
}

export interface NotificationSettings {
  enabled: boolean
  updates: boolean
  reminders: boolean
  achievements: boolean
}

export interface AccessibilitySettings {
  highContrast: boolean
  reducedMotion: boolean
  screenReader: boolean
  fontSize: 'small' | 'medium' | 'large' | 'xlarge'
}

export interface UserStats {
  totalTimeSpent: number
  objectsExplored: number
  examplesCompleted: number
  testsCompleted: number
  streakDays: number
  lastVisit: Date
}

// Learning Path Types
export interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  category: ObjectCategory
  estimatedTime: number
  prerequisites: string[]
  objectives: LearningObjective[]
  skills: string[]
  completion: number
}

export interface LearningObjective {
  id: string
  title: string
  description: string
  type: 'read' | 'practice' | 'test' | 'project'
  relatedObjects: string[]
  estimatedTime: number
  completed: boolean
  completedAt?: Date
}

export interface LearningPathProgress {
  pathId: string
  startedAt: Date
  completedObjectives: string[]
  currentObjective?: string
  completion: number
  timeSpent: number
}

// Testing and Assessment Types
export interface Test {
  id: string
  title: string
  description: string
  category: ObjectCategory
  difficulty: Difficulty
  questions: TestQuestion[]
  timeLimit?: number
  passingScore: number
}

export interface TestQuestion {
  id: string
  type: 'multiple-choice' | 'code-completion' | 'true-false' | 'fill-blank'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
  code?: string
}

export interface TestResult {
  testId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  completedAt: Date
  answers: TestAnswer[]
}

export interface TestAnswer {
  questionId: string
  answer: string | string[]
  correct: boolean
  timeSpent: number
}

// Code Sharing Types
export interface SharedCode {
  id: string
  title: string
  description: string
  code: string
  language: ProgrammingLanguage
  author: User
  createdAt: Date
  updatedAt: Date
  tags: string[]
  category: ObjectCategory
  visibility: 'public' | 'private' | 'unlisted'
  likes: number
  views: number
  forks: number
  comments: Comment[]
  forkedFrom?: string
}

export interface User {
  id: string
  username: string
  avatar?: string
  bio?: string
  reputation: number
  badges: Badge[]
  joinedAt: Date
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: Date
  updatedAt?: Date
  likes: number
  replies: Comment[]
  parentId?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: Date
}

// Performance and Analytics Types
export interface PerformanceMetric {
  id: string
  name: string
  value: number
  unit: string
  timestamp: Date
  category: 'execution' | 'memory' | 'network' | 'rendering' | 'interaction'
  severity: 'low' | 'medium' | 'high'
  metadata?: Record<string, any>
}

export interface CodeExecution {
  id: string
  code: string
  language: ProgrammingLanguage
  executionTime: number
  memoryUsage: number
  success: boolean
  output?: string
  errors?: string[]
  timestamp: Date
}

// Search and Filtering Types
export interface SearchFilter {
  query?: string
  categories: ObjectCategory[]
  difficulties: Difficulty[]
  tags: string[]
  favorites: boolean
  visited: boolean
  hasExamples: boolean
  dateRange?: DateRange
}

export interface DateRange {
  start: Date
  end: Date
}

export interface SearchResult {
  object: JavaScriptObject
  relevanceScore: number
  matchedFields: string[]
  highlightedText?: string
}

// Visualization Types
export interface VisualizationConfig {
  type: 'tree' | 'graph' | 'chart' | 'diagram'
  theme: ThemeMode
  width: number
  height: number
  interactive: boolean
  animated: boolean
  colors: string[]
  showLabels: boolean
  showLegend: boolean
}

export interface ChartData {
  labels: string[]
  datasets: DataSet[]
}

export interface DataSet {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  metadata?: {
    page?: number
    limit?: number
    total?: number
    timestamp: Date
  }
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// Event Types
export interface AppEvent {
  type: string
  payload?: any
  timestamp: Date
  userId?: string
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  testId?: string
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Constants
export const OBJECT_CATEGORIES: readonly ObjectCategory[] = [
  'Fundamental',
  'Numbers & Math', 
  'Text',
  'Collections',
  'Typed Arrays',
  'Errors',
  'Control Flow',
  'Memory Management',
  'Meta Programming',
  'Internationalization',
  'Data Processing',
  'Global Functions'
] as const

export const DIFFICULTIES: readonly Difficulty[] = [
  'Beginner',
  'Intermediate', 
  'Advanced'
] as const

export const PROGRAMMING_LANGUAGES: readonly ProgrammingLanguage[] = [
  'javascript',
  'typescript',
  'jsx',
  'tsx'
] as const