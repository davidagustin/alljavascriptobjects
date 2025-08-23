'use client'

import React from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
}

function Card({ 
  children, 
  className, 
  padding = 'md',
  hover = false,
  clickable = false,
  onClick 
}: CardProps) {
  const Component = clickable ? 'button' : 'div'
  
  return (
    <Component
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
        paddingStyles[padding],
        hover && 'hover:shadow-md transition-shadow duration-200',
        clickable && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        className
      )}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </Component>
  )
}

function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('pb-3 border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  )
}

function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('py-3', className)}>
      {children}
    </div>
  )
}

function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('pt-3 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export default Card