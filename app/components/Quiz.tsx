'use client'

import { useState, useCallback, useEffect } from 'react'
import { Brain, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Clock, Target } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  object?: string
}

interface QuizProps {
  onComplete?: (score: number, total: number) => void
}

export default function Quiz({ onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizStarted, setQuizStarted] = useState(false)

  const questions: Question[] = [
    {
      id: '1',
      question: 'What is the primary purpose of the Object constructor in JavaScript?',
      options: [
        'To create arrays',
        'To create collections of key-value pairs',
        'To create functions',
        'To create numbers'
      ],
      correctAnswer: 1,
      explanation: 'The Object constructor creates objects, which are collections of key-value pairs. This is the fundamental building block of JavaScript.',
      difficulty: 'easy',
      category: 'Fundamentals',
      object: 'Object'
    },
    {
      id: '2',
      question: 'Which method is used to check if an object has a specific property?',
      options: [
        'hasProperty()',
        'hasOwnProperty()',
        'contains()',
        'exists()'
      ],
      correctAnswer: 1,
      explanation: 'hasOwnProperty() is the correct method to check if an object has a specific property as its own property (not inherited).',
      difficulty: 'easy',
      category: 'Fundamentals',
      object: 'Object'
    },
    {
      id: '3',
      question: 'What does the Map object provide that regular objects do not?',
      options: [
        'Better performance',
        'Keys can be any value (not just strings)',
        'Built-in iteration methods',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'Map objects provide all these benefits: better performance for frequent additions/removals, keys can be any value, and built-in iteration methods.',
      difficulty: 'medium',
      category: 'Collections',
      object: 'Map'
    },
    {
      id: '4',
      question: 'What is the difference between Set and Array?',
      options: [
        'Set is faster',
        'Set only stores unique values',
        'Set has different methods',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'Set objects are collections of unique values, have different methods than arrays, and can be faster for certain operations.',
      difficulty: 'medium',
      category: 'Collections',
      object: 'Set'
    },
    {
      id: '5',
      question: 'What does Promise.resolve() do?',
      options: [
        'Creates a rejected promise',
        'Creates a pending promise',
        'Creates a fulfilled promise with the given value',
        'Waits for a promise to resolve'
      ],
      correctAnswer: 2,
      explanation: 'Promise.resolve() creates a promise that is fulfilled with the given value. It\'s useful for converting values to promises.',
      difficulty: 'medium',
      category: 'Async',
      object: 'Promise'
    },
    {
      id: '6',
      question: 'What is the purpose of Symbol in JavaScript?',
      options: [
        'To create unique identifiers',
        'To create private properties',
        'To improve performance',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'Symbols are used to create unique identifiers, can be used for private properties, and can improve performance in some cases.',
      difficulty: 'hard',
      category: 'Advanced',
      object: 'Symbol'
    },
    {
      id: '7',
      question: 'What does Proxy allow you to do?',
      options: [
        'Create virtual objects',
        'Intercept and customize object operations',
        'Improve performance',
        'Create immutable objects'
      ],
      correctAnswer: 1,
      explanation: 'Proxy allows you to intercept and customize fundamental operations for objects, such as property lookup, assignment, enumeration, etc.',
      difficulty: 'hard',
      category: 'Advanced',
      object: 'Proxy'
    },
    {
      id: '8',
      question: 'What is the main advantage of TypedArray over regular arrays?',
      options: [
        'Better performance for numeric operations',
        'Memory efficiency',
        'Type safety',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'TypedArrays provide better performance for numeric operations, memory efficiency, and type safety compared to regular arrays.',
      difficulty: 'medium',
      category: 'Binary Data',
      object: 'TypedArray'
    },
    {
      id: '9',
      question: 'What does BigInt allow you to do?',
      options: [
        'Store larger numbers than Number',
        'Perform precise arithmetic',
        'Handle financial calculations',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'BigInt allows you to store integers larger than Number.MAX_SAFE_INTEGER, perform precise arithmetic, and handle financial calculations without precision loss.',
      difficulty: 'medium',
      category: 'Numbers',
      object: 'BigInt'
    },
    {
      id: '10',
      question: 'What is the purpose of Reflect in JavaScript?',
      options: [
        'To provide reflection capabilities',
        'To provide methods for interceptable JavaScript operations',
        'To improve performance',
        'To create proxies'
      ],
      correctAnswer: 1,
      explanation: 'Reflect provides methods for interceptable JavaScript operations. These methods are the same as those of proxy handlers.',
      difficulty: 'hard',
      category: 'Advanced',
      object: 'Reflect'
    }
  ]

  const currentQuestion = questions[currentQuestionIndex]

  // Timer effect
  useEffect(() => {
    if (!quizStarted || showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1) // Time's up, mark as incorrect
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, showResults])

  const handleAnswer = useCallback((answerIndex: number) => {
    if (isAnswered) return

    setSelectedAnswer(answerIndex)
    setIsAnswered(true)

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1)
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestion()
      } else {
        finishQuiz()
      }
    }, 2000)
  }, [currentQuestionIndex, currentQuestion, isAnswered, questions.length])

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setTimeLeft(30)
  }, [])

  const finishQuiz = useCallback(() => {
    setShowResults(true)
    onComplete?.(score, questions.length)
  }, [score, questions.length, onComplete])

  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setShowResults(false)
    setTimeLeft(30)
    setQuizStarted(false)
  }, [])

  const startQuiz = useCallback(() => {
    setQuizStarted(true)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'hard': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return { message: 'Excellent! You\'re a JavaScript Master!', icon: Trophy, color: 'text-yellow-600' }
    if (percentage >= 70) return { message: 'Great job! You have solid knowledge!', icon: Target, color: 'text-green-600' }
    if (percentage >= 50) return { message: 'Good effort! Keep learning!', icon: Brain, color: 'text-blue-600' }
    return { message: 'Keep practicing! You\'ll get better!', icon: Brain, color: 'text-gray-600' }
  }

  if (!quizStarted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-500" />
            JavaScript Objects Quiz
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Test your knowledge of JavaScript objects and concepts
          </p>
        </div>

        <div className="p-6">
          <div className="text-center space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
              <Brain className="h-16 w-16 mx-auto text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Ready to test your knowledge?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This quiz contains {questions.length} questions covering various JavaScript objects and concepts.
                You'll have 30 seconds per question.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{questions.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">30s</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Per Question</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Mixed</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Difficulty</div>
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100)
    const scoreInfo = getScoreMessage(percentage)

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
            Quiz Results
          </h2>
        </div>

        <div className="p-6">
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6">
              <scoreInfo.icon className={`h-16 w-16 mx-auto ${scoreInfo.color} mb-4`} />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {score} / {questions.length}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {percentage}% Correct
              </p>
              <p className={`text-lg font-medium ${scoreInfo.color} mb-6`}>
                {scoreInfo.message}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600">{questions.length - score}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
                </div>
              </div>

              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium flex items-center mx-auto"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-500" />
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {timeLeft}s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Score: {score}/{currentQuestionIndex + 1}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Question */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentQuestion.category}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.correctAnswer
              const showResult = isAnswered

              let buttonClass = 'w-full p-4 text-left rounded-lg border transition-colors'
              
              if (showResult) {
                if (isCorrect) {
                  buttonClass += ' bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700'
                } else if (isSelected && !isCorrect) {
                  buttonClass += ' bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-700'
                } else {
                  buttonClass += ' bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                }
              } else {
                buttonClass += isSelected
                  ? ' bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700'
                  : ' bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-gray-100">{option}</span>
                    {showResult && (
                      <div className="flex items-center">
                        {isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Explanation:
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {currentQuestion.explanation}
              </p>
              {currentQuestion.object && (
                <div className="mt-2">
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    Related object: {currentQuestion.object}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          {isAnswered && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentQuestionIndex + 1} of {questions.length} questions
              </div>
              <button
                onClick={currentQuestionIndex < questions.length - 1 ? nextQuestion : finishQuiz}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  'See Results'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
