import React from 'react'
import { cn } from '../../utils/cn.js'

function Spinner({ className, size = 'default' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    default: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2',
    xl: 'h-12 w-12 border-2',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-white/20 border-t-blue-500',
        sizes[size],
        className,
      )}
    />
  )
}

export { Spinner }

